import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';

export const load = async () => {
	if (browser && !dev) {
		posthog.init('phc_DkZgKGpAWySJn06QEdtqqf63siy4GUFnbtb7Lw9hRVZ', {
			api_host: 'https://us.i.posthog.com',
			person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
		});
	}
	return;
};
