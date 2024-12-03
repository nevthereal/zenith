<script lang="ts">
	import Label from '$lib/components/Label.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	const { form, allErrors, enhance } = superForm(data.form);
</script>

<section>
	<h1 class="heading-main mb-2">You've got mail!</h1>
	<p class="mb-4">We've sent a code to <span class="font-medium">{data.user.email}</span></p>
	<form method="post" use:enhance class="flex max-w-64 flex-col">
		<Label forAttr="code">Verification code</Label>
		<div class="flex gap-2">
			<input name="code" class="input input-primary" bind:value={$form.code} />
			<button class="btn btn-primary">Check</button>
		</div>
		{#if $allErrors}
			{#each $allErrors as err}
				<span class="mt-2 text-error">{err.messages}</span>
			{/each}
		{/if}
	</form>
</section>
