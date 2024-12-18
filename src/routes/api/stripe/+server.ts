import { PRICE_ID } from '$env/static/private';
import { stripe } from '$lib/stripe';
import { checkUser } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const user = checkUser(locals);

	if (!user.emailVerified) return redirect(302, '/account/email');

	const session = await stripe.checkout.sessions.create({
		customer_email: user.email!,
		line_items: [{ price: PRICE_ID, quantity: 1 }],
		allow_promotion_codes: true,
		mode: 'payment',
		customer_creation: 'always',
		success_url: `${url.origin}/`,
		cancel_url: `${url.origin}/account/billing`
	});
	redirect(302, session.url as string);
};
