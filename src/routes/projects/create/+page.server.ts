import { db } from '$lib/db/db';
import { and, asc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { projectsTable } from '$lib/db/schema';
import { checkUser } from '$lib/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zCreateProject } from '$lib/zod';

export const load: PageServerLoad = async ({ locals }) => {
	checkUser(locals);

	const createProjectForm = await superValidate(zod(zCreateProject));

	return { createProjectForm };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const user = checkUser(locals);

		console.log('yay');
	}
};
