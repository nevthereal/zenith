import { OAuth2RequestError } from 'arctic';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { usersTable } from '$lib/db/schema';
import { createSession, generateSessionToken, github } from '$lib/auth';
import { setSessionTokenCookie } from '$lib/auth/cookies';
import { randomUUID } from 'crypto';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.username, githubUser.login)
		});

		if (existingUser) {
			const token = generateSessionToken();
			const session = await createSession(token, existingUser.id);
			setSessionTokenCookie(event, token, session.expiresAt);
		} else {
			const userId = randomUUID();

			await db.insert(usersTable).values({
				email: githubUser.email,
				id: userId,
				provider: 'github',
				username: githubUser.login,
				joined: new Date(),
				emailVerified: githubUser.email ? true : false
			});

			const token = generateSessionToken();
			const session = await createSession(token, userId);
			setSessionTokenCookie(event, token, session.expiresAt);
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		console.error(e);
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	login: string;
	email: string | null;
}
