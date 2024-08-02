import { checkUser } from '$lib/utils';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { zVerifyEmail } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/db';
import { eq } from 'drizzle-orm';
import { usersTable, verificationCodesTable } from '$lib/db/schema';
import { isWithinExpirationDate } from 'oslo';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	if (user.emailVerified) redirect(302, '/account');

	const form = await superValidate(zod(zVerifyEmail));

	return { form, user };
};

export const actions = {
	default: async ({ locals, request }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zVerifyEmail));

		if (!form.valid) return fail(400, { form });

		const dbEntry = await db.query.verificationCodesTable.findFirst({
			where: eq(verificationCodesTable.user_id, user.id)
		});

		if (!dbEntry) {
			return setError(form, "This code doesn't exist");
		} else {
			await db.delete(verificationCodesTable).where(eq(verificationCodesTable.id, dbEntry.id));
		}

		if (!isWithinExpirationDate(dbEntry.expires)) {
			return setError(form, 'The code expired');
		}

		if (dbEntry.user_id != user.id) {
			return setError(form, 'This code does not belong to you');
		}

		await db
			.update(usersTable)
			.set({
				emailVerified: true
			})
			.where(eq(usersTable.id, user.id));

		return redirect(302, '/account');
	}
} satisfies Actions;
