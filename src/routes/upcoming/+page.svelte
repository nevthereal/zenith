<script lang="ts">
	import Event from '$lib/components/Event.svelte';

	let { data } = $props();

	let events = $derived(data.events);
</script>

<svelte:head>
	<title>Upcoming</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="text-center text-3xl font-bold md:text-5xl">Upcoming</h1>
	<section class="mt-4 flex w-full max-w-2xl flex-col items-center gap-4 md:mt-8">
		{#if events.length === 0}
			<h2 class="font-semibold italic md:text-xl">Nothing upcoming.</h2>
		{:else}
			{#each events as event (event.id)}
				<Event deleteFormData={data.deleteForm} editFormData={data.editForm} {event} />
			{/each}
		{/if}
	</section>
</div>
