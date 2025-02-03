import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { superValidate, fail, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zUpdateUser } from '$lib/zod';
import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
// import { redirect } from '@sveltejs/kit';
// import { auth } from '$lib/auth';

// TODO Replace shit with better auth

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

		await db
			.update(usersTable)
			.set({ username: formData.username })
			.where(eq(usersTable.id, user.id));

		return setMessage(form, 'Updated username');
	}
} satisfies Actions;
