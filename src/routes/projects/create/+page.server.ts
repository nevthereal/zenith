import { db } from '$lib/db';
import type { Actions, PageServerLoad } from './$types';
import { projectsTable } from '$lib/db/schema';
import { checkUser } from '$lib/utils';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod, zod4 } from 'sveltekit-superforms/adapters';
import { zCreateProject } from '$lib/zod';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	checkUser(locals);

	const createProjectForm = await superValidate(zod4(zCreateProject));

	return { createProjectForm };
};

export const actions = {
	default: async ({ locals, request }) => {
		const user = checkUser(locals);

		const form = await superValidate(request, zod4(zCreateProject));

		if (!form.valid) {
			return fail(400, { form });
		}
		const [insertedProject] = await db
			.insert(projectsTable)
			.values({
				name: form.data.name,
				userId: user.id,
				deadline: form.data.deadline?.toDateString()
			})
			.returning({
				projectId: projectsTable.id
			});

		return redirect(302, `/projects/${insertedProject.projectId}`);
	}
} satisfies Actions;
