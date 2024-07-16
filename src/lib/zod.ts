import { z } from 'zod';
import { tagEnum } from '$lib/db/schema';

const zTagEnum = z.enum(tagEnum.enumValues);

const dateInstructions = `The due date and time of the event. 
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
			precision: 0,
			local: true
		})
		.describe(dateInstructions),
	content: z.string().describe('The activity or event.'),
	tag: zTagEnum.describe('A suitable tag for the event')
});

export const createSchema = z.object({
	event: z.string().min(1)
});

export const editSchema = z.object({
	event: z.string().min(1),
	date: z.date(),
	id: z.number(),
	tag: zTagEnum
});

export const deleteSchema = z.object({
	id: z.number()
});

export const updateUserSchema = z.object({
	username: z
		.string()
		.min(3, 'Username too short')
		.max(16, 'Username too long')
		.regex(new RegExp('^[a-zA-Z0-9_]*$'), {
			message: 'Username can only contain letters, numbers. Replace spaces with underscores'
		})
		.optional(),
	email: z.string().email('Is this really an email?').optional()
});
