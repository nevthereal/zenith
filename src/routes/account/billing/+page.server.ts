import { db } from '$lib/db/db';
import { checkUser } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { ordersTable } from '$lib/db/schema';
import { stripe } from '$lib/stripe';
import { PRICE_ID } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const order = await db.query.ordersTable.findFirst({
		where: eq(ordersTable.userId, user.id)
	});

	return { user, order };
};

export const actions = {
	purchase: async ({ locals, url }) => {
		const user = checkUser(locals);

		const session = await stripe.checkout.sessions.create({
			line_items: [{ price: PRICE_ID, quantity: 1 }],
			customer_email: user.email || undefined,
			allow_promotion_codes: true,
			mode: 'payment',
			metadata: {
				userId: user.id
			},
			invoice_creation: {
				enabled: true
			},
			customer_creation: 'always',
			success_url: `${url.origin}/success?id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.href}`
		});
		redirect(302, session.url as string);
	}
} satisfies Actions;
