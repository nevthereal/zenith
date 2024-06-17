<script lang="ts">
	import type { eventsTable } from '$lib/db/schema';
	import type { EditSchema } from '$lib/zod';
	import dayjs from 'dayjs';
	import { Check, Pencil, Trash, X } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	interface Props {
		data: SuperValidated<Infer<EditSchema>>;
		event: typeof eventsTable.$inferSelect;
	}

	let { data, event }: Props = $props();

	let editModal: HTMLDialogElement;
	let deleteModal: HTMLDialogElement;

	$effect(() => {
		editModal = document.getElementById(`edit-modal-${event.id}`) as HTMLDialogElement;
		deleteModal = document.getElementById(`delete-modal-${event.id}`) as HTMLDialogElement;
	});

	const { form, enhance, constraints, delayed } = superForm(data, {
		onResult() {
			location.reload();
		},
		id: `editForm-${event.id}`
	});
	const deleteEvent = async () => {
		await fetch(`/api/delete-event?id=${event.id}`, { method: 'DELETE' });
		location.reload();
	};

	const date = dayjs(event.date);

	const formattedDate = date
		.toDate()
		.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

	$form.event = event.content;
	$form.id = event.id;
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-2xl font-bold text-primary">{event.content}</h1>
		<p class={date.isBefore(dayjs()) ? 'text-warning' : ''}>
			{formattedDate}
		</p>
	</div>
	<div class="flex gap-2">
		<button class="btn btn-circle my-auto" onclick={() => editModal.showModal()}>
			<Pencil stroke-width={2} />
		</button>
		<button class="btn btn-circle my-auto" onclick={() => deleteModal.showModal()}>
			<Trash stroke-width={2} />
		</button>
	</div>
	<dialog id={`edit-modal-${event.id}`} class="modal">
		<div class="modal-box">
			<form method="POST" action="?/edit" use:enhance class="flex justify-between gap-2">
				<input
					{...$constraints.event}
					bind:value={$form.event}
					type="text"
					name="event"
					placeholder="What?"
					class="input w-full"
				/>
				<input
					{...$constraints.date}
					bind:value={$form.date}
					name="date"
					type="datetime-local"
					placeholder="When?"
					class="input w-full text-center"
				/>
				<input type="text" name="id" class="hidden" bind:value={$form.id} />
				<div class="flex">
					<button class="btn btn-circle my-auto" type="submit">
						{#if !$delayed}
							<Check />
						{:else}
							<span class="loading loading-spinner loading-xs"></span>
						{/if}
					</button>
				</div>
			</form>
			<p class="mt-8 select-none text-center font-mono text-xs text-base-content/75">
				press <kbd class="kbd">esc</kbd> or click outside to cancel
			</p>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	<dialog class="modal" id={`delete-modal-${event.id}`}>
		<div class="modal-box">
			<h2 class="text-xl font-bold">Are you sure?</h2>
			<p class="pt-6">
				You are about to delete <br />
				<span class="font-medium text-primary">{event.content}</span>
				at
				<span class="font-medium text-primary">{formattedDate}</span>
			</p>
			<div class="modal-action">
				<form method="dialog" class="flex gap-4">
					<button class="btn">No</button>
					<button class="btn btn-error" onclick={deleteEvent}>Yes</button>
				</form>
			</div>
		</div>
	</dialog>
</div>

<style>
	input::-webkit-calendar-picker-indicator {
		display: none;
	}

	input[type='date']::-webkit-input-placeholder {
		visibility: hidden !important;
	}
</style>
