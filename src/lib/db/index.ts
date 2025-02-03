import { drizzle } from 'drizzle-orm/neon-http';
import { DB_URL } from '$env/static/private';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';

const client = neon(DB_URL);

export const db = drizzle(client, { schema });
