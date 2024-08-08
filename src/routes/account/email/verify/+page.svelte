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

<section>
	<h1 class="heading-main">You've got mail!</h1>
	<p class="mb-4">We've sent a code to <span class="font-medium">{data.user.email}</span></p>
	<form method="post" use:enhance class="flex max-w-64 flex-col">
		<Label forAttr="code">Verification code</Label>
		<div class="flex gap-2">
			<input
				inputmode="numeric"
				maxlength="6"
				size="6"
				name="code"
				class="input input-primary"
				bind:value={$form.code}
			/>
		</div>
		{#if $allErrors}
			{#each $allErrors as err}
				<span class="mt-2 text-error">{err.messages}</span>
			{/each}
		{/if}
	</form>
</section>
