import { db } from '$lib/db/db';
import { and, asc, eq, gt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { eventsTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { deleteSchema, editSchema } from '$lib/zod';
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const user = checkUser(locals);

	depends('fetch:events');
	const events = await db.query.eventsTable.findMany({
		where: and(
			gt(eventsTable.date, dayjs().endOf('day').toDate()),
			eq(eventsTable.userId, user.id)
		),
		orderBy: asc(eventsTable.date)
	});

	const editForm = await superValidate(zod(editSchema));
	const deleteForm = await superValidate(zod(deleteSchema));

	return { events, editForm, deleteForm };
};
