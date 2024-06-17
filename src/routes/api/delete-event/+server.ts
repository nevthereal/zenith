import { db } from '$lib/db/db';
import { eventsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { checkUser } from '$lib/utils';

export const DELETE: RequestHandler = async ({ url, locals }) => {
	const user = checkUser(locals);

	const eventId = Number(url.searchParams.get('id'));

	const qEvent = await db.query.eventsTable.findFirst({ where: eq(eventsTable.id, eventId) });

	if (!qEvent) {
		return new Response('Event not found', { status: 404 });
	} else if (qEvent.userId != user.id) {
		return new Response('Not your post', { status: 401 });
	} else if (user.admin || qEvent.userId === user.id) {
		await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
	}

	return new Response('Success');
};
