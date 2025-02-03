import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zUpdateUser } from '$lib/zod';
import { users } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

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

		if (!form.valid) return fail(400, { form });

		const formData = form.data;

		await db.update(users).set({ name: formData.username }).where(eq(users.id, user.id));

		return redirect(302, '/account');
	}
} satisfies Actions;
