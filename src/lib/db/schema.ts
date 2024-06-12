import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const tasksTable = sqliteTable('tasks', {
	id: int('id').primaryKey(),
	due: int('due', { mode: 'timestamp' }).notNull(),
	content: text('content').notNull()
});
