import { GITHUB_CLIENT_ID, GITHUB_SECRET, PRICE_ID, WEBHOOK } from '$env/static/private';
import { db } from '../db';
import { stripe } from '@better-auth/stripe';
import { stripe as stripeClient } from '../stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import * as schema from '../db/schema';

export const auth = betterAuth({
	emailAndPassword: {
		enabled: false
	},
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_SECRET
		}
	},
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
		schema
	}),
	plugins: [
		stripe({
			stripeClient,
			stripeWebhookSecret: WEBHOOK,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: [
					{
						name: 'pro',
						priceId: PRICE_ID
					}
				],
				getCheckoutSessionParams: () => {
					return {
						params: {
							allow_promotion_codes: true
						}
					};
				}
			}
		}),
		admin({
			defaultRole: 'user',
			adminRoles: ['admin']
		})
	],
	user: {
		deleteUser: {
			enabled: true
		}
	}
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export async function getActiveSubscription(headers: Headers) {
	const subscriptions = await auth.api.listActiveSubscriptions({
		headers: headers
	});

	return subscriptions.find((s) => s.status === 'active');
}
