import { lucia } from '$lib/auth/lucia';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.session) {
		return new Response('Failed', { status: 405 });
	}
	await lucia.invalidateSession(locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	return new Response('Success');
};
