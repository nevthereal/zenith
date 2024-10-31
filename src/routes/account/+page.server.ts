import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { lucia } from '$lib/auth/lucia';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { and, eq } from 'drizzle-orm';
import { eventsTable } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const completedCount = await db.query.eventsTable.findMany({
		where: and(eq(eventsTable.completed, true), eq(eventsTable.userId, user.id))
	});

	return { user, completedCount };
};
export const actions = {
	signout: async ({ locals, cookies }) => {
		if (!locals.session) {
			return new Response('Failed', { status: 405 });
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/signin');
	}
} satisfies Actions;
