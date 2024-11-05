import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { and, count, eq } from 'drizzle-orm';
import { eventsTable } from '$lib/db/schema';
import { invalidateSession } from '$lib/auth';
import { deleteSessionTokenCookie } from '$lib/auth/cookies';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const query = await db
		.select({ value: count() })
		.from(eventsTable)
		.where(and(eq(eventsTable.completed, true), eq(eventsTable.userId, user.id)));

	return { user, completedCount: query[0].value };
};
export const actions = {
	signout: async (event) => {
		if (event.locals.session === null) {
			return new Response('Failed', { status: 405 });
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);

		redirect(302, '/signin');
	}
} satisfies Actions;
