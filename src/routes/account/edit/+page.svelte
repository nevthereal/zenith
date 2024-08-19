<script lang="ts">
	import Label from '$lib/components/Label.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	let deleteModal: HTMLDialogElement = $state() as HTMLDialogElement;

	$effect(() => {
		deleteModal = document.getElementById('delete-modal') as HTMLDialogElement;
	});

	const {
		form: usernameForm,
		enhance: usernameEnhance,
		errors: usernameErrors,
		message: usernameMessage
	} = superForm(data.updateForm);
</script>

<svelte:head>
	<title>Account - Edit</title>
</svelte:head>

<section class="max-w-64 space-y-4">
	<h1 class="heading-main">Edit account</h1>
	<form use:usernameEnhance action="?/username" method="post" class="flex flex-col gap-2">
		<div class="flex flex-col">
			<Label forAttr="username">Update username</Label>
			<input
				type="text"
				bind:value={$usernameForm.username}
				name="username"
				class="input input-bordered"
			/>
		</div>
		{#if $usernameErrors.username}
			{#each $usernameErrors.username as err}
				<span class="text-error">
					{`${err} `}
				</span>
			{/each}
		{/if}
		<button class="btn btn-primary">Update</button>
		{#if $usernameMessage}
			<span class="text-success">{$usernameMessage}</span>
		{/if}
	</form>
	<div class="flex flex-col gap-2">
		<h2 class="heading-sub">Danger zone</h2>
		<button class="btn btn-outline btn-error" onclick={() => deleteModal.showModal()}
			>Delete Account</button
		>
	</div>
</section>
<dialog id="delete-modal" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm account deletion</h3>
		<p class="py-4">
			Do you really want to delete your account? <br /> This action can't be undone.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>
			<form action="?/delete" method="post">
				<button class="btn btn-error">Delete</button>
			</form>
		</div>
	</div>
</dialog>
