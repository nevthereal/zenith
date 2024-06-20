import { PRICE_ID } from '$env/static/private';
import type { RequestHandler } from './$types';
import { checkUser } from '$lib/utils';
import { stripe } from '$lib/stripe';

export const POST: RequestHandler = async ({ url, locals }) => {
	const user = checkUser(locals);

	const session = await stripe.checkout.sessions.create({
		line_items: [{ price: PRICE_ID, quantity: 1 }],
		customer_email: user.email,
		allow_promotion_codes: true,
		mode: 'payment',
		metadata: {
			userId: user.id
		},
		customer_creation: 'always',
		success_url: `${url.origin}/success`,
		cancel_url: `${url.origin}/cancel`
	});

	return new Response(JSON.stringify({ url: session.url }), {
		status: 200,
		headers: { 'content-type': 'application/json' }
	});
};
