<script lang="ts">
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';

	export let data: PageServerData;

	const events = data.events;

	const { form, delayed, enhance, constraints } = superForm(data.createForm, {
		onResult() {
			location.reload();
		},

		onError({ result }) {
			console.error('Something went wrong', result);
		}
	});
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-8 text-5xl font-bold">What are your plans?</h1>
	<form action="?/create" method="POST" class="mb-12 flex items-center gap-4" use:enhance>
		<input
			class="input input-bordered input-primary border-2"
			type="text"
			placeholder="Event or Task"
			name="event"
			bind:value={$form.event}
			{...$constraints.event}
		/>
		<button class="btn btn-primary"
			>Add!
			{#if $delayed}
				<span class="loading loading-spinner loading-xs"></span>
			{/if}
		</button>
	</form>

	<section class="flex flex-col items-center gap-4">
		{#await events}
			<div
				class="flex select-none flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]"
			>
				<div>
					<h1 class="skeleton mb-2 text-2xl font-bold text-primary text-transparent">
						This is actually loading
					</h1>
					<p class="skeleton text-primary text-transparent">Here could be a date</p>
				</div>
				<div class="flex gap-2">
					<div class="skeleton my-auto h-12 w-12 shrink-0 rounded-full"></div>
					<div class="skeleton my-auto h-12 w-12 shrink-0 rounded-full"></div>
				</div>
			</div>
		{:then events}
			{#if events.length == 0}
				<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
			{/if}
			{#each events as event}
				<Event {event} data={data.editForm} />
			{/each}
		{/await}
		<a href="/upcoming" class="link link-primary font-semibold italic">View all upcoming</a>
	</section>
</div>
