import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { superValidate, fail, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zUpdateUser } from '$lib/zod';
import { db } from '$lib/db/db';
import { usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { lucia } from '$lib/auth/lucia';

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
	delete: async ({ locals, cookies }) => {
		const user = checkUser(locals);

		if (!locals.session) {
			return fail(405);
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		await db.delete(usersTable).where(eq(usersTable.id, user.id));

		redirect(302, '/signin');
	}
} satisfies Actions;
