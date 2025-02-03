import { PUBLIC_BASE_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from './index';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { dev } from '$app/environment';

export const authClient = createAuthClient({
	baseURL: dev ? PUBLIC_BASE_URL : process.env.VERCEL_URL,
	plugins: [inferAdditionalFields<Auth>()]
});
