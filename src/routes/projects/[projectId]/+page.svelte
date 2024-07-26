<script lang="ts">
	import Event from '$lib/components/Event.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.project.name}</title>
</svelte:head>

<div class="mx-auto w-full md:max-w-2xl">
	<section class="text-center">
		<h3 class="heading-muted">Project overview</h3>
		<h1 class="mb-4 text-4xl font-bold md:text-6xl">{data.project.name}</h1>
	</section>
	{#if data.events.length != 0}
		<section class="mt-12 flex flex-col items-center">
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
		<section class="mt-4 flex flex-col items-center">
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
		<h2 class="heading-small text-center italic">No events in this project</h2>
	{/if}
</div>
