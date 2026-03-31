<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import Spinner from '$lib/components/Spinner.svelte';
	import { createProject } from '$lib/remote/projects.remote';
	import { cn } from '$lib/utils.js';
	import { zCreateProjectForm } from '$lib/zod';

	const createProjectForm = createProject.preflight(zCreateProjectForm);
</script>

<svelte:head>
	<title>Create a project</title>
</svelte:head>

<section class="mx-auto w-full max-w-xl">
	<h1 class="heading-main text-center">Create a project</h1>
	<form {...createProjectForm} class="md:mx-16">
		<Field.Set class="gap-6">
			<Field.Group>
				<Field.Field data-invalid={createProjectForm.fields.name.issues()?.length ? true : undefined}>
					<Field.Label for="name">Project name</Field.Label>
					<input
						id="name"
						class={cn(
							'input input-primary w-full',
							createProjectForm.fields.name.issues()?.length && 'input-error'
						)}
						{...createProjectForm.fields.name.as('text')}
					/>
					{#each createProjectForm.fields.name.issues() ?? [] as issue (`name-${issue.message}`)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Field>
				<Field.Field>
					<Field.Label for="deadline">Deadline (optional)</Field.Label>
					<input
						id="deadline"
						class="input input-primary w-full"
						{...createProjectForm.fields.deadline.as('date')}
					/>
				</Field.Field>
			</Field.Group>
			{#each createProjectForm.fields.allIssues() ?? [] as issue (`project-${issue.path.join('.')}-${issue.message}`)}
				{#if issue.path.length === 0}
					<Field.Error>{issue.message}</Field.Error>
				{/if}
			{/each}
			<button class="btn btn-primary mx-auto mt-2" disabled={createProjectForm.pending > 0}>
				Create
				{#if createProjectForm.pending > 0}
					<Spinner />
				{/if}
			</button>
		</Field.Set>
	</form>
</section>

<style>
	input::-webkit-calendar-picker-indicator {
		display: none;
	}

	input[type='date']::-webkit-input-placeholder {
		visibility: hidden !important;
	}
</style>
