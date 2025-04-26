import { text, date, pgTable, serial, pgEnum, index } from 'drizzle-orm/pg-core';
import { users } from './auth.sql';

export const statusEnum = pgEnum('status', ['active', 'archived']);

export const projectsTable = pgTable(
	'projects',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		status: statusEnum('status').default('active').notNull(),
		deadline: date('deadline')
	},
	(t) => [index('user_id_idx_projects').on(t.userId)]
);
