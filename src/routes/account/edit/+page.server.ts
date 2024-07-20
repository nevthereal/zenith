import type { Actions, PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';
import { superValidate, fail, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateUserSchema } from '$lib/zod';
import { db } from '$lib/db/db';
import { eventsTable, ordersTable, sessionsTable, usersTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { lucia } from '$lib/auth/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const updateForm = await superValidate(zod(updateUserSchema));

	return { user, updateForm };
};

export const actions: Actions = {
	update_user: async ({ request, locals }) => {
		const user = checkUser(locals);
		const form = await superValidate(request, zod(updateUserSchema));

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

		await db.delete(sessionsTable).where(eq(sessionsTable.userId, user.id));
		await db.delete(eventsTable).where(eq(eventsTable.userId, user.id));
		await db.delete(ordersTable).where(eq(ordersTable.userId, user.id));
		await db.delete(usersTable).where(eq(usersTable.id, user.id));
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/signin');
	}
};
