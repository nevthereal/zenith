import { z } from 'zod';

export const taskSchema = z.object({
	due: z.string(),
	content: z.string()
});

type zTask = z.infer<typeof taskSchema>;

export interface Task extends zTask {}
