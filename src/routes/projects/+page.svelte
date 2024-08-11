<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Error from '../+error.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>All Projects</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="heading-main">All Projects</h1>
	<section
		class="m-4 mb-12 grid w-full max-w-[70vw] grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
	>
		<a
			href="/projects/create"
			class="card flex h-48 place-content-center place-items-center bg-base-200"
		>
			<i
				class="fa-solid fa-plus mb-2 flex aspect-square items-center justify-center rounded-full border-2 border-base-content p-1 text-base-content"
			></i>
			<p class="text-xl font-medium">Create a space</p>
		</a>
		{#await data.myProjects}
			<div class="flex items-center justify-center">
				<Loading text="project" />
			</div>
		{:then projects}
			{#if projects.length === 0}
				<div class="flex items-center justify-center">
					<p>No projects</p>
				</div>
			{:else}
				{#each projects as project}
					<ProjectCard
						id={project.id}
						collaborators={project.collaborators}
						name={project.name}
						deadline={project.deadline}
					/>
				{/each}
			{/if}
		{:catch}
			<Error />
		{/await}
	</section>
</div>
