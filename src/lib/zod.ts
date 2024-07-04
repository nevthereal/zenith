import { z } from 'zod';
import { tagEnum } from '$lib/db/schema';

const zTagEnum = z.enum(tagEnum.enumValues);

// for LLM
export const eventSchema = z.object({
	date: z
		.string()
		.datetime({
			offset: true,
			precision: 0
		})
		.describe(
			'The due date and time of the event. Should always be in the future and the time should be in 15-minutes steps, except specified more precisely. The time should also make sense in regard to the content.'
		),
	content: z.string().describe('The activity or event due.'),
	tag: zTagEnum.describe('A suitable tag for the event')
});

// for creating form
export const createSchema = z.object({
	event: z.string().min(1)
});

export const editSchema = z.object({
	event: z.string().min(1),
	date: z.date(),
	id: z.number(),
	tag: zTagEnum
});

export type EditSchema = typeof editSchema; // for editing form
