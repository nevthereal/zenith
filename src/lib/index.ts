import { z } from 'zod';

// place files you want to import through the `$lib` alias in this folder.
export const taskSchema = z.object({
	due: z.date(),
	title: z.string()
});

export type Task = z.infer<typeof taskSchema>;
