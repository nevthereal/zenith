import { z } from 'zod';
import { tagEnum } from '$lib/db/schema';

const zTagEnum = z.enum(tagEnum.enumValues);

const dateDesc = `The due date and time of the event. 
	Should always be in the future. The time should also make sense in regard to the content
	and should be logical in regard to things like opening hours and just normal human behavior.
	If I don't specify any time or date, just set it to the next full hour. 
	Otherwise the times should always be in 15-minutes specific.`;

// for LLM
export const eventSchema = z.object({
	date: z
		.string()
		.datetime({
			offset: true,
			precision: 0
		})
		.describe(dateDesc),
	content: z.string().describe('The activity or event.'),
	tag: zTagEnum.describe('A suitable tag for the event')
});

// for creating form
export const createSchema = z.object({
	event: z.string().min(1)
});

export const editSchema = z.object({
	event: z.string().min(1),
	date: z.string().datetime(),
	id: z.number(),
	tag: zTagEnum
});

export type EditSchema = typeof editSchema; // for editing form
