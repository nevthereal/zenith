import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { checkUser, initializeEventForms } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const events = db.query.eventsTable.findMany({
		where: {
			userId: user.id,
			completed: true
		},
		orderBy: { date: 'asc' },
		with: {
			project: true
		}
	});

	const projects = await db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		columns: {
			id: true,
			name: true
		}
	});

	const { editForm, toggleForm } = await initializeEventForms();

	return { events, editForm, toggleForm, projects };
};
