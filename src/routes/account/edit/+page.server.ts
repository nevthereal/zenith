import type { PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	checkUser(locals);

	return {};
};
