import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, '/account');

	return { user: locals.user };
};
