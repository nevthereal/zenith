import { db } from '$lib/db/db';
import { and, asc, eq, gt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { eventsTable, projectsTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zToggleEvent, zEditEvent } from '$lib/zod';
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('fetch:events');
	const user = checkUser(locals);

	const editForm = await superValidate(zod(zEditEvent));
	const toggleForm = await superValidate(zod(zToggleEvent));

	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.userId, user.id),
		columns: {
			id: true,
			name: true
		}
	});

	const events = db.query.eventsTable.findMany({
		where: and(
			gt(eventsTable.date, dayjs().endOf('day').toDate()),
			eq(eventsTable.userId, user.id)
		),
		orderBy: asc(eventsTable.date),
		with: {
			project: true
		}
	});

	return { events, editForm, toggleForm, projects };
};
