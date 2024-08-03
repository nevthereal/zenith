<script lang="ts">
	import Label from '$lib/components/Label.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, allErrors, enhance, delayed, submit } = superForm(data.form);
	$effect(() => {
		if ($form.code.length === 6) {
			submit();
		}
	});
</script>

<h1 class="heading-main">You've got mail!</h1>
<form method="post" use:enhance class="flex max-w-64 flex-col">
	<Label forAttr="code">Verification code</Label>
	<div class="flex gap-2">
		<input type="text" name="code" class="input input-primary" bind:value={$form.code} />
		<button class="btn btn-primary mr-auto"
			>Verify {#if $delayed}
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
