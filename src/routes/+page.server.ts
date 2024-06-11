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
			system: `Output the due property in the JavaScript Date format. right now is ${dayjs()}`,
			prompt: form.data.task
		});

		console.log(object);
	}
};
