<script lang="ts">
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';

	export let data: PageServerData;

	const { form, delayed, enhance, message } = superForm(data.form);
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-16 text-5xl font-bold">What are you up to?</h1>
	<form method="POST" class="flex items-center gap-4" use:enhance>
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
	{#if $message}
		<p>{$message}</p>
	{/if}
</div>
