<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { eventsTable, tagEnum } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	import type { deleteSchema, editSchema } from '$lib/zod';
	import dayjs from 'dayjs';
	import { Pencil, Trash } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';

	interface Props {
		editFormData: SuperValidated<Infer<typeof editSchema>>;
		deleteFormData: SuperValidated<Infer<typeof deleteSchema>>;
		event: typeof eventsTable.$inferSelect;
	}

	let { editFormData, deleteFormData, event }: Props = $props();

	let editModal: HTMLDialogElement = $state() as HTMLDialogElement;
	let deleteModal: HTMLDialogElement = $state() as HTMLDialogElement;

	const tags = tagEnum.enumValues;

	$effect(() => {
		editModal = document.getElementById(`edit-modal-${event.id}`) as HTMLDialogElement;
		deleteModal = document.getElementById(`delete-modal-${event.id}`) as HTMLDialogElement;
	});

	const {
		form: editForm,
		enhance: editEnhance,
		constraints: editConstraints,
		delayed: editDelayed
	} = superForm(editFormData, {
		onSubmit({ formData }) {
			formData.set('id', event.id.toString());
		},
		onUpdated() {
			invalidate('fetch:events');
			editModal.close();
		},
		id: `editForm-${event.id}`
	});

	const { enhance: deleteEnhance } = superForm(deleteFormData, {
		onSubmit({ formData }) {
			formData.set('id', event.id.toString());
			deleteModal.close();
		},
		onUpdated() {
			invalidate('fetch:events');
		},
		id: `deleteForm-${event.id}`
	});

	const date = $derived(dayjs(event.date));
	const dateInput = dateProxy(editForm, 'date', { format: 'datetime' });

	$editForm.event = event.content;
	$dateInput = dayjs(event.date).format('YYYY-MM-DDTHH:mm:ss.SSS');
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-3xl font-bold text-primary">{event.content}</h1>
		<p>
			<span class={cn(date.isBefore(dayjs()) && 'text-error')}
				>{date.format('D MMMM YYYY, HH:mm')}</span
			>
			{'·'}
			<span class="font-medium text-secondary">{event.tag}</span>
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
			<h1 class="mb-4 text-xl font-medium">Edit Event</h1>
			<form method="POST" action="/?/edit" use:editEnhance class="flex flex-col gap-4">
				<input
					{...$editConstraints.event}
					bind:value={$editForm.event}
					type="text"
					name="event"
					placeholder="What?"
					class="input input-bordered w-full"
				/>
				<div class="grid grid-cols-2 gap-4">
					<input
						{...$editConstraints.date}
						bind:value={$dateInput}
						name="date"
						type="datetime-local"
						placeholder="When?"
						class="input input-bordered w-full"
					/>
					<select name="tag" bind:value={$editForm.tag} class="select select-bordered">
						<option disabled selected>Select a Tag</option>
						{#each tags as tag}
							<option class="option" value={tag}>{tag}</option>
						{/each}
					</select>
				</div>
				<div class="flex">
					<button class="btn btn-primary mx-auto" type="submit">
						Update
						{#if $editDelayed}
							<span class="loading loading-spinner loading-xs"></span>
						{/if}
					</button>
				</div>
			</form>
			<p class="mt-8 select-none text-center font-mono text-xs text-base-content/75">
				press <kbd class="kbd">esc</kbd> to cancel
			</p>
		</div>
	</dialog>
	<dialog class="modal" id={`delete-modal-${event.id}`}>
		<div class="modal-box">
			<h2 class="text-xl font-bold">Are you sure?</h2>
			<p class="pt-6">
				You are about to delete "{event.content}"
			</p>
			<div class="modal-action">
				<form method="dialog" class="flex gap-4">
					<button class="btn">No</button>
				</form>
				<form method="POST" action="/?/delete" use:deleteEnhance>
					<button class="btn btn-error">Yes</button>
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
