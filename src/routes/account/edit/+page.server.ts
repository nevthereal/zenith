import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zUpdateUser } from '$lib/zod';
import { users } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { Ratelimit } from '@unkey/ratelimit';
import { UNKEY_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const updateForm = await superValidate(zod(zUpdateUser), {
		defaults: {
			username: user.name
		}
	});

	return { user, updateForm };
};

export const actions = {
	username: async ({ request, locals }) => {
		const user = checkUser(locals);
		const form = await superValidate(request, zod(zUpdateUser));

		const limiter = new Ratelimit({
			limit: 1,
			duration: '1d',
			rootKey: UNKEY_KEY,
			namespace: 'update-username'
		});

		const { success } = await limiter.limit(user.id);

		if (!success) return setError(form, 'Too many requests. Try again later', { status: 429 });

		if (!form.valid) return fail(400, { form });

		const formData = form.data;

		await db.update(users).set({ name: formData.username }).where(eq(users.id, user.id));

		return redirect(302, '/account');
	}
} satisfies Actions;
