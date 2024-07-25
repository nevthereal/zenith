import { z } from 'zod';

// for LLM
export const zEventLLM = z.object({
	date: z
		.string()
		.datetime({
			offset: true,
			precision: 0,
			local: false
		})
		.describe(
			'The due date and time of the event, should always be in the future and make sense in regard of the content and human behavior. The time should not be too specific In ISO 8601 Format.'
		),
	content: z.string().describe('The activity or event.')
});

export const zCreateEvent = z.object({
	event: z.string().min(1)
});

export const zEditEvent = z.object({
	event: z.string().min(1),
	date: z.date(),
	id: z.number(),
	projectId: z.number()
});

export const zActionEnum = z.enum(['complete', 'delete']);

export const zToggleEvent = z.object({
	id: z.number(),
	action: zActionEnum
});

export const zCreateProject = z.object({
	name: z.string().min(4).max(32),
	deadline: z.date().optional()
});

export const zUpdateUser = z.object({
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
