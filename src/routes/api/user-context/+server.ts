import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { normalizeLocale, safeTimeZone } from '$lib/datetime';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const user = locals.user;
	if (!user) {
		return json({ ok: false }, { status: 401 });
	}

	let body: { locale?: string; timeZone?: string } | null = null;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false }, { status: 400 });
	}

	const locale = normalizeLocale(body?.locale);
	const timeZone = safeTimeZone(body?.timeZone);

	if (!locale && !timeZone) {
		return json({ ok: true });
	}

	await db
		.update(users)
		.set({
			locale: locale ?? user.locale ?? null,
			timeZone: timeZone ?? user.timeZone ?? null,
			updatedAt: new Date()
		})
		.where(eq(users.id, user.id));

	if (timeZone) {
		cookies.set('tz', timeZone, {
			path: '/',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
	}

	if (locale) {
		cookies.set('locale', locale, {
			path: '/',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
	}

	return json({ ok: true });
};
