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
import { checkUser } from '$lib/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const user = checkUser(locals);

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

		const user = checkUser(locals);
		if (!user.paid) redirect(302, '/account');

		if (!form.valid) {
			return fail(400, { form });
		}

		const { object } = await generateObject({
			model: model,
			schema: eventSchema,
			mode: 'tool',
			system: `Right now is the ${dayjs().toDate()}. You are an assistant who processes the users input.`,
			prompt: form.data.event
		});

		await db.insert(eventsTable).values({
			content: object.content,
			date: new Date(object.date),
			userId: user.id,
			tag: object.tag
		});

		return message(form, object);
	},
	edit: async ({ request, locals }) => {
		const user = checkUser(locals);

		if (!user.paid) redirect(302, '/account');

		const form = await superValidate(request, zod(editSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		await db
			.update(eventsTable)
			.set({
				content: form.data.event,
				date: form.data.date,
				tag: form.data.tag
			})
			.where(eq(eventsTable.id, form.data.id));
	}
};
