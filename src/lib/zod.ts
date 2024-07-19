import { z } from 'zod';
import { tagEnum } from '$lib/db/schema';

const zTagEnum = z.enum(tagEnum.enumValues);

// for LLM
export const eventSchema = z.object({
	date: z
		.string()
		.datetime({
			offset: true,
			precision: 0,
			local: true
		})
		.describe(
			'The due date and time of the event, should always be in the future and make sense in regard of the content and human behavior. Time should not be too specific'
		),
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
