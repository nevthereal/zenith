import { WEBHOOK } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';
import type Stripe from 'stripe';
import { db } from '$lib/db/db';
import { ordersTable, usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const whSecret = WEBHOOK;
	const body = await request.text();

	const signature = request.headers.get('stripe-signature') ?? '';

	try {
		const event = stripe.webhooks.constructEvent(body, signature, whSecret);

		const eventType = event.type;

		if (eventType === 'checkout.session.completed') {
			const sessionWithCustomer = await stripe.checkout.sessions.retrieve(event.data.object.id, {
				expand: ['customer', 'invoice']
			});

			const customer = sessionWithCustomer.customer as Stripe.Customer;
			const invoice = sessionWithCustomer.invoice as Stripe.Invoice;

			const [updatedUser] = await db
				.update(usersTable)
				.set({
					stripeId: customer.id,
					paid: true
				})
				.where(eq(usersTable.email, sessionWithCustomer.customer_email as string))
				.returning({ userId: usersTable.id });

			await db.insert(ordersTable).values({
				completedAt: new Date(),
				customerId: customer.id,
				orderId: sessionWithCustomer.payment_intent as string,
				userId: updatedUser.userId,
				sessionId: sessionWithCustomer.id,
				invoiceUrl: invoice.hosted_invoice_url as string
			});
		}
	} catch (err) {
		console.log('Something went wrong.', err);
		error(500);
	}

	return json({ success: true });
};
