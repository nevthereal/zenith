import { integer, text, pgTable, serial } from 'drizzle-orm/pg-core';
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
