import { z } from 'zod';

// place files you want to import through the `$lib` alias in this folder.
export const taskSchema = z.object({
	due: z.string(),
	content: z.string()
});

type zTask = z.infer<typeof taskSchema>;

export interface Task extends zTask {
	userId: string;
}
