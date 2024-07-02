import { z } from 'zod';
import { tagEnum } from '$lib/db/schema';

const zTagEnum = z.enum(tagEnum.enumValues);

// for LLM
export const eventSchema = z.object({
	date: z.string().describe('A the due date in ISO Format'),
	content: z.string().describe('The activity or event due'),
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
