import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/db';
import dayjs from 'dayjs';
import { checkUser } from './auth.remote';
import { activeSubscription } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import { zCreateEvent, zEditEvent, zEventLLM } from '$lib/zod';
import { dev } from '$app/environment';
import { Ratelimit } from '@unkey/ratelimit';
import { UNKEY_KEY, VERCEL_GW_KEY } from '$env/static/private';
import { prettyDate } from '$lib/utils';
import { generateObject } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { eventsTable, freeTierGenerations } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const getEvents = query(async () => {
	const user = await checkUser();

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

	return events;
});

export const getFreeCount = query(async () => {
	const user = await checkUser();
	const freeToday = await db.query.freeTierGenerations.findMany({
		where: {
			userId: user.id
		}
	});

	const freeTodayCount = freeToday.filter((e) =>
		dayjs(e.createdAt).isSame(new Date(), 'day')
	).length;

	return freeTodayCount;
});

export const getProjects = query(async () => {
	const user = await checkUser();

	const projects = await db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		columns: {
			id: true,
			name: true
		}
	});

	return projects;
});

export const getActiveSubscription = query(async () => {
	const { request } = getRequestEvent();
	const subscription = await activeSubscription(request.headers);

	return subscription;
});

export const createTask = form(zCreateEvent, async (data, invalid) => {
	const user = await checkUser();

	const subscription = await getActiveSubscription();

	const freeTodayCount = await getFreeCount();

	if (!subscription && freeTodayCount >= 5) return redirect(302, '/account/billing');

	if (!dev) {
		const limiter = new Ratelimit({
			namespace: 'create-event',
			limit: 5,
			duration: '30s',
			rootKey: UNKEY_KEY
		});

		const { success, reset } = await limiter.limit(user.id);

		const resetTime = prettyDate(dayjs(reset).toDate());

		if (!success && user.role != 'admin') {
			return invalid({ message: `Reached a limit. Try again at ${resetTime}` });
		}
	}

	const usersEvents = await db.query.eventsTable.findMany({
		where: {
			userId: user.id
		}
	});

	const { object, finishReason } = await generateObject({
		model: createGateway({
			apiKey: VERCEL_GW_KEY
		})('gpt-5-mini'),
		schema: zEventLLM,
		schemaName: 'Event',
		schemaDescription: 'An event or a task',
		system:
			`Right now is ${new Date()}.` +
			`You are an assistant who processes the users input to an event for a todo-like app.` +
			`Please pay attention to the other events: ${usersEvents}`,
		prompt: data.event,
		maxRetries: 5
	});

	if (finishReason == 'error') return invalid('Generation error');

	await db.transaction(async (tx) => {
		if (!subscription) {
			await tx.insert(freeTierGenerations).values({
				userId: user.id
			});
		}
		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id
		});
	});

	return object;
});

export const edit = form(zEditEvent, async (data, invalid) => {
	const user = await checkUser();

	if (
		!(await db.query.eventsTable.findFirst({
			where: {
				id: data.id,
				userId: user.id
			}
		}))
	) {
		return error(401);
	}

	const [updatedEvent] = await db
		.update(eventsTable)
		.set({
			content: data.event,
			date: dayjs(data.date).toDate(),
			projectId: data.projectId != 0 ? data.projectId : null
		})
		.where(eq(eventsTable.id, data.id))
		.returning();
	return updatedEvent;
});
