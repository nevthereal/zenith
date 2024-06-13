import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const eventsTable = sqliteTable('events', {
	id: int('id').primaryKey(),
	due: int('due', { mode: 'timestamp' }).notNull(),
	content: text('content').notNull(),
	userId: int('userId').references(() => usersTable.id)
});

export const usersTable = sqliteTable('users', {
	id: text('id').notNull().primaryKey(),
	username: text('username')
});

export const sessionTable = sqliteTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: int('expires_at').notNull()
});
