import { checkUser } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	return { user };
};
