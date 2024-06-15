import dayjs from 'dayjs';
import { z } from 'zod';

// for LLM
export const eventSchema = z.object({
	date: z.string(),
	content: z.string()
});

// for creating form
export const createSchema = z.object({
	event: z.string().min(1)
});

// for editing form
export const editSchema = z.object({
	event: z.string().min(1),
	date: z.date(),
	id: z.number()
});

type zEvent = z.infer<typeof eventSchema>;
export type EditSchema = typeof editSchema; // for editing form

export interface Event extends zEvent {}
