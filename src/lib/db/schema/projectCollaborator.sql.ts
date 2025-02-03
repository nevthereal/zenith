import { integer, text, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth.sql';
import { projectsTable } from './project.sql';

export const projectCollaboratorsTable = pgTable('project_collaborators', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projectsTable.id, { onDelete: 'cascade' })
});

export const projectCollaboratorRelation = relations(projectCollaboratorsTable, ({ one }) => ({
	project: one(projectsTable, {
		fields: [projectCollaboratorsTable.projectId],
		references: [projectsTable.id]
	}),
	user: one(users, { fields: [projectCollaboratorsTable.userId], references: [users.id] })
}));
