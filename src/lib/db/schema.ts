import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const eventsTable = pgTable('events', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	content: text('content').notNull(),
	userId: text('userId')
		.references(() => usersTable.id)
		.notNull()
});

export const usersTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	username: text('username'),
	githubId: integer('github_id').unique().notNull(),
	email: text('email').notNull(),
	admin: boolean('admin').default(false),
	joined: timestamp('joined').notNull()
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
