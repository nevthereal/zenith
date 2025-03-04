import { auth } from '$lib/auth';
import { authClient } from '$lib/auth/client';
import { checkUser } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = checkUser(locals);

	return { user };
};
