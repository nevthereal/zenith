import { boolean, text, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { eventsTable } from './event.sql';
import { projectsTable } from './project.sql';
import { projectCollaboratorsTable } from './projectCollaborator.sql';

export const usersTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull(),
	provider: text('provider').notNull(),
	email: text('email').unique(),
	emailVerified: boolean('emailVerified').default(false).notNull(),
	admin: boolean('admin').default(false).notNull(),
	joined: timestamp('joined').notNull(),
	paid: boolean('paid').default(false).notNull()
});

export const userRelation = relations(usersTable, ({ many }) => ({
	events: many(eventsTable),
	projects: many(projectsTable),
	collaboratingProjects: many(projectCollaboratorsTable)
}));

export type User = InferSelectModel<typeof usersTable>;
