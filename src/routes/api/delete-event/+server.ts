import { db } from '$lib/db/db';
import { eventsTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ url }) => {
	const eventId = Number(url.searchParams.get('id'));

	await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
	return new Response();
};
