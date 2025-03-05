import { getActiveSubscription } from '$lib/auth';
import { checkUser } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	const user = checkUser(locals);

	const subscription = getActiveSubscription(request.headers);

	return { user, subscription };
};
