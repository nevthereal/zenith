import { redirect } from '@sveltejs/kit';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const checkUser = (locals: App.Locals) => {
	const user = locals.user;
	if (!user) redirect(302, '/signin');
	return user;
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
