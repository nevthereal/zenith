import { zEventLLM, zCreateEvent, zEditEvent, zToggleEvent } from '$lib/zod';
import { VERCEL_GW_KEY, UNKEY_KEY } from '$env/static/private';
import { createGateway } from '@ai-sdk/gateway';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { dayjs, formatDateTimeIso, parseUserDateTime } from '$lib/datetime';
import { db } from '$lib/db';
import { eventsTable, freeTierGenerations } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { checkUser, initializeEventForms, prettyDate } from '$lib/utils';
import { dev } from '$app/environment';
import { getActiveSubscription } from '$lib/auth';
import { Ratelimit } from '@unkey/ratelimit';
import { resolveUserLocale, resolveUserTimeZone } from '$lib/server/user-preferences';

export const load: PageServerLoad = async ({ locals, request, cookies }) => {
	const user = checkUser(locals);
	const timeZone = resolveUserTimeZone(user, cookies);

	const events = db.query.eventsTable.findMany({
		orderBy: { date: 'asc' },
		where: {
			date: {
				lt: dayjs().tz(timeZone).endOf('day').toDate()
			},
			userId: user.id,
			completed: false
		},
		with: {
			project: true
		}
	});

	const freeToday = await db.query.freeTierGenerations.findMany({
		where: {
			userId: user.id
		}
	});

	const freeTodayCount = freeToday.filter((e) =>
		dayjs(e.createdAt).tz(timeZone).isSame(dayjs().tz(timeZone), 'day')
	).length;

	const createForm = await superValidate(zod4(zCreateEvent));

	const { editForm, toggleForm } = await initializeEventForms();

	const subscription = await getActiveSubscription(request.headers);

	const projects = await db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		columns: {
			id: true,
			name: true
		}
	});

	return {
		createForm,
		events,
		editForm,
		user,
		toggleForm,
		projects,
		subscription,
		freeTodayCount
	};
};

export const actions = {
	create: async ({ request, locals, cookies }) => {
		const user = checkUser(locals);
		const timeZone = resolveUserTimeZone(user, cookies);
		const locale = resolveUserLocale(user, cookies, request.headers);

		const subscription = await getActiveSubscription(request.headers);
		const freeToday = await db.query.freeTierGenerations.findMany({
			where: {
				userId: user.id
			}
		});

		const freeTodayCount = freeToday.filter((e) =>
			dayjs(e.createdAt).tz(timeZone).isSame(dayjs().tz(timeZone), 'day')
		).length;

		if (!subscription && freeTodayCount >= 5) return redirect(302, '/account/billing');

		const form = await superValidate(request, zod4(zCreateEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!dev) {
			const limiter = new Ratelimit({
				namespace: 'create-event',
				limit: 5,
				duration: '30s',
				rootKey: UNKEY_KEY
			});

			const { success, reset } = await limiter.limit(user.id);

			const resetTime = prettyDate(dayjs(reset).toDate(), { locale, timeZone });

			if (!success && user.role != 'admin') {
				return setError(form, `Reached a limit. Try again at ${resetTime}`, { status: 429 });
			}
		}

		const usersEvents = await db.query.eventsTable.findMany({
			where: {
				userId: user.id
			}
		});

		const nowInUserTimeZone = dayjs().tz(timeZone);
		const usersEventsForPrompt = usersEvents.map((event) => ({
			content: event.content,
			date: formatDateTimeIso(event.date, timeZone)
		}));

		const { object, finishReason } = await generateObject({
			model: createGateway({
				apiKey: VERCEL_GW_KEY
			})('gpt-5-mini'),
			schema: zEventLLM,
			schemaName: 'Event',
			schemaDescription: 'An event or a task',
			system:
				`Right now is ${nowInUserTimeZone.format()} (${timeZone}, locale ${locale}). ` +
				`You are an assistant who processes the users input to an event for a todo-like app.` +
				`Please pay attention to the other events (times are in the user's time zone): ${JSON.stringify(
					usersEventsForPrompt
				)}`,
			prompt: form.data.event,
			maxRetries: 5
		});

		if (finishReason == 'error') return setError(form, 'Generation error');

		const parsedDate = parseUserDateTime(object.date, timeZone);
		if (Number.isNaN(parsedDate.getTime())) {
			return setError(form, 'Could not parse a valid date from the generated event.');
		}

		if (!subscription) {
			await db.insert(freeTierGenerations).values({
				userId: user.id
			});
		}

		await db.insert(eventsTable).values({
			content: object.content,
			date: parsedDate,
			userId: user.id
		});

		return { form };
	},
	edit: async ({ request, locals, cookies }) => {
		const user = checkUser(locals);
		const timeZone = resolveUserTimeZone(user, cookies);

		const formData = await request.clone().formData();
		const rawDate = formData.get('date');

		const form = await superValidate(request, zod4(zEditEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (
			!(await db.query.eventsTable.findFirst({
				where: {
					id: form.data.id,
					userId: user.id
				}
			}))
		) {
			return fail(429, { form });
		}

		let projectId: number | null = null;
		if (form.data.projectId != 0) {
			const requestedProject = await db.query.projectsTable.findFirst({
				where: {
					id: form.data.projectId,
					userId: user.id
				}
			});
			if (!requestedProject) {
				return fail(404, { form });
			} else if (requestedProject.userId === user.id) {
				projectId = form.data.projectId;
			} else {
				return fail(429, { form });
			}
		}

		await db
			.update(eventsTable)
			.set({
				content: form.data.event,
				date: (() => {
					if (typeof rawDate === 'string') {
						const parsed = parseUserDateTime(rawDate, timeZone);
						return Number.isNaN(parsed.getTime()) ? dayjs(form.data.date).toDate() : parsed;
					}
					return dayjs(form.data.date).toDate();
				})(),
				projectId: projectId
			})
			.where(eq(eventsTable.id, form.data.id));
		return { form };
	},
	toggle: async ({ request, locals }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod4(zToggleEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (
			!(await db.query.eventsTable.findFirst({
				where: {
					id: form.data.id,
					userId: user.id
				}
			}))
		) {
			return fail(429, { form });
		}

		const action = form.data.action;

		if (action === 'complete' || action === 'uncomplete') {
			await db
				.update(eventsTable)
				.set({
					completed: action === 'complete' ? true : false
				})
				.where(eq(eventsTable.id, form.data.id));
		} else {
			await db
				.delete(eventsTable)
				.where(and(eq(eventsTable.id, form.data.id), eq(eventsTable.userId, user.id)));
		}

		return { form };
	}
} satisfies Actions;
