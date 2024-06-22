import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { adapter } from '$lib/db/db';

import { GitHub } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_SECRET } from '$env/static/private';

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_SECRET);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.github_id,
			username: attributes.username,
			email: attributes.email,
			admin: attributes.admin,
			paid: attributes.paid,
			stripeId: attributes.stripeId,
			joined: attributes.joined
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
	email: string | null;
	admin: boolean;
	paid: boolean;
	stripeId: string | null;
	joined: Date;
}
