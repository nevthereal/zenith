import { POLAR_PRODUCT_ID } from '$env/static/private';
import { generateCustomerId, polar } from '$lib/polar';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkUser } from '$lib/utils';
import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = checkUser(locals);

	if (!user.emailVerified) return redirect(302, '/account/email');

	let customerId: string;

	if (!user.customerId) {
		const [{ id }] = await db
			.update(usersTable)
			.set({
				customerId: await generateCustomerId(user.email!)
			})
			.where(eq(usersTable.id, user.id))
			.returning({ id: usersTable.customerId });

		if (!id) throw new Error('Failed to generate customer ID');
		customerId = id;
	} else {
		customerId = user.customerId;
	}

	const session = await polar.checkouts.custom.create({
		productId: POLAR_PRODUCT_ID,
		successUrl: `${url.origin}/`,
		customerId
	});

	return redirect(302, session.url);
};
