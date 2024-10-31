import { redirect } from '@sveltejs/kit';
import clsx, { type ClassValue } from 'clsx';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { twMerge } from 'tailwind-merge';
import { zEditEvent, zToggleEvent } from './zod';
import type { RandomReader } from '@oslojs/crypto/random';

export function checkUser(locals: App.Locals) {
	const user = locals.user;
	if (!user) redirect(302, '/home');
	return user;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};

export const alphabet = 'ABCDEFGHIJKLMNOP';

export async function initializeEventForms() {
	const editForm = await superValidate(zod(zEditEvent));
	const toggleForm = await superValidate(zod(zToggleEvent));

	return { editForm, toggleForm };
}
