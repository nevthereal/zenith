<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, enhance, allErrors } = superForm(data.form);
</script>

<h1 class="heading-main">Add an email address</h1>
<form method="post" use:enhance class="flex max-w-64 flex-col gap-2">
	<input type="text" bind:value={$form.email} name="email" class="input input-primary" />
	{#if $allErrors}
		{#each $allErrors as err}
			<span class="text-error">{err.messages}</span>
		{/each}
	{/if}
	<button class="btn btn-primary mr-auto">Add</button>
</form>
