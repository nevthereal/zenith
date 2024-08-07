import { db } from '$lib/db/db';
import { and, asc, eq, gt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { eventsTable, projectsTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import { checkUser, initializeEventForms } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const events = db.query.eventsTable.findMany({
		where: and(
			gt(eventsTable.date, dayjs().endOf('day').toDate()),
			eq(eventsTable.userId, user.id),
			eq(eventsTable.completed, false)
		),
		orderBy: asc(eventsTable.date),
		with: {
			project: true
		}
	});

	const { editForm, toggleForm } = await initializeEventForms();

	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.userId, user.id),
		columns: {
			id: true,
			name: true
		}
	});

	return { events, editForm, toggleForm, projects };
};
