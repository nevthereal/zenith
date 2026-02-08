import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { dayjs } from '$lib/datetime';
import { checkUser, initializeEventForms } from '$lib/utils';
import { resolveUserTimeZone } from '$lib/server/user-preferences';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const user = checkUser(locals);
	const timeZone = resolveUserTimeZone(user, cookies);

	const events = db.query.eventsTable.findMany({
		where: {
			date: {
				gt: dayjs().tz(timeZone).endOf('day').toDate()
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
