import type { PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { db } from '$lib/db';
import { and, count, eq } from 'drizzle-orm';
import { eventsTable } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const [{ completedCount }] = await db
		.select({ completedCount: count() })
		.from(eventsTable)
		.where(and(eq(eventsTable.completed, true), eq(eventsTable.userId, user.id)));

	return { user, completedCount };
};
