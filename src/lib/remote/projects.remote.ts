import { form, query } from '$app/server';
import { error, invalid, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';
import { projectsTable } from '$lib/db/schema';
import { dayjs, normalizeDateInput } from '$lib/datetime';
import {
	zCreateProjectForm,
	zDeleteProjectForm,
	zEditProjectForm,
	zProjectQueryId
} from '$lib/zod';
import { getUserContext } from '$lib/server/request-context';

export const getProjects = query(async () => {
	const { user } = getUserContext();

	return db.query.projectsTable.findMany({
		where: {
			userId: user.id
		},
		orderBy: { deadline: 'asc' },
		with: {
			collaborators: true
		}
	});
});

export const getProject = query(zProjectQueryId, async (projectId) => {
	const { user } = getUserContext();

	const project = await db.query.projectsTable.findFirst({
		where: { id: projectId },
		with: {
			events: {
				orderBy: {
					date: 'asc'
				},
				with: {
					project: true
				}
			}
		}
	});

	if (!project || project.userId !== user.id) {
		error(404, 'Project not found');
	}

	return project;
});

export const createProject = form(zCreateProjectForm, async ({ name, deadline }) => {
	const { user } = getUserContext();

	const [insertedProject] = await db
		.insert(projectsTable)
		.values({
			name,
			userId: user.id,
			deadline: normalizeOptionalDate(deadline)
		})
		.returning({
			projectId: projectsTable.id
		});

	redirect(303, `/projects/${insertedProject.projectId}`);
});

export const editProject = form(zEditProjectForm, async ({ id, name, deadline }) => {
	const { user } = getUserContext();

	const project = await db.query.projectsTable.findFirst({
		where: { id, userId: user.id }
	});

	if (!project) {
		invalid('Project not found');
	}

	const trimmedName = name?.trim() ?? '';
	const normalizedName = trimmedName.length > 0 ? trimmedName : undefined;
	const normalizedDeadline = normalizeOptionalDate(deadline);

	if (!normalizedName && !normalizedDeadline && deadline !== '') {
		invalid('Provide a name or deadline');
	}

	await db
		.update(projectsTable)
		.set({
			name: normalizedName ?? project.name,
			deadline: normalizedDeadline ?? null
		})
		.where(eq(projectsTable.id, id));

	return { ok: true };
});

export const deleteProject = form(zDeleteProjectForm, async ({ id }) => {
	const { user } = getUserContext();

	const project = await db.query.projectsTable.findFirst({
		where: { id, userId: user.id }
	});

	if (!project) {
		invalid('Project not found');
	}

	await db.delete(projectsTable).where(eq(projectsTable.id, id));

	redirect(303, '/projects');
});

function normalizeOptionalDate(value?: string) {
	if (!value) return null;

	const normalized = normalizeDateInput(value);

	if (!normalized) return null;

	const parsed = dayjs(normalized);

	return parsed.isValid() ? normalized : null;
}
