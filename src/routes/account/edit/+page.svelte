<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth/client.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { updateUsername } from '$lib/remote/account.remote';
	import { cn } from '$lib/utils.js';
	import { zUpdateUser } from '$lib/zod';

	let { data } = $props();
	const user = $derived(data.user!);

	let deleteModal: HTMLDialogElement;
	let usernameInitialized = $state(false);
	const usernameForm = updateUsername.preflight(zUpdateUser);

	$effect(() => {
		if (usernameInitialized) return;

		usernameForm.fields.username.set(user.name);
		usernameInitialized = true;
	});
</script>

<svelte:head>
	<title>Account - Edit</title>
</svelte:head>

<section class="max-w-64 space-y-4">
	<h1 class="heading-main">Edit account</h1>
	<form {...usernameForm} class="flex flex-col gap-4">
		<Field.Field data-invalid={usernameForm.fields.username.issues()?.length ? true : undefined}>
			<Field.Label for="username">Update username</Field.Label>
			<input
				id="username"
				class={cn(
					'input input-bordered w-full',
					usernameForm.fields.username.issues()?.length && 'input-error'
				)}
				{...usernameForm.fields.username.as('text')}
			/>
			{#each usernameForm.fields.username.issues() ?? [] as issue (`username-${issue.message}`)}
				<Field.Error>{issue.message}</Field.Error>
			{/each}
		</Field.Field>
		{#each usernameForm.fields.allIssues() ?? [] as issue (`account-${issue.path.join('.')}-${issue.message}`)}
			{#if issue.path.length === 0}
				<Field.Error>{issue.message}</Field.Error>
			{/if}
		{/each}
		<button class="btn btn-primary" disabled={usernameForm.pending > 0}>Update</button>
	</form>
	<div class="flex flex-col gap-2">
		<h2 class="heading-sub">Danger zone</h2>
		<button class="btn btn-outline btn-error" onclick={() => deleteModal.showModal()}
			>Delete Account</button
		>
	</div>
</section>
<dialog id="delete-modal" bind:this={deleteModal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm account deletion</h3>
		<p class="py-4">
			Do you really want to delete your account? <br /> This action can't be undone.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>
			<button
				class="btn btn-error"
				onclick={async () => {
					await authClient(page.url.origin).deleteUser({ callbackURL: '/home' });
					location.reload();
				}}>Delete</button
			>
		</div>
	</div>
</dialog>
