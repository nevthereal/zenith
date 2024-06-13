import { z } from 'zod';

export const eventSchema = z.object({
	due: z.string(),
	content: z.string()
});

type zEvent = z.infer<typeof eventSchema>;

export interface Event extends zEvent {}
