import { dayjs } from '$lib/datetime';
import { db } from '$lib/db';
import { checkUser } from '$lib/utils';
import { getActiveSubscription } from '$lib/auth';
import { resolveUserTimeZone } from '$lib/server/user-preferences';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request, cookies }) => {
	const user = checkUser(locals);
	const timeZone = resolveUserTimeZone(user, cookies);

	const freeToday = await db.query.freeTierGenerations.findMany({
		where: {
			userId: user.id
		}
	});

	const freeTodayCount = freeToday.filter((e) =>
		dayjs(e.createdAt).tz(timeZone).isSame(dayjs().tz(timeZone), 'day')
	).length;

	const subscription = await getActiveSubscription(request.headers);

	const projects = await db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		columns: {
			id: true,
			name: true
		}
	});

	return {
		projects,
		subscription,
		freeTodayCount
	};
};
