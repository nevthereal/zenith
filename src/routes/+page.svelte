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
		{#if events.length > 0}
			<h2 class="text-xl font-semibold italic">Up today:</h2>
		{:else}
			<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
		{/if}
		{#each events as event}
			<Event {event} data={data.editForm} />
		{/each}
		<a href="/upcoming" class="link link-primary font-semibold italic">View all upcoming</a>
	</section>
</div>
