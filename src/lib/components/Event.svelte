<script lang="ts">
	import { eventsTable, projectsTable } from '$lib/db/schema';
	import { alphabet, cn, random } from '$lib/utils';
	import type { zToggleEvent, zEditEvent } from '$lib/zod';
	import dayjs from 'dayjs';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';
	import Spinner from './Spinner.svelte';
	import Label from './Label.svelte';
	import { generateRandomString } from '@oslojs/crypto/random';

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
		delayed: editDelayed,
		allErrors
	} = superForm(editFormData, {
		onResult({ result }) {
			if (result.type === 'success') editModal.close();
		},
		invalidateAll: true,
		id: `editForm-${generateRandomString(random, alphabet, 5)}`
	});

	const { enhance: toggleEnhance, form: toggleForm } = superForm(toggleFormData, {
		onResult({ result }) {
			if (result.type === 'success') editModal.close();
		},
		invalidateAll: true,
		id: `toggleForm-${generateRandomString(random, alphabet, 5)}`
	});

	const date = $derived(dayjs(event.date));
	const dateInput = dateProxy(editForm, 'date', { format: 'datetime-local' });

	$editForm.event = event.content;
	$editForm.id = event.id;
	$dateInput = dayjs(event.date).format('YYYY-MM-DDTHH:mm:ss.SSS');
	if (event.projectId) {
		$editForm.projectId = event.projectId;
	} else {
		$editForm.projectId = 0;
	}
	$toggleForm.action = event.completed ? 'uncomplete' : 'complete';
	$toggleForm.id = event.id;
</script>

<div class="flex w-full flex-row justify-between gap-4 rounded-box bg-base-200 p-8">
	<div>
		<h1 class={cn('heading-sub mb-2', !event.completed ? 'text-primary' : 'text-success')}>
			{event.content}
		</h1>
		<div class="text-md md:text-base">
			<p>
				<span class={cn(date.isBefore(dayjs().startOf('day')) && !event.completed && 'text-error')}>
					{date.format('D MMMM YYYY, HH:mm')}
				</span>
				{#if event.project}
					<a href={`/projects/${event.project.id}`} class="text-secondary"
						><i class="fa-solid fa-arrow-right max-md:hidden"></i>
						<span class="whitespace-nowrap">{event.project.name}</span></a
					>
				{/if}
			</p>
		</div>
	</div>
	<div class="flex md:gap-2">
		<button
			class="btn btn-circle my-auto"
			aria-label="Edit Project"
			onclick={() => editModal.showModal()}
		>
			<i class="fa-solid fa-pencil text-lg md:text-xl"></i>
		</button>
		<button
			class="btn btn-circle my-auto"
			aria-label="Delete or Complete Project"
			onclick={() => toggleModal.showModal()}
		>
			<i class="fa-regular fa-circle-check text-lg md:text-xl"></i>
		</button>
	</div>
	<dialog id={`edit-modal-${event.id}`} class="modal">
		<div class="modal-box">
			<h1 class="mb-4 text-xl font-medium">Edit Event</h1>
			<form method="POST" action="/?/edit" use:editEnhance class="flex flex-col gap-4">
				<input type="hidden" name="id" bind:value={$editForm.id} />
				<div class="grid gap-4 md:grid-cols-2">
					<div class="flex flex-col">
						<Label forAttr="event">Event name</Label>
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
						<Label forAttr="date">Date</Label>
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
						<Label forAttr="project">Project</Label>
						<select
							name="projectId"
							class="select select-bordered"
							bind:value={$editForm.projectId}
						>
							<option value={0}>No project</option>
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
							<Spinner />
						{/if}
					</button>
				</div>
			</form>
			<p
				class="mt-8 hidden select-none text-center font-mono text-xs text-base-content/75 md:block"
			>
				{#if $allErrors.length != 0}
					{#each $allErrors as err}
						<span class="mt-2 text-error">{err.messages}</span>
					{/each}
				{:else}
					<span>press <kbd class="kbd">esc</kbd> or click outside to cancel</span>
				{/if}
			</p>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	<dialog class="modal" id={`toggle-modal-${event.id}`}>
		<div class="modal-box">
			<h2 class="text-xl font-bold">Complete or Delete Event?</h2>
			<div class="modal-action">
				<form method="POST" action="/?/toggle" use:toggleEnhance class="flex gap-2">
					<select name="action" id="action" bind:value={$toggleForm.action} class="select">
						<option value={event.completed ? 'uncomplete' : 'complete'}
							>{event.completed ? 'Uncomplete' : 'Complete'}</option
						>
						<option value="delete">Delete</option>
					</select>
					<input type="hidden" name="id" bind:value={$toggleForm.id} />
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
