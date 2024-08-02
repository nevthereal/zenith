<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let { data } = $props();

	let rateLimited = $state(false);

	const { form, delayed, enhance, constraints } = superForm(data.createForm, {
		onResult({ result }) {
			if (result.status === 429) rateLimited = true;
		},
		invalidateAll: true
	});

	const user = data.user;

	let remaining = $derived(3 - user.quota);
</script>

<svelte:head>
	<title>Zenith - Today</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h3 class="heading-small">
		Hi, <span class="font-bold text-primary">{user.username}</span>
	</h3>
	<h1 class="heading-main text-center">What are your plans?</h1>
	{#if user.quota < 3 || user.paid}
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
						<Spinner />
					{/if}
				</button>
			</div>
			{#if !user.paid}
				<p class="text-muted mt-2">Free remaining: {remaining}</p>
			{/if}
			{#if rateLimited}
				<span class="mt-2 text-error">Too many requests. Try again later</span>
			{/if}
		</form>
	{:else}
		<p class="my-6 text-warning">
			You have used all of your free creations. <a href="/account/billing">purchase</a> the product to
			continue.
		</p>
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
		<a href="/upcoming" class="link link-primary font-semibold italic">See all upcoming</a>
	</section>
</div>
