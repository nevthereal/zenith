import { WEBHOOK } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/utils';
import type Stripe from 'stripe';
import { db } from '$lib/db/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

export const POST: RequestHandler = async ({ request }) => {
	const whSecret = WEBHOOK;
	if (!whSecret) return new Response('No Webhook', { status: 401 });
	const _rawBody = await request.arrayBuffer();
	const payload = toBuffer(_rawBody);

	const signature = request.headers.get('stripe-signature') ?? '';

	try {
		const event = stripe.webhooks.constructEvent(payload, signature, whSecret);
		const eventType = event.type;

		if (eventType === 'checkout.session.completed') {
			const sessionWithCustomer = await stripe.checkout.sessions.retrieve(event.data.object.id, {
				expand: ['customer']
			});

			if (sessionWithCustomer.metadata) {
				const customer = sessionWithCustomer.customer as Stripe.Customer | null;
				if (customer) {
					// add customer to user
					const userId = sessionWithCustomer.metadata.userId as string;
					if (userId !== '') {
						await db
							.update(usersTable)
							.set({
								stripeId: customer.id
							})
							.where(eq(usersTable.id, userId));
					}
				}
			}
		}
	} catch (err) {
		console.log(`⚠️  Webhook signature verification failed.`, err);
		error(500);
	}

	return json({ success: true });
};
