import { PRICE_ID } from '$env/static/private';
import { stripe } from '$lib/stripe';
import { checkUser } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const user = checkUser(locals);

	if (!user.emailVerified) return redirect(302, '/account/email');

	const session = await stripe.checkout.sessions.create({
		line_items: [{ price: PRICE_ID, quantity: 1 }],
		customer_email: user.email,
		allow_promotion_codes: true,
		mode: 'payment',
		invoice_creation: {
			enabled: true
		},
		customer_creation: 'always',
		success_url: `${url.origin}/success?id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${url.origin}/account/billing`
	});
	redirect(302, session.url as string);
};
