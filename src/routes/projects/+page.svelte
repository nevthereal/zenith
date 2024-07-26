<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

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
			class="card flex h-48 flex-col items-center justify-center bg-base-200"
		>
			<i
				class="fa-solid fa-plus mb-2 flex aspect-square items-center justify-center rounded-full border-2 border-base-content p-1 text-base-content"
			></i>
			<p class="text-xl font-medium">Create a space</p>
		</a>
		{#each data.myProjects as project}
			<ProjectCard
				id={project.id}
				collaborators={project.collaborators}
				name={project.name}
				deadline={project.deadline}
			/>
		{/each}
	</section>
</div>
