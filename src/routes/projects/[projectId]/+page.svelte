<script lang="ts">
	import { enhance } from '$app/forms';
	import Event from '$lib/components/Event.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { cn } from '$lib/utils.js';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { dateProxy, superForm } from 'sveltekit-superforms';

	dayjs.extend(relativeTime);

	let { data } = $props();

	let editModal = $state() as HTMLDialogElement;

	$effect(() => {
		editModal = document.getElementById('editModal') as HTMLDialogElement;
	});

	const {
		form: editForm,
		enhance: editEnhance,
		constraints: editConstraints,
		delayed: editDelayed
	} = superForm(data.projectEditForm, {
		onSubmit: ({ formData }) => {
			formData.set('projectId', data.project.id.toString());
		},
		onUpdated: ({}) => {
			editModal.close();
		},
		invalidateAll: true
	});

	const { enhance: deleteEnhance, delayed: deleteDelayed } = superForm(data.projectDeleteForm, {
		onSubmit: ({ formData }) => {
			formData.set('projectId', data.project.id.toString());
		},
		invalidateAll: true
	});

	const {
		enhance: toggleEnhance,
		delayed: toggleDelayed,
		form: toggleForm
	} = superForm(data.toggleForm, {
		onSubmit: ({ formData }) => {
			formData.set('projectId', data.project.id.toString());
		},
		invalidateAll: true
	});

	const dateInput = dateProxy(editForm, 'deadline', { format: 'date' });

	let deleteConfirmation = $state('');
</script>

<svelte:head>
	<title>Project - {data.project.name}</title>
</svelte:head>

<div class="mx-auto w-full md:max-w-2xl">
	<section class="text-center">
		<h1 class="mb-12 text-4xl font-bold md:text-6xl">{data.project.name}</h1>
	</section>
	<div class="flex flex-col">
		<div class="flex max-md:flex-col max-md:gap-4 md:justify-between">
			<div>
				<h1 class="heading-sub text-muted">Project details</h1>
				<ul>
					<li>
						<span class="font-medium">Deadline:</span>
						<span class="text-muted"
							>{#if data.project.deadline}
								{dayjs().to(dayjs(data.project.deadline))} ({dayjs(data.project.deadline).format(
									'D MMMM YYYY'
								)})
							{:else}
								No deadline
							{/if}
						</span>
					</li>
					<li>
						<span class="font-medium">Status:</span>
						<span
							class={cn(
								data.project.status === 'active'
									? 'text-success'
									: data.project.status === 'archived'
										? 'text-secondary'
										: 'text-muted'
							)}>{data.project.status}</span
						>
					</li>
				</ul>
			</div>
			<div>
				<button class="btn btn-primary my-auto" onclick={() => editModal.showModal()}
					>Edit Project</button
				>
			</div>
		</div>
		<div>
			{#if data.events.length != 0}
				<section class="mt-4 flex flex-col items-center gap-4">
					<h3 class="heading-muted mb-4">Due events ({data.events.length})</h3>
					{#each data.events as event}
						<Event
							{event}
							projects={data.userProjects}
							editFormData={data.editForm}
							toggleFormData={data.toggleForm}
						/>
					{/each}
				</section>
			{/if}
			{#if data.completedEvents.length != 0}
				<section class="mt-4 flex flex-col items-center gap-4">
					<h3 class="heading-small mb-4 text-success">
						Completed events ({data.completedEvents.length})
					</h3>
					{#each data.completedEvents as event}
						<Event
							{event}
							projects={data.userProjects}
							editFormData={data.editForm}
							toggleFormData={data.toggleForm}
						/>
					{/each}
				</section>
			{/if}
			{#if data.completedEvents.length === 0 && data.events.length === 0}
				<h2 class="heading-small mt-8 text-center italic">No events in this project</h2>
			{/if}
		</div>
	</div>
</div>

<dialog id="editModal" class="modal">
	<div class="modal-box">
		<h1 class="heading-main">Edit Project</h1>
		<form action="?/edit" method="post" class="flex flex-col gap-4" use:editEnhance>
			<div class="flex flex-col gap-2">
				<label for="name">Name</label>
				<input
					type="text"
					class="input input-primary"
					name="name"
					{...$editConstraints.name}
					bind:value={$editForm.name}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label for="deadline">Deadline</label>
				<input
					type="date"
					class="input input-primary"
					name="deadline"
					{...$editConstraints.deadline}
					bind:value={$dateInput}
				/>
			</div>
			<button disabled={!$editForm.deadline && !$editForm.name} class="btn btn-primary"
				>Edit {#if $editDelayed}
					<Spinner />
				{/if}</button
			>
		</form>
		<form action="?/delete" class="mt-4" use:deleteEnhance method="post">
			<h1 class="heading-small mb-4 text-error">Delete project?</h1>
			<div class="flex flex-col gap-2">
				<label for="confirmation"
					>Type <span class="font-mono italic">delete my project</span> below</label
				>
				<input
					id="confirmation"
					type="text"
					bind:value={deleteConfirmation}
					class="input input-error"
				/>
				<button disabled={deleteConfirmation != 'delete my project'} class="btn btn-error"
					>Delete {#if $deleteDelayed}
						<Spinner />
					{/if}</button
				>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<form
	action="?/action"
	id="actionForm"
	use:enhance={({ formData }) => {
		formData.set('projectId', data.project.id.toString());
	}}
	method="post"
></form>

<style>
	input::-webkit-calendar-picker-indicator {
		display: none;
	}

	input[type='date']::-webkit-input-placeholder {
		visibility: hidden !important;
	}
</style>
