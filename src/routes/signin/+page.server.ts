import { generateState } from 'arctic';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { github } from '$lib/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, '/account');

	return { user: locals.user };
};

export const actions: Actions = {
	github: async ({ cookies }) => {
		const state = generateState();
		const url = await github.createAuthorizationURL(state);

		cookies.set('github_oauth_state', state, {
			path: '/',
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax'
		});

		redirect(302, url.toString());
	}
};
