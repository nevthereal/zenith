import { stripeClient } from '@better-auth/stripe/client';
import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from './index';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = (url: string) => {
	return createAuthClient({
		baseURL: url,
		plugins: [
			inferAdditionalFields<Auth>(),
			stripeClient({
				subscription: true
			}),
			adminClient()
		]
	});
};

export async function getActiveSubscription(baseUrl: string) {
	try {
		const { data: subscriptions } = await authClient(baseUrl).subscription.list();
		return subscriptions?.find((s) => s.status === 'active');
	} catch (error) {
		console.error('Failed to retrieve subscription status:', error);
		return undefined;
	}
}
