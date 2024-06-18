import { z } from 'zod';
import { tagEnum } from '$lib/db/schema';

const tagVals = tagEnum.enumValues;

// for LLM
export const eventSchema = z.object({
	date: z.string(),
	content: z.string(),
	tag: z.enum(tagVals)
});

// for creating form
export const createSchema = z.object({
	event: z.string().min(1)
});

export const editSchema = z.object({
	event: z.string().min(1),
	date: z.date(),
	id: z.number()
});

export type EditSchema = typeof editSchema; // for editing form
