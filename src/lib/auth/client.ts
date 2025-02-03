import { PUBLIC_BASE_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from './index';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: PUBLIC_BASE_URL,
	plugins: [inferAdditionalFields<Auth>()]
});
