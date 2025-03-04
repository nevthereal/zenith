import { GITHUB_CLIENT_ID, GITHUB_SECRET, WEBHOOK } from '$env/static/private';
import { db } from '../db';
import { stripe } from '@better-auth/stripe';
import { stripe as stripeClient } from '$lib/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

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
		usePlural: true
	}),
	plugins: [
		stripe({
			stripeClient,
			stripeWebhookSecret: WEBHOOK!,
			createCustomerOnSignUp: true
		})
	],
	user: {
		deleteUser: {
			enabled: true
		},
		additionalFields: {
			paid: {
				type: 'boolean',
				input: false,
				required: true,
				defaultValue: false
			},
			admin: {
				type: 'boolean',
				defaultValue: false,
				input: false
			}
		}
	}
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
