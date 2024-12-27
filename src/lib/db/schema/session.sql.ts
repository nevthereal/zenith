import { text, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { usersTable } from './user.sql';
import type { InferSelectModel } from 'drizzle-orm';

export const sessionsTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type Session = InferSelectModel<typeof sessionsTable>;
