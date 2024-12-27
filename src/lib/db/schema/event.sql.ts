import { boolean, integer, text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './user.sql';
import { projectsTable } from './project.sql';

export const eventsTable = pgTable('events', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	content: text('content').notNull(),
	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	completed: boolean('completed').default(false).notNull(),
	projectId: integer('project_id').references(() => projectsTable.id, { onDelete: 'set null' })
});

export const eventRelation = relations(eventsTable, ({ one }) => ({
	user: one(usersTable, { fields: [eventsTable.userId], references: [usersTable.id] }),
	project: one(projectsTable, { fields: [eventsTable.projectId], references: [projectsTable.id] })
}));
