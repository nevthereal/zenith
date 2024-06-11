import { taskSchema } from '$lib';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const formSchema = z.object({
	task: z.string()
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(formSchema));

	return { form };
};

export const actions: Actions = {
	default: async () => {
		const { object } = await generateObject({
			model: model,
			schema: taskSchema,
			prompt: 'Today is the 11 of June 2024. Dinner tomorrow at 9PM'
		});
	}
};
