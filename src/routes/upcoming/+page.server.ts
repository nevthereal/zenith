import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';
import { checkUser, initializeEventForms } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const events = db.query.eventsTable.findMany({
		where: {
			date: {
				gt: dayjs().endOf('day').toDate()
			},
			userId: user.id,
			completed: false
		},
		orderBy: { date: 'asc' },
		with: {
			project: true
		}
	});

	const { editForm, toggleForm } = await initializeEventForms();

	const projects = await db.query.projectsTable.findMany({
		where: { userId: user.id },
		columns: {
			id: true,
			name: true
		}
	});

	return { events, editForm, toggleForm, projects };
};
