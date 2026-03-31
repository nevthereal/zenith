import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { resolveUserLocale, resolveUserTimeZone } from '$lib/server/user-preferences';

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
		locale: resolveUserLocale(user, event.cookies, event.request.headers),
		timeZone: resolveUserTimeZone(user, event.cookies)
	};
}
