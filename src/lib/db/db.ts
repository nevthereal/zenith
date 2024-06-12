import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { DB_URL } from '$env/static/private';
import * as schema from '$lib/db/schema';

const client = createClient({
	url: DB_URL
});

export const db = drizzle(client, { schema });
