import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const myProjects = db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		orderBy: { deadline: 'asc' },
		with: {
			collaborators: true
		}
	});
	return { myProjects };
};
