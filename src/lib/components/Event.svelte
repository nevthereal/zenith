<script lang="ts">
	import type { eventsTable } from '$lib/db/schema';
	import type { EditSchema } from '$lib/schemas';
	import dayjs from 'dayjs';
	import { Check, Pencil, Trash, X } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	export let event: typeof eventsTable.$inferSelect;
	export let data: SuperValidated<Infer<EditSchema>>;

	const { form, enhance, constraints, delayed } = superForm(data, {
		onResult() {
			location.reload();
		}
	});

	let edit = false;

	const toggleEdit = () => {
		edit = !edit;
	};

	const deleteEvent = async () => {
		if (confirm(`Do you want to delete "${event.content}"`)) {
			await fetch(`/api/delete-event?id=${event.id}`, { method: 'DELETE' });
			location.reload();
		}
	};

	const date = dayjs(event.date);

	$form.event = event.content;
	$form.id = event.id;
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	{#if !edit}
		<div>
			<h1 class="text-2xl font-bold text-primary">{event.content}</h1>
			<p class={date.isBefore(dayjs()) ? 'text-error' : ''}>
				{date.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
			</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-circle my-auto" on:click={toggleEdit}>
				<Pencil stroke-width={2} />
			</button>
			<button class="btn btn-circle my-auto" on:click={deleteEvent}>
				<Trash stroke-width={2} />
			</button>
		</div>
	{:else}
		<form method="POST" action="?/edit" use:enhance class="flex w-full justify-between gap-2">
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
				type="text"
				placeholder="When?"
				class="input w-full"
			/>
			<input type="text" name="id" class="hidden" bind:value={$form.id} />
			<div class="flex">
				<button on:click={toggleEdit} class="btn btn-circle my-auto">
					<X />
				</button>
				<button class="btn btn-circle my-auto">
					{#if !$delayed}
						<Check />
					{:else}
						<span class="loading loading-spinner loading-xs"></span>
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>

<style>
	input::-webkit-calendar-picker-indicator {
		display: none;
	}

	input[type='date']::-webkit-input-placeholder {
		visibility: hidden !important;
	}
</style>
