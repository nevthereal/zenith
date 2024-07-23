<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import { invalidate } from '$app/navigation';

	let { data } = $props();

	let rateLimited = $state(false);

	const { form, delayed, enhance, constraints } = superForm(data.createForm, {
		onUpdated({ form }) {
			if (form.valid) invalidate('fetch:events');
		},
		onResult({ result }) {
			if (result.status === 429) rateLimited = true;
		}
	});

	const user = data.user;
</script>

<svelte:head>
	<title>Zenith - Today</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h3 class="text-lg font-medium md:text-xl">
		Hi, <span class="font-bold text-primary">{user.username}</span>
	</h3>
	<h1 class="text-center text-3xl font-bold md:text-5xl">What are your plans?</h1>
	{#if user.paid}
		<form action="?/create" method="POST" class="my-12 flex flex-col" use:enhance>
			<div class="flex items-center justify-center gap-4">
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
			</div>
			{#if rateLimited}
				<span class="mt-2 text-error">Too many requests. Try again later</span>
			{/if}
		</form>
	{:else}
		<div class="my-6">
			<form action="/?/purchase" method="post">
				<button
					class="btn btn-warning tooltip tooltip-top"
					data-tip="Purchase the product to continue"
					>Purchase ($20)
				</button>
			</form>
		</div>
	{/if}

	<section class="mb-8 flex w-full max-w-2xl flex-col items-center gap-4">
		{#await data.events}
			<span class="font-mono">Loading events...</span>
		{:then events}
			{#if events.length == 0}
				<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
			{/if}
			{#each events as event (event.id)}
				<Event {event} editFormData={data.editForm} deleteFormData={data.deleteForm} />
			{/each}
		{:catch}
			<span class="font-mono text-error">Something went wrong. Try again later</span>
		{/await}
		<a href="/spaces" class="link link-primary mt-4 font-semibold italic">View all spaces</a>
	</section>
</div>
