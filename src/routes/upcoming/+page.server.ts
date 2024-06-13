import { db } from '$lib/db/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const events = await db.query.eventsTable.findMany({});

	return { events };
};
