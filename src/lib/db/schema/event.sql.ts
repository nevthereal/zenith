import { boolean, integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';
import { users } from './auth.sql';
import { projectsTable } from './project.sql';

export const eventsTable = pgTable('events', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	content: text('content').notNull(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	completed: boolean('completed').default(false).notNull(),
	projectId: integer('project_id').references(() => projectsTable.id, { onDelete: 'set null' })
});

export const freeTierGenerations = pgTable('free_generations', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull()
});
