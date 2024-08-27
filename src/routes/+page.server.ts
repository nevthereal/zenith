import { zEventLLM, zCreateEvent, zEditEvent, zToggleEvent } from '$lib/zod';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { db } from '$lib/db/db';
import { eventsTable, projectsTable } from '$lib/db/schema';
import { and, asc, eq, gt, lt } from 'drizzle-orm';
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

	const createForm = await superValidate(zod(zCreateEvent));

	const { editForm, toggleForm } = await initializeEventForms();

	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.userId, user.id),
		columns: {
			id: true,
			name: true
		}
	});

	return { createForm, events, editForm, user, toggleForm, projects };
};

export const actions = {
	create: async ({ request, locals }) => {
		const form = await superValidate(request, zod(zCreateEvent));

		const user = checkUser(locals);

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
				limiter: Ratelimit.slidingWindow(10, '1h'),
				prefix: 'create-event',
				analytics: true
			});
			const rateLimitAttempt = await ratelimit.limit(user.id);

			if (!rateLimitAttempt.success && !user.admin) {
				return setError(form, 'Too many requests. Try again later', { status: 429 });
			}
		}

		const usersEvents = await db.query.eventsTable.findMany({
			where: and(
				eq(eventsTable.userId, user.id),
				gt(eventsTable.date, dayjs().toDate()),
				eq(eventsTable.completed, false)
			),
			columns: {
				completed: false,
				content: true,
				date: true,
				id: false,
				projectId: false,
				userId: false
			}
		});

		console.log(JSON.stringify(usersEvents));

		const { object } = await generateObject({
			model: model,
			schema: zEventLLM,
			mode: 'tool',
			system: `Right now is the ${dayjs().toDate()}. You are an assistant who processes the users input to an event. Pay attention to the user's other events: ${usersEvents}.`,
			prompt: form.data.event
		});

		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id
		});

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
