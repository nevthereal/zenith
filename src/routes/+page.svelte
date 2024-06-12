<script lang="ts">
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import Task from '$lib/components/Task.svelte';

	export let data: PageServerData;

	const tasks = data.tasks;

	const { form, delayed, enhance } = superForm(data.form, {
		onUpdated() {
			location.reload();
		},

		onError({ result }) {
			console.error('Something went wrong', result);
		}
	});
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

	<section class="flex flex-col items-center gap-4">
		{#if tasks.length > 0}
			<h2 class="text-xl font-semibold italic">Up today:</h2>
		{:else}
			<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
		{/if}
		{#each tasks as task}
			<Task {task} />
		{/each}
		<a href="/upcoming" class="link link-primary font-semibold italic">View all upcoming</a>
	</section>
</div>
