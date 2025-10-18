import { z } from 'zod/v4';

// for LLM
export const zEventLLM = z.object({
	date: z.iso
		.datetime({ offset: true, local: true })
		.describe(
			'The due date and time of the event or task. It should always be in the future and make sense in regard of the content and human behavior. The time should not be too specific. Provide in ISO format.'
		),
	content: z
		.string()
		.describe(
			'The activity or event. Strip any temporal information from the name, because it is already mentioned in the date field'
		)
});

export const zCreateEvent = z.object({
	event: z.string().min(3, 'Provide something meaningful')
});

export const zEditEvent = z.object({
	event: z.string().min(3, 'Provide something meaningful'),
	date: z.iso.datetime(),
	id: z.number(),
	projectId: z.number()
});

export const zActionEnum = z.enum(['complete', 'uncomplete', 'delete']);

export const zToggleEvent = z.object({
	id: z.number(),
	action: zActionEnum
});

export const zUpdateUser = z.object({
	username: z
		.string()
		.min(3, 'Username too short')
		.max(16, 'Username too long')
		.regex(new RegExp('^[a-zA-Z0-9_-]*$'), {
			message: 'Username can only contain letters and numbers. Replace spaces with underscores'
		})
});

export const zCreateProject = z.object({
	name: z.string().min(4).max(32),
	deadline: z.iso.date().optional()
});

export const zEditProject = z.object({
	projectId: z.number(),
	deadline: z.date().optional(),
	name: z.string().min(4).max(32).optional()
});

export const zDeleteProject = z.object({
	projectId: z.number()
});

export const zAddEmail = z.object({
	email: z.string().email()
});

export const zVerifyEmail = z.object({
	code: z.string()
});
