import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { superValidate, fail, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zUpdateUser } from '$lib/zod';
import { db } from '$lib/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/auth';
import { deleteSessionTokenCookie } from '$lib/auth/cookies';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const updateForm = await superValidate(zod(zUpdateUser));

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
	},
	delete: async (event) => {
		const user = checkUser(event.locals);

		if (event.locals.session === null) {
			return fail(405);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		await db.delete(usersTable).where(eq(usersTable.id, user.id));

		redirect(302, '/signin');
	}
} satisfies Actions;
