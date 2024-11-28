import { db } from '$lib/db';
import { checkUser, initializeEventForms } from '$lib/utils';
import { and, asc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { eventsTable, projectCollaboratorsTable, projectsTable } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zDeleteProject, zEditProject } from '$lib/zod';
import { zod } from 'sveltekit-superforms/adapters';
import dayjs from 'dayjs';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = checkUser(locals);

	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		error(404, 'Project not found');
	}

	const project = await db.query.projectsTable.findFirst({
		where: eq(projectsTable.id, projectId)
	});

	const events = await db.query.eventsTable.findMany({
		where: and(eq(eventsTable.projectId, projectId), eq(eventsTable.completed, false)),
		with: {
			project: true
		},
		orderBy: asc(eventsTable.date)
	});

	const completedEvents = await db.query.eventsTable.findMany({
		where: and(eq(eventsTable.projectId, projectId), eq(eventsTable.completed, true)),
		with: {
			project: true
		},
		orderBy: asc(eventsTable.date)
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

	const projectEditForm = await superValidate(zod(zEditProject), {
		defaults: {
			projectId: project.id,
			deadline: dayjs(project.deadline).isValid() ? dayjs(project.deadline).toDate() : undefined,
			name: project.name
		}
	});
	const projectDeleteForm = await superValidate(zod(zDeleteProject), {
		defaults: {
			projectId: project.id
		}
	});

	return {
		project,
		collaborators,
		editForm,
		toggleForm,
		userProjects,
		events,
		completedEvents,
		projectEditForm,
		projectDeleteForm
	};
};

export const actions = {
	edit: async ({ locals, request }) => {
		const user = checkUser(locals);
		const form = await superValidate(request, zod(zEditProject));

		if (!form.valid) return fail(400, { form });

		const qProject = await db.query.projectsTable.findFirst({
			where: and(eq(projectsTable.id, form.data.projectId), eq(projectsTable.userId, user.id))
		});

		if (!qProject) return fail(429, { form });

		if (form.data.deadline && form.data.name) {
			await db.update(projectsTable).set({
				deadline: form.data.deadline.toDateString(),
				name: form.data.name
			});
			return setMessage(form, 'Updated deadline and name');
		} else if (form.data.deadline) {
			await db.update(projectsTable).set({
				deadline: form.data.deadline.toDateString()
			});
			return setMessage(form, 'Updated deadline');
		} else if (form.data.name) {
			await db.update(projectsTable).set({
				name: form.data.name
			});
			return setMessage(form, 'Updated name');
		}
	},
	delete: async ({ locals, request }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod(zEditProject));

		if (!form.valid) fail(400, { form });

		const qProject = await db.query.projectsTable.findFirst({
			where: and(eq(projectsTable.id, form.data.projectId), eq(projectsTable.userId, user.id))
		});

		if (qProject) {
			await db.delete(projectsTable).where(eq(projectsTable.id, form.data.projectId));
			return redirect(302, '/projects');
		} else {
			return fail(429, { form });
		}
	}
} satisfies Actions;
