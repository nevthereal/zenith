<script lang="ts">
	import Event from '$lib/components/Event.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';

	dayjs.extend(relativeTime);

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.project.name}</title>
</svelte:head>

<div class="mx-auto w-full md:max-w-2xl">
	<section class="text-center">
		<h1 class="mb-12 text-4xl font-bold md:text-6xl">{data.project.name}</h1>
	</section>
	<div class="flex flex-col">
		<div class="flex max-md:flex-col md:justify-between">
			<div>
				<h1 class="heading-sub text-muted">Project details</h1>
				<ul>
					<li class="flex gap-1">
						<span class="font-medium">Deadline:</span>
						<span class="text-muted"
							>{#if data.project.deadline}
								{dayjs().to(dayjs(data.project.deadline))}
							{:else}
								No deadline
							{/if}
						</span>
					</li>
				</ul>
			</div>
			<button class="btn btn-primary my-auto">Edit Project</button>
		</div>
		<div>
			{#if data.events.length != 0}
				<section class="mt-4 flex flex-col items-center gap-4">
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
				<section class="mt-4 flex flex-col items-center gap-4">
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
				<h2 class="heading-small mt-8 text-center italic">No events in this project</h2>
			{/if}
		</div>
	</div>
</div>
