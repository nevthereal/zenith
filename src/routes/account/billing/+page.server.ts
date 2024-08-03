import { db } from '$lib/db/db';
import { checkUser } from '$lib/utils';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { ordersTable } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

	const order = await db.query.ordersTable.findFirst({
		where: eq(ordersTable.userId, user.id)
	});

	return { user, order };
};
