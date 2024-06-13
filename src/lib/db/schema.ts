import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const eventsTable = pgTable('events', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	content: text('content').notNull(),
	userId: text('userId').references(() => usersTable.id)
});

export const usersTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	username: text('username')
});

export const sessionTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
