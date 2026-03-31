import { redirect } from '@sveltejs/kit';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDateTime } from './datetime';

export function checkUser(locals: App.Locals) {
	const user = locals.user;
	if (!user) redirect(302, '/home');
	return user;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function prettyDate(
	date: Date,
	options?: { locale?: string | null; timeZone?: string | null }
) {
	return formatDateTime(date, options);
}
