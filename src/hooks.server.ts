import { auth } from '$lib/auth';
import { resolveUserLocale, resolveUserTimeZone } from '$lib/server/user-preferences';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		const timeZone = resolveUserTimeZone(session.user, event.cookies);
		const locale = resolveUserLocale(session.user, event.cookies, event.request.headers);

		event.locals.user = { ...session.user, timeZone, locale };
		event.locals.session = session.session;
	}

	return svelteKitHandler({ event, resolve, auth });
}
