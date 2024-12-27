import { text, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const verificationCodesTable = pgTable('verification_codes', {
	id: serial('id').primaryKey(),
	code: text('code').notNull(),
	user_id: text('user_id').unique().notNull(),
	email: text('email').notNull(),
	expires: timestamp('expires').notNull()
});
