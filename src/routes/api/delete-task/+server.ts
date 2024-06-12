import { db } from '$lib/db/db';
import { tasksTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ url }) => {
	const taskId = Number(url.searchParams.get('id'));

	await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
	return new Response();
};
