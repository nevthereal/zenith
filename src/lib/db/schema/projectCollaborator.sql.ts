import { integer, text, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './user.sql';
import { projectsTable } from './project.sql';

export const projectCollaboratorsTable = pgTable('project_collaborators', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projectsTable.id, { onDelete: 'cascade' })
});

export const projectCollaboratorRelation = relations(projectCollaboratorsTable, ({ one }) => ({
	project: one(projectsTable, {
		fields: [projectCollaboratorsTable.projectId],
		references: [projectsTable.id]
	}),
	user: one(usersTable, { fields: [projectCollaboratorsTable.userId], references: [usersTable.id] })
}));
