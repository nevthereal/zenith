import { db } from '$lib/db/db';
import { and, asc, eq, gt } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { eventsTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { editSchema } from '$lib/zod';
import { fail } from '@sveltejs/kit';
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const events = await db.query.eventsTable.findMany({
		where: and(
			gt(eventsTable.date, dayjs().endOf('day').toDate()),
			eq(eventsTable.userId, user.id)
		),
		orderBy: asc(eventsTable.date)
	});

	const editForm = await superValidate(zod(editSchema));

	return { events, editForm };
};

export const actions: Actions = {
	edit: async ({ request }) => {
		const form = await superValidate(request, zod(editSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		await db
			.update(eventsTable)
			.set({
				content: form.data.event,
				date: form.data.date,
				tag: form.data.tag
			})
			.where(eq(eventsTable.id, form.data.id));
	}
};
