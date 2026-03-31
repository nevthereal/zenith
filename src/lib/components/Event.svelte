<script lang="ts">
	import { eventsTable, projectsTable } from '$lib/db/schema';
	import { dayjs } from '$lib/datetime';
	import { editEvent, toggleEvent } from '$lib/remote/events.remote';
	import * as Field from '$lib/components/ui/field/index.js';
	import { cn, prettyDate } from '$lib/utils';
	import { zEditEventForm, zToggleEventForm } from '$lib/zod';
	import Spinner from './Spinner.svelte';

	type Event = typeof eventsTable.$inferSelect;
	type Project = typeof projectsTable.$inferSelect;

	interface EventWithProject extends Event {
		project: Project | null;
	}

	interface Props {
		event: EventWithProject;
		projects: {
			id: number;
			name: string;
		}[];
		locale?: string | null;
		timeZone?: string | null;
	}

	let { event, projects, locale, timeZone }: Props = $props();
	const eventId = event.id;

	let editModal: HTMLDialogElement;
	let toggleModal: HTMLDialogElement;
	const eventDate = $derived(timeZone ? dayjs(event.date).tz(timeZone) : dayjs(event.date));
	const editEventForm = editEvent.for(eventId).preflight(zEditEventForm);
	const toggleEventForm = toggleEvent.for(eventId).preflight(zToggleEventForm);
	const enhancedEditEventForm = editEventForm.enhance(async ({ submit }) => {
		await submit();

		if (!editEventForm.fields.allIssues()?.length) {
			editModal.close();
		}
	});
	const enhancedToggleEventForm = toggleEventForm.enhance(async ({ submit }) => {
		await submit();

		if (!toggleEventForm.fields.allIssues()?.length) {
			toggleModal.close();
		}
	});

	function eventDateInputValue(date: Date) {
		return (timeZone ? dayjs(date).tz(timeZone) : dayjs(date)).format('YYYY-MM-DDTHH:mm');
	}

	function openEditModal() {
		editEventForm.fields.set({
			id: eventId,
			event: event.content,
			date: eventDateInputValue(event.date),
			projectId: event.projectId ? String(event.projectId) : '0'
		});
		editModal.showModal();
	}

	function openToggleModal() {
		toggleEventForm.fields.set({
			id: eventId,
			action: event.completed ? 'uncomplete' : 'complete'
		});
		toggleModal.showModal();
	}
</script>

<div
	class="motion-preset-fade-md flex w-full flex-row justify-between gap-4 rounded-box bg-base-200 p-8"
>
	<div>
		<h1 class={cn('heading-sub mb-2', !event.completed ? 'text-primary' : 'text-success')}>
			{event.content}
		</h1>
		<div class="text-md md:text-base">
			<p>
					<span
						class={cn(
							eventDate.isBefore(
								timeZone ? dayjs().tz(timeZone).startOf('day') : dayjs().startOf('day')
							) && !event.completed && 'text-error'
						)}
					>
						{prettyDate(event.date, { locale, timeZone })}
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
		<button class="btn btn-circle my-auto" aria-label="Edit Project" onclick={openEditModal}>
			<i class="fa-solid fa-pencil text-lg md:text-xl"></i>
		</button>
		<button class="btn btn-circle my-auto" aria-label="Delete or Complete Project" onclick={openToggleModal}>
			<i class="fa-regular fa-circle-check text-lg md:text-xl"></i>
		</button>
	</div>
	<dialog id={`edit-modal-${event.id}`} bind:this={editModal} class="modal">
		<div class="modal-box">
			<h1 class="mb-4 text-xl font-medium">Edit Event</h1>
			<form {...enhancedEditEventForm} class="flex flex-col gap-4">
				<div class="grid gap-4 md:grid-cols-2">
					<Field.Field data-invalid={editEventForm.fields.event.issues()?.length ? true : undefined}>
						<Field.Label for={`event-name-${event.id}`}>Event name</Field.Label>
						<input
							id={`event-name-${event.id}`}
							placeholder="What?"
							class={cn(
								'input input-bordered w-full',
								editEventForm.fields.event.issues()?.length && 'input-error'
							)}
							{...editEventForm.fields.event.as('text')}
						/>
						{#each editEventForm.fields.event.issues() ?? [] as issue (`event-name-${issue.message}`)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
					<Field.Field data-invalid={editEventForm.fields.date.issues()?.length ? true : undefined}>
						<Field.Label for={`event-date-${event.id}`}>Date</Field.Label>
						<input
							id={`event-date-${event.id}`}
							placeholder="When?"
							class={cn(
								'input input-bordered w-full',
								editEventForm.fields.date.issues()?.length && 'input-error'
							)}
							{...editEventForm.fields.date.as('datetime-local')}
						/>
						{#each editEventForm.fields.date.issues() ?? [] as issue (`event-date-${issue.message}`)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
					<Field.Field class="md:col-span-2">
						<Field.Label for={`event-project-${event.id}`}>Project</Field.Label>
						<select
							id={`event-project-${event.id}`}
							class="select select-bordered w-full"
							{...editEventForm.fields.projectId.as('select')}
						>
							<option value="0">No project</option>
							{#each projects as project}
								<option value={String(project.id)}>{project.name}</option>
							{/each}
						</select>
					</Field.Field>
				</div>
				{#each editEventForm.fields.allIssues() ?? [] as issue (`edit-event-${issue.path.join('.')}-${issue.message}`)}
					{#if issue.path.length === 0}
						<Field.Error>{issue.message}</Field.Error>
					{/if}
				{/each}
				<div class="flex">
					<button class="btn btn-primary mx-auto" type="submit" disabled={editEventForm.pending > 0}>
						Update
						{#if editEventForm.pending > 0}
							<Spinner />
						{/if}
					</button>
				</div>
			</form>
			<p
				class="mt-8 hidden select-none text-center font-mono text-xs text-base-content/75 md:block"
			>
				<span>press <kbd class="kbd">esc</kbd> or click outside to cancel</span>
			</p>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
	<dialog class="modal" bind:this={toggleModal} id={`toggle-modal-${event.id}`}>
		<div class="modal-box">
			<h2 class="text-xl font-bold">Complete or Delete Event?</h2>
			<div class="modal-action">
				<form {...enhancedToggleEventForm} class="flex w-full flex-col gap-3 md:flex-row">
					<select {...toggleEventForm.fields.action.as('select')} class="select w-full">
						<option value={event.completed ? 'uncomplete' : 'complete'}
							>{event.completed ? 'Uncomplete' : 'Complete'}</option
						>
						<option value="delete">Delete</option>
					</select>
					{#each toggleEventForm.fields.allIssues() ?? [] as issue (`toggle-${issue.path.join('.')}-${issue.message}`)}
						{#if issue.path.length === 0}
							<Field.Error>{issue.message}</Field.Error>
						{/if}
					{/each}
					<button
						disabled={toggleEventForm.pending > 0}
						class={cn(
							'btn',
							toggleEventForm.fields.action.value() === 'delete' ? 'btn-error' : 'btn-success'
						)}
					>
						Confirm
						{#if toggleEventForm.pending > 0}<Spinner />{/if}</button
					>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
