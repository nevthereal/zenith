<script lang="ts">
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';

	export let data: PageServerData;

	const events = data.events;

	const { form, delayed, enhance, constraints } = superForm(data.createForm, {
		onUpdated({ form }) {
			if (form.valid) location.reload();
		},

		onError({ result }) {
			console.error('Something went wrong', result);
		}
	});

	const user = data.user;
</script>

<svelte:head>
	<title>Zenith</title>
	<meta name="description" content="AI-powered planning. No more annoying interfaces." />
	<meta property="og:title" content="Zenith" />
	<meta property="og:description" content="AI-powered planning. No more annoying interfaces." />
	<meta property="og:url" content="https://www.Zenith.xyz" />
	<meta
		property="twitter:description"
		content="AI-powered planning. No more annoying interfaces."
	/>
	<meta property="twitter:title" content="Zenith" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@BremNeville" />
</svelte:head>

<div class="flex flex-col items-center">
	<h3 class="text-xl font-medium">
		Hi, <span class="font-bold text-primary">{user.username}</span>
	</h3>
	<h1 class="mb-8 text-5xl font-bold">What are your plans?</h1>
	<form action="?/create" method="POST" class="mb-12 flex items-center gap-4" use:enhance>
		<input
			class="input input-bordered input-primary border-2"
			type="text"
			placeholder="Event or Task"
			name="event"
			bind:value={$form.event}
			{...$constraints.event}
		/>
		<button class="btn btn-primary"
			>Add!
			{#if $delayed}
				<span class="loading loading-spinner loading-xs"></span>
			{/if}
		</button>
	</form>

	<section class="flex flex-col items-center gap-4">
		{#await events}
			<div
				class="flex select-none flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]"
			>
				<div>
					<h1 class="skeleton mb-2 text-2xl font-bold text-primary text-transparent">
						This is actually loading
					</h1>
					<p class="skeleton text-primary text-transparent">Here could be a date</p>
				</div>
				<div class="flex gap-2">
					<div class="skeleton my-auto h-12 w-12 shrink-0 rounded-full"></div>
					<div class="skeleton my-auto h-12 w-12 shrink-0 rounded-full"></div>
				</div>
			</div>
		{:then events}
			{#if events.length == 0}
				<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
			{/if}
			{#each events as event}
				<Event {event} data={data.editForm} />
			{/each}
		{/await}
		<a href="/upcoming" class="link link-primary font-semibold italic">View all upcoming</a>
	</section>
</div>
