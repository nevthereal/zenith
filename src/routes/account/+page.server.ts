import type { PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { db } from '$lib/db';
import { and, count, eq } from 'drizzle-orm';
import { eventsTable } from '$lib/db/schema';
import { auth } from '$lib/auth';

export const load: PageServerLoad = async ({ locals, request }) => {
	const user = checkUser(locals);

	const [{ completedCount }] = await db
		.select({ completedCount: count() })
		.from(eventsTable)
		.where(and(eq(eventsTable.completed, true), eq(eventsTable.userId, user.id)));

	const subscription = await auth.api
		.listActiveSubscriptions({
			headers: request.headers
		})
		.then((subscriptions) => subscriptions.find((s) => s.status === 'active'));

	return { user, completedCount, subscription };
};
