import { eventSchema, createSchema, editSchema } from '$lib/zod';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { db } from '$lib/db/db';
import { eventsTable } from '$lib/db/schema';
import { and, asc, eq, lt } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) redirect(302, '/login');

	const createForm = await superValidate(zod(createSchema));
	const editForm = await superValidate(zod(editSchema));

	const events = db.query.eventsTable.findMany({
		orderBy: asc(eventsTable.date),
		where: and(lt(eventsTable.date, dayjs().endOf('day').toDate()), eq(eventsTable.userId, user.id))
	});

	return { createForm, events, editForm, user };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await superValidate(request, zod(createSchema));

		const user = locals.user;
		if (!user) redirect(302, '/login');

		if (!form.valid) {
			return fail(400, { form });
		}

		const { object } = await generateObject({
			model: model,
			schema: eventSchema,
			mode: 'tool',
			system: `Right now is the ${dayjs()}. 
				You are an assistant who processes the users input. 
				
				The "date"-property should be in the JavaScript Date format ISO String.
				If no time is provided, set the "date"-property it to the same day at 10am if it is not today.
				If it is today, set it to the next full hour.
				Otherwise, just set it to a logical time, like dinner would be in the evening.
				Morning means 8am, noon means 12pm, afternoon or evening means 6pm and night or tonight means 8pm. 
				If a word like yesterday or tomorrow comes up, really think about if it actually happens then or if I, 
				for example want to tell somebody about yesterday. Or I may want to buy the groceries for tomorrows breakfast
				this evening (suppose it is not too late) and not tomorrow morning. And take the opening hours for shops in consideration.
				
				The "content"-property describes the event or the event that should be completed.`,
			prompt: form.data.event
		});

		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id
		});

		return message(form, object);
	},
	edit: async ({ request }) => {
		const form = await superValidate(request, zod(editSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		await db
			.update(eventsTable)
			.set({
				content: form.data.event,
				date: form.data.date
			})
			.where(eq(eventsTable.id, form.data.id));
	}
};
