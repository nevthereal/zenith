import { db } from '$lib/db/db';
import { gt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { eventsTable } from '$lib/db/schema';
import dayjs from 'dayjs';

export const load: PageServerLoad = async () => {
	const events = await db.query.eventsTable.findMany({
		where: gt(eventsTable.due, dayjs().endOf('day').toDate())
	});

	return { events };
};
