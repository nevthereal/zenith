import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export function requireUser() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		redirect(302, '/home');
	}

	return locals.user;
}

export function getUserContext() {
	const event = getRequestEvent();
	const user = requireUser();

	return {
		event,
		user,
		locale: user.locale ?? 'en-US',
		timeZone: user.timeZone ?? 'UTC'
	};
}
