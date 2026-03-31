import { form } from '$app/server';
import { invalid, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Ratelimit } from '@unkey/ratelimit';
import { UNKEY_KEY } from '$env/static/private';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { getUserContext } from '$lib/server/request-context';
import { zUpdateUser } from '$lib/zod';

const usernameLimiter = new Ratelimit({
	limit: 1,
	duration: '1d',
	rootKey: UNKEY_KEY,
	namespace: 'update-username'
});

export const updateUsername = form(zUpdateUser, async ({ username }) => {
	const { user } = getUserContext();

	const { success } = await usernameLimiter.limit(user.id);

	if (!success) {
		invalid('Name change limit reached');
	}

	await db.update(users).set({ name: username }).where(eq(users.id, user.id));

	redirect(303, '/account');
});
