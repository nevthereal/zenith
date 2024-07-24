<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, errors, enhance, constraints } = superForm(data.createProjectForm);

	const dateInput = dateProxy(form, 'deadline', { format: 'datetime' });
</script>

<section class="mx-auto w-full max-w-xl">
	<h1 class="mb-6 text-center text-3xl font-bold md:text-5xl">Create a project</h1>
	<form method="post" class="flex flex-col gap-2 md:mx-16" use:enhance>
		<div class="flex flex-col">
			<label for="name" class="font-medium">Project name:</label>
			<input
				{...$constraints.name}
				type="text"
				class="input input-primary"
				name="name"
				bind:value={$form.name}
			/>
			{#if $errors.name}
				<span>{$errors.name}</span>
			{/if}
		</div>
		<div class="flex flex-col">
			<label for="dealine" class="font-medium">Deadline (optional):</label>
			<input
				{...$constraints.deadline}
				type="datetime-local"
				class="input input-primary"
				name="deadline"
				bind:value={$dateInput}
			/>
		</div>
		<button class="btn btn-primary mx-auto mt-2">Create</button>
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
