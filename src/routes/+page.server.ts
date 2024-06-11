import { taskSchema, type Task } from '$lib/types';
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
			system: `Right now is the ${dayjs()}. 
				You are an assistant who processes the users input. 
				
				The "due"-property should be in the JavaScript Date format (not as a string).
				If no time is provided, set the "due"-property it to the same day at 10am if it is not today.
				If it is today, set it to the next full hour.
				Otherwise, just set it to a logical time, like dinner would be in the evening.
				Morning means 8am, noon means 12pm, afternoon or evening means 6pm and night or tonight means 8pm. 
				Remove anything that has to do with time from the "content"-property, unless it's essential.
				
				The "content"-property describes the event or the task that should be completed.
				It should be Capital Cased.`,
			prompt: form.data.task
		});

		console.log(object);
	}
};
