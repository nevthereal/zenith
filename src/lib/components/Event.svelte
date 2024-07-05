<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { eventsTable, tagEnum } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	import type { EditSchema } from '$lib/zod';
	import dayjs from 'dayjs';
	import { Pencil, Trash } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	interface Props {
		data: SuperValidated<Infer<EditSchema>>;
		event: typeof eventsTable.$inferSelect;
	}

	let { data, event }: Props = $props();

	let editModal: HTMLDialogElement;
	let deleteModal: HTMLDialogElement;

	const tags = tagEnum.enumValues;

	$effect(() => {
		editModal = document.getElementById(`edit-modal-${event.id}`) as HTMLDialogElement;
		deleteModal = document.getElementById(`delete-modal-${event.id}`) as HTMLDialogElement;
	});

	const { form, enhance, constraints, delayed } = superForm(data, {
		onResult() {
			invalidate('fetch:events');
			editModal.close();
		},
		id: `editForm-${event.id}`
	});
	const deleteEvent = async () => {
		await fetch(`/api/delete-event?id=${event.id}`, {
			method: 'DELETE'
		});
		deleteModal.close();
		invalidate('fetch:events');
	};

	const date = dayjs(event.date);

	$form.event = event.content;
	$form.date = dayjs(event.date).format('YYYY-MM-DDTHH:mm');

	$form.id = event.id;
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-3xl font-bold text-primary">{event.content}</h1>
		<p>
			<span class={cn(date.isBefore(dayjs()) && 'text-warning')}
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
			<form method="POST" action="?/edit" use:enhance class="flex flex-col gap-4">
				<input
					{...$constraints.event}
					bind:value={$form.event}
					type="text"
					name="event"
					placeholder="What?"
					class="input input-bordered w-full"
				/>
				<div class="grid grid-cols-2 gap-4">
					<input
						{...$constraints.date}
						bind:value={$form.date}
						name="date"
						type="datetime-local"
						placeholder="When?"
						class="input input-bordered w-full"
					/>
					<select name="tag" bind:value={$form.tag} class="select select-bordered">
						<option disabled selected>Select a Tag</option>
						{#each tags as tag}
							<option class="option" value={tag}>{tag}</option>
						{/each}
					</select>
				</div>
				<input type="text" name="id" class="hidden" bind:value={$form.id} />
				<div class="flex">
					<button class="btn btn-primary mx-auto" type="submit">
						Update
						{#if $delayed}
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
