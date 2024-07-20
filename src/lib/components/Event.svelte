<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { eventsTable, spaceEnum } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	import type { deleteSchema, editSchema } from '$lib/zod';
	import dayjs from 'dayjs';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';

	interface Props {
		editFormData: SuperValidated<Infer<typeof editSchema>>;
		deleteFormData: SuperValidated<Infer<typeof deleteSchema>>;
		event: typeof eventsTable.$inferSelect;
	}

	let { editFormData, deleteFormData, event }: Props = $props();

	let editModal: HTMLDialogElement = $state() as HTMLDialogElement;
	let deleteModal: HTMLDialogElement = $state() as HTMLDialogElement;

	const spaces = spaceEnum.enumValues;

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

	const { enhance: deleteEnhance, form: deleteForm } = superForm(deleteFormData, {
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

<div class="flex w-full flex-row justify-between gap-4 rounded-box bg-base-200 p-8">
	<div>
		<h1 class="mb-2 text-2xl font-bold text-primary md:text-3xl">{event.content}</h1>
		<div class="text-md md:text-base">
			<p>{date.format('D MMMM YYYY, HH:mm')}</p>
			<p class="font-medium text-secondary">{event.space}</p>
		</div>
	</div>
	<div class="flex gap-2">
		<button class="btn btn-circle my-auto" onclick={() => editModal.showModal()}>
			<i class="iconoir-edit-pencil before:text-2xl"></i>
		</button>
		<button class="btn btn-circle my-auto" onclick={() => deleteModal.showModal()}>
			<i class="iconoir-check-circle before:text-2xl"></i>
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
					<select name="space" bind:value={$editForm.space} class="select select-bordered">
						<option disabled selected>Select a Space</option>
						{#each spaces as space}
							<option class="option" value={space}>{space}</option>
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
			<p
				class="mt-8 hidden select-none text-center font-mono text-xs text-base-content/75 md:block"
			>
				press <kbd class="kbd">esc</kbd> or click outside to cancel
			</p>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	<dialog class="modal" id={`delete-modal-${event.id}`}>
		<div class="modal-box">
			<h2 class="text-xl font-bold">Complete or Delete Event?</h2>
			<p class="pt-6">Completing will delete the event forever!</p>
			<div class="modal-action">
				<form method="POST" action="/?/delete" use:deleteEnhance class="flex gap-2">
					<select name="action" id="action" bind:value={$deleteForm.action} class="select">
						<option value="complete">Complete</option>
						<option value="delete">Delete</option>
					</select>
					<button class={cn('btn', $deleteForm.action === 'delete' ? 'btn-error' : 'btn-success')}
						>Yes</button
					>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
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
