import { taskSchema } from '$lib';
import { model } from '$lib/ai';
import { generateObject } from 'ai';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { object } = await generateObject({
		model: model,
		schema: taskSchema,
		prompt: 'Today is the 11 of June 2024. Dinner tomorrow at 9PM'
	});

	return { object };
};
