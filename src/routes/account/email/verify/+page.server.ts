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
import { UPSTASH_TOKEN, UPSTASH_URL } from '$env/static/private';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	if (user.emailVerified) redirect(302, '/account');

	const form = await superValidate(zod(zVerifyEmail));

	return { form, user };
};

export const actions = {
	default: async ({ locals, request, getClientAddress }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zVerifyEmail));

		if (!dev) {
			const redis = new Redis({
				url: UPSTASH_URL,
				token: UPSTASH_TOKEN
			});

			const ratelimit = new Ratelimit({
				redis,
				limiter: Ratelimit.cachedFixedWindow(3, '1h')
			});
			const ip = getClientAddress();
			const rateLimitAttempt = await ratelimit.limit(`verify_${ip}`);

			if (!rateLimitAttempt.success && !user.admin) {
				return setError(form, 'Too many requests. Try again later', { status: 429 });
			}
		}

		if (!form.valid) return fail(400, { form });

		const dbEntry = await db.query.verificationCodesTable.findFirst({
			where: eq(verificationCodesTable.user_id, user.id)
		});

		if (!dbEntry) return setError(form, "This code doesn't exist");

		if (!isWithinExpirationDate(dbEntry.expires)) return setError(form, 'The code expired');

		if (dbEntry.user_id != user.id) return setError(form, 'This code does not belong to you');

		if (dbEntry.code != form.data.code) return setError(form, 'Wrong code');

		await db.delete(verificationCodesTable).where(eq(verificationCodesTable.id, dbEntry.id));
		await db
			.update(usersTable)
			.set({
				emailVerified: true
			})
			.where(eq(usersTable.id, user.id));

		return redirect(302, '/account');
	}
} satisfies Actions;
