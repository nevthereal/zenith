<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { eventsTable, projectsTable } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	import type { zToggleEvent, zEditEvent } from '$lib/zod';
	import dayjs from 'dayjs';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';

	type Event = typeof eventsTable.$inferSelect;
	type Project = typeof projectsTable.$inferSelect;

	interface EventWithProject extends Event {
		project: Project | null;
	}

	interface Props {
		editFormData: SuperValidated<Infer<typeof zEditEvent>>;
		toggleFormData: SuperValidated<Infer<typeof zToggleEvent>>;
		event: EventWithProject;
		projects: {
			id: number;
			name: string;
		}[];
	}

	let { editFormData, toggleFormData, event, projects }: Props = $props();

	let editModal: HTMLDialogElement = $state() as HTMLDialogElement;
	let toggleModal: HTMLDialogElement = $state() as HTMLDialogElement;

	$effect(() => {
		editModal = document.getElementById(`edit-modal-${event.id}`) as HTMLDialogElement;
		toggleModal = document.getElementById(`toggle-modal-${event.id}`) as HTMLDialogElement;
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

	const { enhance: toggleEnhance, form: toggleForm } = superForm(toggleFormData, {
		onSubmit({ formData }) {
			formData.set('id', event.id.toString());
			toggleModal.close();
		},
		onUpdated() {
			invalidate('fetch:events');
		},
		id: `toggleForm-${event.id}`
	});

	const date = $derived(dayjs(event.date));
	const dateInput = dateProxy(editForm, 'date', { format: 'datetime-local' });

	$editForm.event = event.content;
	$dateInput = dayjs(event.date).format('YYYY-MM-DDTHH:mm:ss.SSS');
	if (event.projectId) {
		$editForm.projectId = event.projectId;
	} else {
		$editForm.projectId = 0;
	}
</script>

<div class="flex w-full flex-row justify-between gap-4 rounded-box bg-base-200 p-8">
	<div>
		<h1 class="mb-2 text-2xl font-bold text-primary md:text-3xl">{event.content}</h1>
		<div class="text-md md:text-base">
			<p>
				{date.format('D MMMM YYYY, HH:mm')}
				{#if event.project}
					• <span class="text-secondary">{event.project.name}</span>
				{/if}
			</p>
		</div>
	</div>
	<div class="flex md:gap-2">
		<button class="btn btn-circle my-auto" onclick={() => editModal.showModal()}>
			<i class="fa-solid fa-pencil text-lg md:text-xl"></i>
		</button>
		<button class="btn btn-circle my-auto" onclick={() => toggleModal.showModal()}>
			<i class="fa-regular fa-circle-check text-lg md:text-xl"></i>
		</button>
	</div>
	<dialog id={`edit-modal-${event.id}`} class="modal">
		<div class="modal-box">
			<h1 class="mb-4 text-xl font-medium">Edit Event</h1>
			<form method="POST" action="/?/edit" use:editEnhance class="flex flex-col gap-4">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="flex flex-col">
						<label for="event" class="mb-2 text-sm text-base-content/80">Event name</label>
						<input
							{...$editConstraints.event}
							bind:value={$editForm.event}
							type="text"
							name="event"
							placeholder="What?"
							class="input input-bordered"
						/>
					</div>
					<div class="flex flex-col">
						<label for="date" class="mb-2 text-sm text-base-content/80">Date</label>
						<input
							{...$editConstraints.date}
							bind:value={$dateInput}
							name="date"
							type="datetime-local"
							placeholder="When?"
							class="input input-bordered"
						/>
					</div>
					<div class="flex flex-col md:col-span-2">
						<label for="project" class="mb-2 text-sm text-base-content/80">Project</label>
						<select
							name="projectId"
							class="select select-bordered"
							bind:value={$editForm.projectId}
						>
							<option value={0} disabled>Select a project</option>
							{#each projects as project}
								<option value={project.id}>{project.name}</option>
							{/each}
						</select>
					</div>
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
	<dialog class="modal" id={`toggle-modal-${event.id}`}>
		<div class="modal-box">
			<h2 class="text-xl font-bold">Complete or Delete Event?</h2>
			<p class="pt-6">
				Either of these actions will delete the event <span class="font-medium text-error"
					>forever</span
				>
			</p>
			<div class="modal-action">
				<form method="POST" action="/?/toggle" use:toggleEnhance class="flex gap-2">
					<select name="action" id="action" bind:value={$toggleForm.action} class="select">
						<option value="complete">Complete</option>
						<option value="delete">Delete</option>
					</select>
					<button class={cn('btn', $toggleForm.action === 'delete' ? 'btn-error' : 'btn-success')}
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
