import { POLAR_PRODUCT_ID } from '$env/static/private';
import { polar } from '$lib/polar';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const session = await polar.checkouts.custom.create({
		productId: POLAR_PRODUCT_ID,
		successUrl: `${url.origin}/`
	});

	return redirect(302, session.url);
};
