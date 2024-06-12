<script lang="ts">
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import Task from '$lib/components/Task.svelte';

	export let data: PageServerData;

	const tasks = data.tasks;

	const { form, delayed, enhance } = superForm(data.form);
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-16 text-5xl font-bold">What are you up to?</h1>
	<form method="POST" class="mb-12 flex items-center gap-4" use:enhance>
		<input
			class="input input-bordered input-primary border-2"
			type="text"
			placeholder="Event or Task"
			name="task"
			bind:value={$form.task}
		/>
		<button class="btn btn-primary"
			>Add!
			{#if $delayed}
				<span class="loading loading-spinner loading-xs"></span>
			{/if}
		</button>
	</form>
	<section class="flex flex-col gap-4">
		{#each tasks as task}
			<Task {task} />
		{/each}
	</section>
</div>
