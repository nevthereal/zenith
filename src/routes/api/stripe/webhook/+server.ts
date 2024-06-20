import { WEBHOOK } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';
import type Stripe from 'stripe';
import { db } from '$lib/db/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const whSecret = WEBHOOK;
	if (!whSecret) return new Response('No Webhook', { status: 401 });
	const body = await request.text();

	const signature = request.headers.get('stripe-signature') ?? '';

	try {
		const event = stripe.webhooks.constructEvent(body, signature, whSecret);

		const eventType = event.type;

		if (eventType === 'checkout.session.completed') {
			const sessionWithCustomer = await stripe.checkout.sessions.retrieve(event.data.object.id, {
				expand: ['customer']
			});

			if (sessionWithCustomer.metadata) {
				const customer = sessionWithCustomer.customer as Stripe.Customer;

				console.log(customer);

				await db
					.update(usersTable)
					.set({
						stripeId: customer.id,
						paid: true
					})
					.where(eq(usersTable.id, sessionWithCustomer.metadata.userId));
			}
		}
	} catch (err) {
		console.log(`⚠️  Webhook signature verification failed.`, err);
		error(500);
	}

	return json({ success: true });
};
