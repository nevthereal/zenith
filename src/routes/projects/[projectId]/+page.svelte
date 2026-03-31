<script lang="ts">
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as Field from '$lib/components/ui/field/index.js';
	import { cn } from '$lib/utils.js';
	import { dayjs, formatDate } from '$lib/datetime';
	import { deleteProject, editProject, getProject } from '$lib/remote/projects.remote';
	import { zDeleteProjectForm, zEditProjectForm } from '$lib/zod';

	let { data } = $props();
	const projectId = data.projectId;
	const user = $derived(data.user!);
	const projectQuery = getProject(projectId);
	const userLocale = $derived(user.locale);
	const userTimeZone = $derived(user.timeZone);

	let editModal: HTMLDialogElement;
	let deleteConfirmation = $state('');
	const editProjectForm = editProject.for(projectId).preflight(zEditProjectForm);
	const deleteProjectForm = deleteProject.for(projectId).preflight(zDeleteProjectForm);
	const enhancedEditProjectForm = editProjectForm.enhance(async ({ submit }) => {
		await submit();

		if (!editProjectForm.fields.allIssues()?.length) {
			editModal.close();
		}
	});

	function deadlineInputValue(deadline: string | Date | null) {
		if (!deadline) return '';

		return deadline instanceof Date ? dayjs(deadline).utc().format('YYYY-MM-DD') : deadline;
	}

	function openEditModal(project: Awaited<typeof projectQuery>) {
		editProjectForm.fields.set({
			id: project.id,
			name: project.name,
			deadline: deadlineInputValue(project.deadline)
		});
		editModal.showModal();
	}
</script>

<svelte:head>
	<title>Project</title>
</svelte:head>

<svelte:boundary>
	{@const project = await projectQuery}
	{@const deadlineDate =
		project.deadline
			? userTimeZone
				? dayjs.tz(`${deadlineInputValue(project.deadline)}T00:00`, userTimeZone)
				: dayjs(deadlineInputValue(project.deadline))
			: null}
	{@const events = project.events.filter((entry) => !entry.completed)}
	{@const completedEvents = project.events.filter((entry) => entry.completed)}

	<div class="mx-auto w-full md:max-w-2xl">
		<section class="text-center">
			<h1 class="mb-12 text-4xl font-bold md:text-6xl">{project.name}</h1>
		</section>
		<div class="flex flex-col">
			<div class="flex max-md:flex-col max-md:gap-4 md:justify-between">
				<div>
					<h1 class="heading-sub text-muted mb-8">Project details</h1>
					<ul>
						<li>
							<span class="font-medium">Deadline:</span>
							<span class="text-muted"
								>{#if deadlineDate}
									{(userTimeZone ? dayjs().tz(userTimeZone) : dayjs()).to(deadlineDate)} (
									{formatDate(deadlineDate.toDate(), {
										locale: userLocale,
										timeZone: userTimeZone
									})}
									)
								{:else}
									No deadline
								{/if}
							</span>
						</li>
						<li>
							<span class="font-medium">Status:</span>
							<span
								class={cn(
									project.status === 'active'
										? 'text-success'
										: project.status === 'archived'
											? 'text-secondary'
											: 'text-muted'
								)}>{project.status}</span
							>
						</li>
					</ul>
				</div>
				<div>
					<button class="btn btn-primary my-auto" onclick={() => openEditModal(project)}
						>Edit Project</button
					>
				</div>
			</div>
			<div>
				{#if events.length != 0}
					<section class="mt-4 flex flex-col items-center gap-4">
						<h3 class="heading-muted mb-4">Due events ({events.length})</h3>
						{#each events as event (event.id)}
							<Event {event} projects={data.userProjects} locale={userLocale} timeZone={userTimeZone} />
						{/each}
					</section>
				{/if}
				{#if completedEvents.length != 0}
					<section class="mt-4 flex flex-col items-center gap-4">
						<h3 class="heading-small mb-4 text-success">
							Completed events ({completedEvents.length})
						</h3>
						{#each completedEvents as event (event.id)}
							<Event {event} projects={data.userProjects} locale={userLocale} timeZone={userTimeZone} />
						{/each}
					</section>
				{/if}
				{#if completedEvents.length === 0 && events.length === 0}
					<h2 class="heading-small mt-8 text-center italic">No events in this project</h2>
				{/if}
			</div>
		</div>
	</div>

	<dialog bind:this={editModal} class="modal">
		<div class="modal-box">
			<h1 class="heading-main mb-4">Edit Project</h1>
			<form {...enhancedEditProjectForm} class="flex flex-col gap-4">
				<Field.Group>
					<Field.Field data-invalid={editProjectForm.fields.name.issues()?.length ? true : undefined}>
						<Field.Label for="name">Name</Field.Label>
						<input
							id="name"
							class={cn(
								'input input-primary w-full',
								editProjectForm.fields.name.issues()?.length && 'input-error'
							)}
							{...editProjectForm.fields.name.as('text')}
						/>
						{#each editProjectForm.fields.name.issues() ?? [] as issue (`edit-name-${issue.message}`)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
					<Field.Field data-invalid={editProjectForm.fields.deadline.issues()?.length ? true : undefined}>
						<Field.Label for="deadline">Deadline</Field.Label>
						<input
							id="deadline"
							class={cn(
								'input input-primary w-full',
								editProjectForm.fields.deadline.issues()?.length && 'input-error'
							)}
							{...editProjectForm.fields.deadline.as('date')}
						/>
						{#each editProjectForm.fields.deadline.issues() ?? [] as issue (`edit-deadline-${issue.message}`)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
				</Field.Group>
				{#each editProjectForm.fields.allIssues() ?? [] as issue (`edit-project-${issue.path.join('.')}-${issue.message}`)}
					{#if issue.path.length === 0}
						<Field.Error>{issue.message}</Field.Error>
					{/if}
				{/each}
				<button class="btn btn-primary" disabled={editProjectForm.pending > 0}>
					Edit
					{#if editProjectForm.pending > 0}
						<Spinner />
					{/if}
				</button>
			</form>
			<h1 class="heading-main my-4 border-t border-base-content/40 pt-4 text-error">
				Delete project?
			</h1>
			<form {...deleteProjectForm} class="mt-4">
				<Field.Group>
					<Field.Field>
						<Field.Label for="confirmation"
							>Type <span class="font-medium text-base-content">delete my project</span> below</Field.Label
						>
						<input
							id="confirmation"
							type="text"
							bind:value={deleteConfirmation}
							class="input input-error w-full"
						/>
					</Field.Field>
					{#each deleteProjectForm.fields.allIssues() ?? [] as issue (`delete-project-${issue.path.join('.')}-${issue.message}`)}
						{#if issue.path.length === 0}
							<Field.Error>{issue.message}</Field.Error>
						{/if}
					{/each}
					<button
						disabled={deleteConfirmation != 'delete my project' || deleteProjectForm.pending > 0}
						class="btn btn-error mt-4"
					>
						Delete
						{#if deleteProjectForm.pending > 0}
							<Spinner />
						{/if}
					</button>
				</Field.Group>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>

	{#snippet pending()}
		<div class="mx-auto w-full md:max-w-2xl">
			<Loading text="project" />
		</div>
	{/snippet}

	{#snippet failed(_error, reset)}
		<div class="flex flex-col items-center gap-3">
			<Error />
			<button class="btn btn-outline btn-sm" onclick={reset}>Retry</button>
		</div>
	{/snippet}
</svelte:boundary>
