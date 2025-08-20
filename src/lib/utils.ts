import { redirect } from '@sveltejs/kit';
import clsx, { type ClassValue } from 'clsx';
import { superValidate } from 'sveltekit-superforms';
import { zod, zod4 } from 'sveltekit-superforms/adapters';
import { twMerge } from 'tailwind-merge';
import { zEditEvent, zToggleEvent } from './zod';

export function checkUser(locals: App.Locals) {
	const user = locals.user;
	if (!user) redirect(302, '/home');
	return user;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function initializeEventForms() {
	const editForm = await superValidate(zod4(zEditEvent));
	const toggleForm = await superValidate(zod4(zToggleEvent));

	return { editForm, toggleForm };
}

export function prettyDate(date: Date) {
	return Intl.DateTimeFormat('en', { dateStyle: 'long', timeStyle: 'short' }).format(date);
}
