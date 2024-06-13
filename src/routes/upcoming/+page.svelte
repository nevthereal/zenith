<script lang="ts">
	import Event from '$lib/components/Event.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const events = data.events;
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-8 text-5xl font-bold">Upcoming events:</h1>
	<section class="flex flex-col items-center gap-4">
		{#if events.length > 0}
			<h2 class="text-xl font-semibold italic">Up today:</h2>
		{:else}
			<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
		{/if}
		{#each events as event}
			<Event {event} />
		{/each}
		<a href="/upcoming" class="link link-primary font-semibold italic">View all upcoming</a>
	</section>
</div>
