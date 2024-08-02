import { checkUser } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db/db';
import { usersTable, verificationCodesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zAddEmail } from '$lib/zod';
import { zod } from 'sveltekit-superforms/adapters';
import dayjs from 'dayjs';
import { Resend } from 'resend';
import { RESEND_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const form = await superValidate(zod(zAddEmail));

	if (user.emailVerified) redirect(302, '/account');

	return { form };
};

const resend = new Resend(RESEND_KEY);

export const actions = {
	default: async ({ locals, request, url }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zAddEmail));

		if (!form.valid) return fail(400, { form });

		const existingEmail = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, form.data.email)
		});

		if (existingEmail) return setError(form, 'Email already exists');

		await db.delete(verificationCodesTable).where(eq(verificationCodesTable.user_id, user.id));

		const code = generateRandomString(6, alphabet('0-9'));

		await db.insert(verificationCodesTable).values({
			user_id: user.id,
			email: form.data.email,
			code: code,
			expires: dayjs().add(15, 'minutes').toDate()
		});

		await db
			.update(usersTable)
			.set({
				email: form.data.email
			})
			.where(eq(usersTable.id, user.id));

		try {
			await resend.emails.send({
				from: 'no-reply@zenithproductivity.app',
				to: form.data.email,
				subject: 'Verification Code for Zenith',
				text: `Hey, ${form.data.email}, your verification code for Zenith is ${code}.
				You can verify it on ${url.origin}/account/email/verify`
			});
		} catch (error) {
			console.error('Resend Error', error);
		}
		redirect(302, '/account/email/verify');
	}
} satisfies Actions;
