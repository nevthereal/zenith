import type { Cookies } from '@sveltejs/kit';
import type { AppUser } from '$lib/auth';
import { normalizeLocale, safeTimeZone } from '$lib/datetime';

export function resolveUserTimeZone(user: AppUser | null, cookies: Cookies) {
	const userTimeZone = safeTimeZone(user?.timeZone);
	if (userTimeZone) return userTimeZone;

	const cookieTimeZone = safeTimeZone(cookies.get('tz'));
	if (cookieTimeZone) return cookieTimeZone;

	return 'UTC';
}

export function resolveUserLocale(user: AppUser | null, cookies: Cookies, headers: Headers) {
	const userLocale = normalizeLocale(user?.locale);
	if (userLocale) return userLocale;

	const cookieLocale = normalizeLocale(cookies.get('locale'));
	if (cookieLocale) return cookieLocale;

	const headerLocale = normalizeLocale(headers.get('accept-language')?.split(',')[0]);
	return headerLocale ?? 'en-US';
}
