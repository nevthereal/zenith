import { db } from '$lib/db/db';
import { checkUser } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { projectCollaboratorsTable, projectsTable } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = checkUser(locals);

	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		error(404, 'Project not found');
	}

	const qProject = await db.query.projectsTable.findFirst({
		where: eq(projectsTable.id, projectId)
	});

	if (!qProject || qProject.userId != user.id) {
		error(404, 'Project not found');
	}

	const collaborators = await db.query.projectCollaboratorsTable.findMany({
		where: eq(projectCollaboratorsTable.userId, qProject.userId),
		with: {
			user: true
		}
	});

	return { qProject, collaborators };
};