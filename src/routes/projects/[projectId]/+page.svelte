<script lang="ts">
	import Event from '$lib/components/Event.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.project.name}</title>
</svelte:head>

<div class="mx-auto w-full md:max-w-2xl">
	<section class="text-center">
		<h3 class="text-muted mb-2 text-lg md:text-xl">Project overview</h3>
		<h1 class="mb-4 text-4xl font-bold md:text-6xl">{data.project.name}</h1>
	</section>
	<section class="my-12 flex flex-col items-center">
		<h3 class="text-muted mb-2 text-lg md:text-xl">Project overview</h3>
		{#each data.project.events as event}
			<Event
				{event}
				projects={data.userProjects}
				editFormData={data.editForm}
				toggleFormData={data.toggleForm}
			/>
		{/each}
	</section>
</div>
