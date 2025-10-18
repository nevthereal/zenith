import { form, query } from '$app/server';
import { db } from '$lib/db';
import { projectsTable } from '$lib/db/schema';
import { zCreateProject } from '$lib/zod';
import { redirect } from '@sveltejs/kit';
import { checkUser } from './auth.remote';

export const getProjects = query(async () => {
	const user = await checkUser();

	const projects = db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		orderBy: { deadline: 'asc' },
		with: {
			collaborators: true
		}
	});

	return projects;
});

export const createProject = form(zCreateProject, async (data) => {
	const user = await checkUser();

	const [insertedProject] = await db
		.insert(projectsTable)
		.values({
			name: data.name,
			userId: user.id,
			deadline: data.deadline
		})
		.returning({
			projectId: projectsTable.id
		});

	return redirect(302, `/projects/${insertedProject.projectId}`);
});
