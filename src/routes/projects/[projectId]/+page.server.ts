import { db } from '$lib/db/db';
import { checkUser } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { projectsTable } from '$lib/db/schema';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = checkUser(locals);
	const qProject = await db.query.projectsTable.findFirst({
		where: eq(projectsTable.id, Number(params.projectId)),
		with: {
			collaborators: {
				with: {
					user: {
						columns: {
							username: true,
							id: true
						}
					}
				}
			}
		}
	});

	if (!qProject || qProject.userId != user.id) {
		return redirect(302, '/projects');
	}
	return { qProject };
};
