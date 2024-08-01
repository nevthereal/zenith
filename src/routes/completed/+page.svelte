<script lang="ts">
	import Error from '$lib/components/Error.svelte';
	import Event from '$lib/components/Event.svelte';
	import Loading from '$lib/components/Loading.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Completed Events</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="heading-main text-center">Completed Events</h1>
	<section class="mt-4 flex w-full max-w-2xl flex-col items-center gap-4 md:mt-8">
		{#await data.events}
			<Loading text="events" />
		{:then events}
			{#if events.length === 0}
				<h2 class="heading-small italic">No completed events.</h2>
			{:else}
				{#each events as event (event.id)}
					<Event
						projects={data.projects}
						{event}
						editFormData={data.editForm}
						toggleFormData={data.toggleForm}
					/>
				{/each}
			{/if}
		{:catch}
			<Error />
		{/await}
	</section>
</div>
