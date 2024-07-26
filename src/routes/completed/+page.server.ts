import { db } from '$lib/db/db';
import { and, asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { eventsTable, projectsTable } from '$lib/db/schema';
import { checkUser, initializeEventForms } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const { editForm, toggleForm } = await initializeEventForms();

	const projects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.userId, user.id),
		columns: {
			id: true,
			name: true
		}
	});

	const events = db.query.eventsTable.findMany({
		where: and(eq(eventsTable.userId, user.id), eq(eventsTable.completed, true)),
		orderBy: asc(eventsTable.date),
		with: {
			project: true
		}
	});

	return { events, editForm, toggleForm, projects };
};
