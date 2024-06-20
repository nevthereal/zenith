import { STRIPE_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import clsx, { type ClassValue } from 'clsx';
import Stripe from 'stripe';
import { twMerge } from 'tailwind-merge';

export const checkUser = (locals: App.Locals) => {
	const user = locals.user;
	if (!user) redirect(302, '/signin');
	return user;
};

export const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: '2024-04-10'
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
