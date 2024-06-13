import { eventSchema, createSchema, editSchema } from '$lib/schemas';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { db } from '$lib/db/db';
import { eventsTable } from '$lib/db/schema';
import { asc, eq, lt } from 'drizzle-orm';
import { z } from 'zod';

export const load: PageServerLoad = async () => {
	const createForm = await superValidate(zod(createSchema));
	const editForm = await superValidate(zod(editSchema));

	const events = await db.query.eventsTable.findMany({
		orderBy: asc(eventsTable.due),
		where: lt(eventsTable.due, dayjs().endOf('day').toDate())
	});

	return { createForm, events, editForm };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, zod(createSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { object } = await generateObject({
			model: model,
			schema: eventSchema,
			mode: 'tool',
			system: `Right now is the ${dayjs()}. 
				You are an assistant who processes the users input. 
				
				The "due"-property should be in the JavaScript Date format ISO String.
				If no time is provided, set the "due"-property it to the same day at 10am if it is not today.
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
			due: new Date(object.due)
		});

		return message(form, object);
	},
	edit: async ({ request }) => {
		const form = await superValidate(request, zod(editSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { object } = await generateObject({
			model: model,
			schema: z.object({
				date: z.string()
			}),
			mode: 'tool',
			system: `For context: right now is ${dayjs()}
				You are an assistant who transforms my input into a Date ISO String.`,
			prompt: form.data.date
		});

		await db
			.update(eventsTable)
			.set({
				content: form.data.event,
				due: new Date(object.date)
			})
			.where(eq(eventsTable.id, form.data.id));
	}
};
