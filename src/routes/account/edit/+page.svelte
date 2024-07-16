<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	let deleteModal: HTMLDialogElement = $state() as HTMLDialogElement;

	$effect(() => {
		deleteModal = document.getElementById('delete-modal') as HTMLDialogElement;
	});

	const { form, enhance, errors, message } = superForm(data.updateForm);
</script>

<h1 class="mb-4 text-5xl font-bold tracking-tighter">Edit account</h1>
<form use:enhance action="?/update_user" method="post" class="mb-8 flex max-w-96 flex-col gap-2">
	<input
		type="text"
		bind:value={$form.username}
		name="username"
		placeholder="Username"
		class="input"
	/>
	{#if $errors.username}
		<span class="text-error">{$errors.username}</span>
	{/if}
	<input type="text" bind:value={$form.email} name="email" placeholder="Email" class="input" />
	{#if $errors.email}
		<span class="text-error">{$errors.email}</span>
	{/if}
	<button disabled={!$form.email && !$form.username} class="btn btn-primary">Update</button>
	{#if $message}
		<span class="text-success">{$message}</span>
	{/if}
</form>
<h2 class="mb-4 text-3xl font-bold tracking-tighter">Danger zone</h2>
<button class="btn btn-outline btn-error" onclick={() => deleteModal.showModal()}
	>Delete Account</button
>
<dialog id="delete-modal" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Confirm account deletion</h3>
		<p class="py-4">
			Do you really want to delete your account? <br /> This action can't be undone.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Cancel</button>
			</form>
			<form action="?/delete_user" method="post">
				<button class="btn btn-error">Delete</button>
			</form>
		</div>
	</div>
</dialog>
