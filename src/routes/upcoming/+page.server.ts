import { db } from '$lib/db/db';
import { eq, gt } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { eventsTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { editSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { generateObject } from 'ai';
import { model } from '$lib/ai';
import { z } from 'zod';

export const load: PageServerLoad = async () => {
	const events = await db.query.eventsTable.findMany({
		where: gt(eventsTable.date, dayjs().endOf('day').toDate())
	});

	const editForm = await superValidate(zod(editSchema));

	return { events, editForm };
};

export const actions: Actions = {
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
				date: new Date(object.date)
			})
			.where(eq(eventsTable.id, form.data.id));
	}
};
