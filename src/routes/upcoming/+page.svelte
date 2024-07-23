<script lang="ts">
	import Event from '$lib/components/Event.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Upcoming</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="text-center text-3xl font-bold md:text-5xl">Upcoming</h1>
	<section class="mt-4 flex w-full max-w-2xl flex-col items-center gap-4 md:mt-8">
		{#await data.events}
			<span class="font-mono">Loading events...</span>
		{:then events}
			{#if events.length === 0}
				<h2 class="font-semibold italic md:text-xl">Nothing upcoming.</h2>
			{:else}
				{#each events as event (event.id)}
					<Event toggleFormData={data.toggleForm} editFormData={data.editForm} {event} />
				{/each}
			{/if}
		{:catch}
			<span class="font-mono text-error">Something went wrong. Try again later</span>
		{/await}
	</section>
</div>
