import { GITHUB_CLIENT_ID, GITHUB_SECRET } from '$env/static/private';
import { db } from '../db';
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
		provider: 'pg'
	}),
	user: {
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
			},
			gender: {
				type: 'string',
				input: true,
				required: false
			}
		}
	}
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
