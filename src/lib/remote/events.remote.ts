import { form, query } from '$app/server';
import { invalid, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { VERCEL_GW_KEY, UNKEY_KEY } from '$env/static/private';
import { generateText, createGateway, Output } from 'ai';
import { and, eq } from 'drizzle-orm';
import { Ratelimit } from '@unkey/ratelimit';
import { db } from '$lib/db';
import { eventsTable, freeTierGenerations } from '$lib/db/schema';
import { dayjs, formatDateTimeIso, parseUserDateTime } from '$lib/datetime';
import { getActiveSubscription } from '$lib/auth';
import { prettyDate } from '$lib/utils';
import {
	zCreateEvent,
	zEditEventForm,
	zEventLLM,
	zToggleEventForm
} from '$lib/zod';
import { getUserContext } from '$lib/server/request-context';

export const getTodayEvents = query(async () => {
	const { user, timeZone } = getUserContext();

	return db.query.eventsTable.findMany({
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
});

export const getUpcomingEvents = query(async () => {
	const { user, timeZone } = getUserContext();

	return db.query.eventsTable.findMany({
		where: {
			date: {
				gt: dayjs().tz(timeZone).endOf('day').toDate()
			},
			userId: user.id,
			completed: false
		},
		orderBy: { date: 'asc' },
		with: {
			project: true
		}
	});
});

export const getCompletedEvents = query(async () => {
	const { user } = getUserContext();

	return db.query.eventsTable.findMany({
		where: {
			userId: user.id,
			completed: true
		},
		orderBy: { date: 'asc' },
		with: {
			project: true
		}
	});
});

export const createEvent = form(zCreateEvent, async ({ event }) => {
	const { user, timeZone, locale, event: requestEvent } = getUserContext();
	const nowInUserTimeZone = dayjs().tz(timeZone);
	const subscription = await getActiveSubscription(requestEvent.request.headers);

	const freeToday = await db.query.freeTierGenerations.findMany({
		where: {
			userId: user.id
		}
	});

	const freeTodayCount = freeToday.filter((entry) =>
		dayjs(entry.createdAt).tz(timeZone).isSame(dayjs().tz(timeZone), 'day')
	).length;

	if (!subscription && freeTodayCount >= 5) {
		redirect(302, '/account/billing');
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

		if (!success && user.role !== 'admin') {
			invalid(`Reached a limit. Try again at ${resetTime}`);
		}
	}

	const promptEvents = await db.query.eventsTable.findMany({
		where: {
			userId: user.id,
			completed: false
		},
		orderBy: {
			date: 'asc'
		},
		limit: 25,
		columns: {
			content: true,
			date: true
		}
	});

	const usersEventsForPrompt = promptEvents.map((entry) => ({
		content: entry.content,
		date: formatDateTimeIso(entry.date, timeZone)
	}));

	const gateway = createGateway({
		apiKey: VERCEL_GW_KEY
	});

	const { output, finishReason } = await generateText({
		model: gateway('gpt-5.4-mini'),
		system:
			`Right now is ${nowInUserTimeZone.format()} (${timeZone}, locale ${locale}). ` +
			`You are an assistant who processes the users input to an event for a todo-like app.` +
			`Please pay attention to the other events (times are in the user's time zone): ${JSON.stringify(
				usersEventsForPrompt
			)}`,
		prompt: event,
		maxRetries: 5,
		output: Output.object({
			schema: zEventLLM,
			name: 'Event',
			description: 'An event or a task'
		})
	});

	if (finishReason === 'error') {
		invalid('Generation error');
	}

	const parsedDate = parseUserDateTime(output.date, timeZone);

	if (Number.isNaN(parsedDate.getTime())) {
		invalid('Could not parse a valid date from the generated event.');
	}

	if (!dayjs(parsedDate).tz(timeZone).isAfter(nowInUserTimeZone)) {
		invalid('Generated event must be scheduled in the future.');
	}

	if (!subscription) {
		await db.insert(freeTierGenerations).values({
			userId: user.id
		});
	}

	await db.insert(eventsTable).values({
		content: output.content,
		date: parsedDate,
		userId: user.id
	});

	return { ok: true };
});

export const editEvent = form(zEditEventForm, async ({ id, event, date, projectId }) => {
	const { user, timeZone } = getUserContext();

	const existingEvent = await db.query.eventsTable.findFirst({
		where: {
			id,
			userId: user.id
		}
	});

	if (!existingEvent) {
		invalid('Event not found');
	}

	let resolvedProjectId: number | null = null;

	if (projectId !== '0') {
		const requestedProjectId = Number(projectId);

		const requestedProject = await db.query.projectsTable.findFirst({
			where: {
				id: requestedProjectId,
				userId: user.id
			}
		});

		if (!requestedProject) {
			invalid('Project not found');
		}

		resolvedProjectId = requestedProjectId;
	}

	const parsedDate = parseUserDateTime(date, timeZone);

	if (Number.isNaN(parsedDate.getTime())) {
		invalid('Invalid date provided');
	}

	await db
		.update(eventsTable)
		.set({
			content: event,
			date: parsedDate,
			projectId: resolvedProjectId
		})
		.where(and(eq(eventsTable.id, id), eq(eventsTable.userId, user.id)));

	return { ok: true };
});

export const toggleEvent = form(zToggleEventForm, async ({ id, action }) => {
	const { user } = getUserContext();

	const existingEvent = await db.query.eventsTable.findFirst({
		where: {
			id,
			userId: user.id
		}
	});

	if (!existingEvent) {
		invalid('Event not found');
	}

	if (action === 'complete' || action === 'uncomplete') {
		await db
			.update(eventsTable)
			.set({
				completed: action === 'complete'
			})
			.where(and(eq(eventsTable.id, id), eq(eventsTable.userId, user.id)));
	} else {
		await db
			.delete(eventsTable)
			.where(and(eq(eventsTable.id, id), eq(eventsTable.userId, user.id)));
	}

	return { ok: true };
});
