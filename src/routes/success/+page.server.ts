import type { PageServerLoad } from './$types';
import { stripe } from '$lib/stripe';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('id');

	if (!sessionId) {
		return error(404);
	}

	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ['line_items', 'invoice']
	});

	return { session };
};
