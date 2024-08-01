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
	update_user: async ({ request, locals }) => {
		const user = checkUser(locals);
		const form = await superValidate(request, zod(zUpdateUser));

		if (!form.valid) return fail(400, { form });

		const formData = form.data;

		const updateEmail = async () => {
			await db.update(usersTable).set({ email: formData.email }).where(eq(usersTable.id, user.id));
		};
		const updateUsername = async () => {
			await db
				.update(usersTable)
				.set({ username: formData.username })
				.where(eq(usersTable.id, user.id));
		};

		if (formData.email && formData.username) {
			updateEmail();
			updateUsername();
			return setMessage(form, 'Updated user');
		} else if (formData.username) {
			updateUsername();
			return setMessage(form, 'Updated username');
		} else if (formData.email) {
			updateEmail();
			return setMessage(form, 'Updated email');
		}
		return { form };
	},
	delete_user: async ({ locals, cookies }) => {
		const user = checkUser(locals);

		if (!locals.session) {
			return new Response('Failed', { status: 405 });
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
