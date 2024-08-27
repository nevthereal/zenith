import { db } from '$lib/db/db';
import { checkUser } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { usersTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	return { user };
};

export const actions = {
	trial: async ({ locals }) => {
		const user = checkUser(locals);

		await db
			.update(usersTable)
			.set({
				trialEnd: dayjs().add(3, 'day').toDate()
			})
			.where(eq(usersTable.id, user.id));

		redirect(302, '/');
	}
} satisfies Actions;
