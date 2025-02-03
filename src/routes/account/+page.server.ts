import { auth } from '$lib/auth';
import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { and, count, eq } from 'drizzle-orm';
import { eventsTable } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const query = await db
		.select({ value: count() })
		.from(eventsTable)
		.where(and(eq(eventsTable.completed, true), eq(eventsTable.userId, user.id)));

	return { user, completedCount: query[0].value };
};
