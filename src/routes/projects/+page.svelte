<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectCardLoading from '$lib/components/ProjectCardLoading.svelte';
	import Error from '$lib/components/Error.svelte';
	import { getProjects } from '$lib/remote/projects.remote';

	let { data } = $props();
	const user = $derived(data.user!);
	const myProjects = getProjects();
	const userLocale = $derived(user.locale);
	const userTimeZone = $derived(user.timeZone);
</script>

<svelte:head>
	<title>All Projects</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="heading-main mb-8">All Projects</h1>
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
		<svelte:boundary>
			{@const projects = await myProjects}
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
						locale={userLocale}
						timeZone={userTimeZone}
					/>
				{/each}
			{/if}

			{#snippet pending()}
				<ProjectCardLoading />
			{/snippet}

			{#snippet failed(_error, reset)}
				<div class="col-span-full flex flex-col items-center gap-3">
					<Error />
					<button class="btn btn-outline btn-sm" onclick={reset}>Retry</button>
				</div>
			{/snippet}
		</svelte:boundary>
	</section>
</div>
