import { auth } from '$lib/auth';
import { checkUser } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	const user = checkUser(locals);

	const subscription = await auth.api
		.listActiveSubscriptions({
			headers: request.headers
		})
		.then((subscriptions) => subscriptions.find((s) => s.status === 'active'));

	return { user, subscription };
};
