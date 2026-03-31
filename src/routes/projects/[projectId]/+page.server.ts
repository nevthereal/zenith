import { db } from '$lib/db';
import { checkUser } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = checkUser(locals);

	const projectId = Number(params.projectId);

	const usersProjects = await db.query.projectsTable.findMany({
		where: { userId: user.id },
		columns: {
			id: true,
			name: true
		}
	});

	if (!Number.isInteger(projectId) || projectId <= 0) {
		error(404, 'Project not found');
	}

	if (!usersProjects.some((project) => project.id === projectId)) {
		error(404, 'Project not found');
	}

	return {
		projectId,
		userProjects: usersProjects
	};
};
