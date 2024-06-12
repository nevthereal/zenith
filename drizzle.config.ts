import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	dbCredentials: {
		url: process.env.DB_URL!
	},
	dialect: 'sqlite',
	driver: 'turso',
	schema: './src/lib/db/schema.ts',
	out: './drizzle'
} satisfies Config;
