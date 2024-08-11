import { zEventLLM, zCreateEvent, zEditEvent, zToggleEvent } from '$lib/zod';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { db } from '$lib/db/db';
import { eventsTable, projectsTable, usersTable } from '$lib/db/schema';
import { and, asc, eq, lt } from 'drizzle-orm';
import { checkUser, initializeEventForms } from '$lib/utils';
import { UPSTASH_TOKEN, UPSTASH_URL } from '$env/static/private';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const events = db.query.eventsTable.findMany({
		orderBy: asc(eventsTable.date),
		where: and(
			lt(eventsTable.date, dayjs().endOf('day').toDate()),
			eq(eventsTable.userId, user.id),
			eq(eventsTable.completed, false)
		),
		with: {
			project: true
		}
	});

	const remaining = 3 - user.quota;

	const createForm = await superValidate(zod(zCreateEvent));

	const { editForm, toggleForm } = await initializeEventForms();

	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.userId, user.id),
		columns: {
			id: true,
			name: true
		}
	});

	return { createForm, events, editForm, user, toggleForm, projects, remaining };
};

export const actions = {
	create: async ({ request, locals, getClientAddress }) => {
		const form = await superValidate(request, zod(zCreateEvent));

		const user = checkUser(locals);

		if (user.quota >= 3) return fail(400);

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!dev) {
			const redis = new Redis({
				url: UPSTASH_URL,
				token: UPSTASH_TOKEN
			});

			const ratelimit = new Ratelimit({
				redis,
				limiter: Ratelimit.cachedFixedWindow(10, '1h')
			});
			const ip = getClientAddress();
			const rateLimitAttempt = await ratelimit.limit(`create_${ip}`);

			if (!rateLimitAttempt.success && !user.admin) {
				return setError(form, 'Too many requests. Try again later', { status: 429 });
			}
		}

		const { object } = await generateObject({
			model: model,
			schema: zEventLLM,
			mode: 'tool',
			system: `Right now is the ${dayjs().toDate()}. You are an assistant who processes the users input to an event.`,
			prompt: form.data.event
		});

		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id
		});

		if (!user.paid) {
			await db
				.update(usersTable)
				.set({
					quota: user.quota + 1
				})
				.where(eq(usersTable.id, user.id));
		}

		return { form };
	},
	edit: async ({ request, locals }) => {
		const user = checkUser(locals);

		if (!user.paid) redirect(302, '/account');

		const form = await superValidate(request, zod(zEditEvent));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (
			!(await db.query.eventsTable.findFirst({
				where: and(eq(eventsTable.id, form.data.id), eq(eventsTable.userId, user.id))
			}))
		) {
			return fail(429, { form });
		}

		let projectId: number | null = null;
		if (form.data.projectId != 0) {
			const requestedProject = await db.query.projectsTable.findFirst({
				where: eq(projectsTable.id, form.data.projectId)
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
				where: and(eq(eventsTable.id, form.data.id), eq(eventsTable.userId, user.id))
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
