import { dev } from '$app/environment';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: dev ? 'sandbox' : 'production'
});
