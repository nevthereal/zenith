import { relations } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['active', 'archived', 'completed']);

export const eventsTable = pgTable('events', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	content: text('content').notNull(),
	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	completed: boolean('completed').default(false),
	projectId: integer('project_id').references(() => projectsTable.id, { onDelete: 'set null' })
});

export const projectsTable = pgTable('projects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	status: statusEnum('status').default('active'),
	deadline: date('deadline')
});

export const projectCollaboratorsTable = pgTable('project_collaborators', {
	id: serial('id').primaryKey(),
	userId: text('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
	projectId: integer('project_id').references(() => projectsTable.id, { onDelete: 'cascade' })
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
		.references(() => usersTable.id, { onDelete: 'cascade' }),
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
	userId: text('user_id').references(() => usersTable.id, { onDelete: 'set null' }),
	invoiceUrl: text('invoice_url').notNull()
});

export const userRelation = relations(usersTable, ({ many }) => ({
	events: many(eventsTable)
}));

export const projectRelation = relations(projectsTable, ({ one, many }) => ({
	user: one(usersTable, { fields: [projectsTable.userId], references: [usersTable.id] }),
	collaborators: many(projectCollaboratorsTable)
}));

export const projectCollaboratorRelation = relations(projectCollaboratorsTable, ({ one }) => ({
	project: one(projectsTable, {
		fields: [projectCollaboratorsTable.projectId],
		references: [projectsTable.id]
	}),
	user: one(usersTable, { fields: [projectCollaboratorsTable.userId], references: [usersTable.id] })
}));

export const eventRelation = relations(eventsTable, ({ one }) => ({
	user: one(usersTable, { fields: [eventsTable.userId], references: [usersTable.id] }),
	project: one(projectsTable, { fields: [eventsTable.projectId], references: [projectsTable.id] })
}));
