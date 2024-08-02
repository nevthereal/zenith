<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, allErrors, enhance } = superForm(data.form);
</script>

<h1 class="heading-main">Verify your email</h1>
<form method="post" use:enhance class="flex max-w-64 flex-col gap-2">
	<input type="text" name="code" class="input input-primary" bind:value={$form.code} />
	{#if $allErrors}
		{#each $allErrors as err}
			<span>{err.messages}</span>
		{/each}
	{/if}
	<button class="btn btn-primary mr-auto">Verify</button>
</form>
