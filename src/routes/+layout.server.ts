import type { LayoutServerLoad } from './$types';
import posthog from 'posthog-js';
import { browser } from '$app/environment';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (browser) {
		posthog.init('phc_DkZgKGpAWySJn06QEdtqqf63siy4GUFnbtb7Lw9hRVZ', {
			api_host: 'https://us.i.posthog.com',
			person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
		});
	}

	return { user: locals.user };
};
