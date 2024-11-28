import { checkUser, random } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { usersTable, verificationCodesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateRandomIntegerNumber } from '@oslojs/crypto/random';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zAddEmail } from '$lib/zod';
import { zod } from 'sveltekit-superforms/adapters';
import dayjs from 'dayjs';
import { Resend } from 'resend';
import { RESEND_KEY } from '$env/static/private';
import { render } from 'svelte/server';
import Verify from '$lib/components/mails/Verify.svelte';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const form = await superValidate(zod(zAddEmail), {
		defaults: {
			email: user.email
		}
	});

	if (user.emailVerified) redirect(302, '/account');

	return { form };
};

const resend = new Resend(RESEND_KEY);

export const actions = {
	default: async ({ locals, request }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zAddEmail));

		if (!form.valid) return fail(400, { form });

		const existingEmail = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, form.data.email)
		});

		if (existingEmail && user.email != existingEmail.email)
			return setError(form, 'Email already exists');

		await db.delete(verificationCodesTable).where(eq(verificationCodesTable.user_id, user.id));

		const code = generateRandomIntegerNumber(random, 6);

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

		const html = render(Verify, { props: { code, username: user.username } });

		try {
			await resend.emails.send({
				from: 'Zenith <no-reply@zenithproductivity.app>',
				to: form.data.email,
				subject: 'Verification Code for Zenith',
				html: html.body,
				text: `Your verification code for Zenith is: ${code}`
			});
		} catch (error) {
			console.error('Resend Error', error);
		}
		redirect(302, '/account/email/verify');
	}
} satisfies Actions;
