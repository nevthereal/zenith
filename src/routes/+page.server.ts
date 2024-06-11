import { taskSchema } from '$lib';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';

const formSchema = z.object({
	task: z.string()
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(formSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { object } = await generateObject({
			model: model,
			schema: taskSchema,
			mode: 'tool',
			system: `Right now is the ${dayjs()}. You are an assistant who processes the users input. The "due"-property should be in the JavaScript Date format (not as a string) and the "content"-property should be capital cased. If no date is provided, set the "due"-property it to the same day at 10am. Morning means 8am, noon means 12pm, afternoon or evening means 6pm and night means 8pm. Remove anything that has to do with time from the "content"-property, unless it's essential.`,
			prompt: form.data.task
		});

		console.log(object);
	}
};
