import { github } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
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
};
