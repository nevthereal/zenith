import { zEventLLM, zCreateEvent, zEditEvent, zToggleEvent } from '$lib/zod';
import { OPENAI_KEY, UNKEY_KEY } from '$env/static/private';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { db } from '$lib/db';
import { eventsTable, freeTierGenerations } from '$lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { checkUser, initializeEventForms, prettyDate } from '$lib/utils';
import { dev } from '$app/environment';
import { getActiveSubscription } from '$lib/auth';
import { Ratelimit } from '@unkey/ratelimit';

export const load: PageServerLoad = async ({ locals, request }) => {
	const user = checkUser(locals);

	const events = db.query.eventsTable.findMany({
		orderBy: { date: 'asc' },
		where: {
			date: {
				lt: dayjs().endOf('day').toDate()
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
		dayjs(e.createdAt).isSame(new Date(), 'day')
	).length;

	const createForm = await superValidate(zod(zCreateEvent));

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

	return { createForm, events, editForm, user, toggleForm, projects, subscription, freeTodayCount };
};

export const actions = {
	create: async ({ request, locals }) => {
		const user = checkUser(locals);

		const subscription = await getActiveSubscription(request.headers);
		const freeToday = await db.query.freeTierGenerations.findMany({
			where: {
				userId: user.id
			}
		});

		const freeTodayCount = freeToday.filter((e) => dayjs(e.createdAt).isSame('day')).length;

		if (!subscription && freeTodayCount >= 5) return redirect(302, '/account/billing');

		const form = await superValidate(request, zod(zCreateEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (dev) {
			const limiter = new Ratelimit({
				namespace: 'create-event',
				limit: 5,
				duration: '30s',
				rootKey: UNKEY_KEY
			});

			const { success, reset } = await limiter.limit(user.id);

			const resetTime = prettyDate(dayjs(reset).toDate());

			if (!success && user.role != 'admin') {
				return setError(form, `Reached a limit. Try again at ${resetTime}`, { status: 429 });
			}
		}

		const { object, finishReason } = await generateObject({
			model: createOpenAI({
				apiKey: OPENAI_KEY
			})('gpt-4o-mini'),
			schema: zEventLLM,
			schemaName: 'Event',
			schemaDescription: 'An event or a task',
			system:
				`Right now is ${new Date()}.` +
				`You are an assistant who processes the users input to an event for a todo-like app.`,
			prompt: form.data.event,
			maxRetries: 5
		});

		if (finishReason == 'error') return setError(form, 'Generation error');

		if (!subscription) {
			await db.insert(freeTierGenerations).values({
				userId: user.id
			});
		}

		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id
		});

		return { form };
	},
	edit: async ({ request, locals }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zEditEvent));

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
				date: dayjs(form.data.date).toDate(),
				projectId: projectId
			})
			.where(eq(eventsTable.id, form.data.id));
		return { form };
	},
	toggle: async ({ request, locals }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zToggleEvent));

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
