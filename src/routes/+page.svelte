<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';

	let { data } = $props();

	let rateLimited = $state(false);

	const { form, delayed, enhance, constraints } = superForm(data.createForm, {
		onResult({ result }) {
			if (result.status === 429) rateLimited = true;
		},
		invalidateAll: true
	});

	const user = data.user;
</script>

<svelte:head>
	<title>Zenith - Today</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h3 class="heading-small">
		Hi, <span class="font-bold text-primary">{user.username}</span>
	</h3>
	<h1 class="heading-main text-center">What are your plans?</h1>
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
						<i class="fa-solid fa-spinner animate-spin text-lg"></i>
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
			<Loading text="events" />
		{:then events}
			{#if events.length == 0}
				<h2 class="heading-small italic">Nothing planned today.</h2>
			{/if}
			{#each events as event (event.id)}
				<Event
					projects={data.projects}
					{event}
					editFormData={data.editForm}
					toggleFormData={data.toggleForm}
				/>
			{/each}
		{:catch}
			<Error />
		{/await}
		<div class="mt-4 flex flex-col items-center justify-center gap-2 md:flex-row">
			<a href="/upcoming" class="link link-primary font-semibold italic">Upcoming</a>
			<span class="hidden md:block">•</span>
			<a href="/completed" class="link link-success font-semibold italic">Completed</a>
		</div>
	</section>
</div>
