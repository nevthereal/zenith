import { dev } from '$app/environment';
import { POLAR_ACCESS_TOKEN, POLAR_ORGANIZATION_ID } from '$env/static/private';
import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
	accessToken: POLAR_ACCESS_TOKEN,
	server: dev ? 'sandbox' : 'production'
});

export async function generateCustomerId(email: string) {
	const customer = await polar.customers.create({
		email: email,
		organizationId: POLAR_ORGANIZATION_ID
	});

	return customer.id;
}
