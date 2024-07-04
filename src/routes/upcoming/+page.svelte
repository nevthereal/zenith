<script lang="ts">
	import Event from '$lib/components/Event.svelte';

	let { data } = $props();

	let events = $derived(data.events);
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-8 text-5xl font-bold">Upcoming events:</h1>
	<section class="flex flex-col items-center gap-4">
		{#if events.length === 0}
			<h2 class="text-xl font-semibold italic">Nothing upcoming.</h2>
		{:else}
			{#each events as event}
				<Event data={data.editForm} {event} />
			{/each}
		{/if}
	</section>
</div>
