import { GITHUB_CLIENT_ID, GITHUB_SECRET } from '$env/static/private';
import { db } from '../db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
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
	user: {
		modelName: 'usersTable',
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
	},
	session: {
		modelName: 'sessionsTable'
	},
	account: {
		modelName: 'accountsTable'
	},
	verification: {
		modelName: 'verificationsTable'
	}
});

export type Auth = typeof auth;
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
