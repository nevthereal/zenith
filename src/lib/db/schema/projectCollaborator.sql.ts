import { integer, text, pgTable, serial } from 'drizzle-orm/pg-core';
import { users } from './auth.sql';
import { projectsTable } from './project.sql';
import { index } from 'drizzle-orm/pg-core';

export const projectCollaboratorsTable = pgTable(
	'project_collaborators',
	{
		id: serial('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		projectId: integer('project_id')
			.notNull()
			.references(() => projectsTable.id, { onDelete: 'cascade' })
	},
	(t) => [
		index('user_id_idx_project_collaborators').on(t.userId),
		index('project_id_idx_project_collaborators').on(t.projectId)
	]
);
