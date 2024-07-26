import { db } from '$lib/db/db';
import { checkUser, initializeEventForms } from '$lib/utils';
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

	const project = await db.query.projectsTable.findFirst({
		where: eq(projectsTable.id, projectId),
		with: {
			events: {
				with: {
					project: true
				}
			}
		}
	});

	if (!project || project.userId != user.id) {
		error(404, 'Project not found');
	}

	const collaborators = await db.query.projectCollaboratorsTable.findMany({
		where: eq(projectCollaboratorsTable.userId, project.userId),
		with: {
			user: true
		}
	});

	const userProjects = await db.query.projectsTable.findMany({
		where: eq(projectsTable.userId, user.id),
		columns: {
			id: true,
			name: true
		}
	});

	const { editForm, toggleForm } = await initializeEventForms();

	return { project, collaborators, editForm, toggleForm, userProjects };
};
