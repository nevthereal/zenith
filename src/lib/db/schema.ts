import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const tagEnum = pgEnum('tag', ['Private', 'Work', 'Fitness', 'Events', 'Productivity']);

export const eventsTable = pgTable('events', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	content: text('content').notNull(),
	userId: text('userId')
		.references(() => usersTable.id)
		.notNull(),
	tag: tagEnum('tag').notNull()
});

export const usersTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull(),
	githubId: integer('github_id').unique().notNull(),
	email: text('email'),
	admin: boolean('admin').default(false),
	joined: timestamp('joined').notNull(),
	stripeId: text('stripe_id'),
	paid: boolean('paid').default(false)
});

export const sessionsTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const ordersTable = pgTable('orders', {
	orderId: text('order_id').primaryKey().notNull(),
	customerId: text('cus_id').notNull(),
	sessionId: text('session_id').notNull(),
	completedAt: timestamp('completed_at').notNull(),
	userId: text('user_id').references(() => usersTable.id),
	invoiceUrl: text('invoice_url').notNull()
});

export const userRelation = relations(usersTable, ({ many }) => ({
	events: many(eventsTable)
}));

export const eventRelation = relations(eventsTable, ({ one }) => ({
	user: one(usersTable, { fields: [eventsTable.userId], references: [usersTable.id] })
}));
