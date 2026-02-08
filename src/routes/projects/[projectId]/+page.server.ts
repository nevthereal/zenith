import { db } from '$lib/db';
import { checkUser, initializeEventForms } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { projectsTable } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zDeleteProject, zEditProject } from '$lib/zod';
import { zod4 } from 'sveltekit-superforms/adapters';
import { dayjs, normalizeDateInput } from '$lib/datetime';
import { resolveUserTimeZone } from '$lib/server/user-preferences';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	const user = checkUser(locals);
	const timeZone = resolveUserTimeZone(user, cookies);

	const projectId = Number(params.projectId);

	if (Number.isNaN(projectId)) {
		error(404, 'Project not found');
	}

	const project = await db.query.projectsTable.findFirst({
		where: { id: projectId },
		with: {
			events: {
				orderBy: {
					date: 'asc'
				},
				with: {
					project: true
				}
			}
		}
	});

	if (!project || project.userId != user.id) {
		error(404, 'Project not found');
	}

	const usersProjects = await db.query.projectsTable.findMany({
		where: { userId: user.id },
		columns: {
			id: true,
			name: true
		}
	});

	const { editForm, toggleForm } = await initializeEventForms();

	const deadlineString =
		project.deadline instanceof Date
			? dayjs(project.deadline).utc().format('YYYY-MM-DD')
			: project.deadline;

	const projectEditForm = await superValidate(zod4(zEditProject), {
		defaults: {
			projectId: project.id,
			deadline: deadlineString ? dayjs.tz(deadlineString, timeZone).toDate() : undefined,
			name: project.name
		}
	});
	const projectDeleteForm = await superValidate(zod4(zDeleteProject), {
		defaults: {
			projectId: project.id
		}
	});

	return {
		project,
		editForm,
		toggleForm,
		userProjects: usersProjects,
		projectEditForm,
		projectDeleteForm
	};
};

export const actions = {
	edit: async ({ locals, request }) => {
		const user = checkUser(locals);
		const formData = await request.clone().formData();
		const rawDeadline = formData.get('deadline');
		const deadline = typeof rawDeadline === 'string' ? normalizeDateInput(rawDeadline) : undefined;

		const form = await superValidate(request, zod4(zEditProject));

		if (!form.valid) return fail(400, { form });

		const qProject = await db.query.projectsTable.findFirst({
			where: { id: form.data.projectId, userId: user.id }
		});

		if (!qProject) return fail(429, { form });

		if (deadline && form.data.name) {
			await db
				.update(projectsTable)
				.set({
					deadline: deadline,
					name: form.data.name
				})
				.where(eq(projectsTable.id, form.data.projectId));
			return setMessage(form, 'Updated deadline and name');
		} else if (deadline) {
			await db
				.update(projectsTable)
				.set({
					deadline: deadline
				})
				.where(eq(projectsTable.id, form.data.projectId));
			return setMessage(form, 'Updated deadline');
		} else if (form.data.name) {
			await db
				.update(projectsTable)
				.set({
					name: form.data.name
				})
				.where(eq(projectsTable.id, form.data.projectId));
			return setMessage(form, 'Updated name');
		}
	},
	delete: async ({ locals, request }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod4(zEditProject));

		if (!form.valid) fail(400, { form });

		const qProject = await db.query.projectsTable.findFirst({
			where: { id: form.data.projectId, userId: user.id }
		});

		if (qProject) {
			await db.delete(projectsTable).where(eq(projectsTable.id, form.data.projectId));
			return redirect(302, '/projects');
		} else {
			return fail(429, { form });
		}
	}
} satisfies Actions;
