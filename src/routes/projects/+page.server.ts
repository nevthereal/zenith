import { db } from '$lib/db/db';
import { and, asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { projectsTable } from '$lib/db/schema';
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const myProjects = await db.query.projectsTable.findMany({
		where: and(eq(projectsTable.userId, user.id)),
		orderBy: asc(projectsTable.deadline),
		with: {
			collaborators: {
				columns: {
					projectId: false,
					userId: false
				},
				with: {
					user: {
						columns: {
							username: true
						}
					}
				}
			}
		}
	});
	return { myProjects };
};
