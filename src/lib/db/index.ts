import { drizzle } from 'drizzle-orm/neon-http';
import { DB_URL } from '$env/static/private';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';
import { defineRelations } from 'drizzle-orm';

const client = neon(DB_URL);

export const relations = defineRelations(schema, (r) => ({
	eventsTable: {
		creator: r.one.users({
			from: r.eventsTable.userId,
			to: r.users.id
		}),
		project: r.one.projectsTable({
			from: r.eventsTable.projectId,
			to: r.projectsTable.id,
			optional: true
		})
	},
	projectsTable: {
		creator: r.one.users({
			from: r.projectsTable.userId,
			to: r.users.id
		}),
		collaborators: r.many.users()
	},
	users: {
		collabs: r.many.projectsTable({
			from: r.users.id.through(r.projectCollaboratorsTable.userId),
			to: r.projectsTable.id.through(r.projectCollaboratorsTable.projectId)
		})
	}
}));

export const db = drizzle(client, { relations });
