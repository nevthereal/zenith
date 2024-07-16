import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { lucia } from '$lib/auth/lucia';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	return { user };
};
export const actions: Actions = {
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
};
