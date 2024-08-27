<script lang="ts">
	import Label from '$lib/components/Label.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, enhance, allErrors, delayed } = superForm(data.form);
</script>

<h1 class="heading-main mb-4">Add an email address</h1>
<form method="post" use:enhance class="flex max-w-64 flex-col">
	<Label forAttr="email">Email</Label>
	<div class="flex gap-2">
		<input type="text" bind:value={$form.email} name="email" class="input input-primary" />
		<button class="btn btn-primary mr-auto"
			>Add {#if $delayed}
				<Spinner />
			{/if}</button
		>
	</div>
	{#if $allErrors}
		{#each $allErrors as err}
			<span class="mt-2 text-error">{err.messages}</span>
		{/each}
	{/if}
</form>
