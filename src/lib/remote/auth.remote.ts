import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const checkUser = query(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user) redirect(302, '/home');

	return locals.user;
});
