import { text, date, pgTable, serial, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './user.sql';
import { projectCollaboratorsTable } from './projectCollaborator.sql';
import { eventsTable } from './event.sql';

export const statusEnum = pgEnum('status', ['active', 'archived']);

export const projectsTable = pgTable('projects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	status: statusEnum('status').default('active').notNull(),
	deadline: date('deadline')
});

export const projectRelation = relations(projectsTable, ({ one, many }) => ({
	user: one(usersTable, { fields: [projectsTable.userId], references: [usersTable.id] }),
	collaborators: many(projectCollaboratorsTable),
	events: many(eventsTable)
}));
