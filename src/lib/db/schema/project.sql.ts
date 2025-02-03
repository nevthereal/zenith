import { text, date, pgTable, serial, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.sql';
import { projectCollaboratorsTable } from './projectCollaborator.sql';
import { eventsTable } from './event.sql';

export const statusEnum = pgEnum('status', ['active', 'archived']);

export const projectsTable = pgTable('projects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	status: statusEnum('status').default('active').notNull(),
	deadline: date('deadline')
});

export const projectRelation = relations(projectsTable, ({ one, many }) => ({
	uses: one(users, { fields: [projectsTable.userId], references: [users.id] }),
	collaborators: many(projectCollaboratorsTable),
	events: many(eventsTable)
}));
