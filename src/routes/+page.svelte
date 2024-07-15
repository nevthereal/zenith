<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import wretch from 'wretch';
	import { invalidate } from '$app/navigation';

	let { data } = $props();

	let events = $derived(data.events);

	const { form, delayed, enhance, constraints } = superForm(data.createForm, {
		onUpdated({ form }) {
			if (form.valid) invalidate('fetch:events');
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
	<meta property="og:url" content="https://www.zenithproductivity.app" />
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
	<h1 class="text-5xl font-bold">What are your plans?</h1>
	{#if user.paid}
		<form action="?/create" method="POST" class="my-12 flex items-center gap-4" use:enhance>
			<input
				disabled={!user.paid}
				class="input input-bordered input-primary border-2"
				type="text"
				placeholder="Event or Task"
				name="event"
				bind:value={$form.event}
				{...$constraints.event}
			/>
			<button class="btn btn-primary" disabled={!user.paid}
				>Add!
				{#if $delayed}
					<span class="loading loading-spinner loading-xs"></span>
				{/if}
			</button>
		</form>
	{:else}
		<div class="my-12">
			<button
				class="btn btn-warning tooltip tooltip-top"
				data-tip="Purchase the product to continue"
				onclick={() =>
					wretch('/api/stripe/purchase')
						.post()
						.json((json) => {
							return window.location.replace(json.url);
						})}
				>Purchase ($10)
			</button>
		</div>
	{/if}

	<section class="flex flex-col items-center gap-4">
		{#if events.length == 0}
			<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
		{/if}
		{#each events as event (event.id)}
			<Event {event} editFormData={data.editForm} deleteFormData={data.deleteForm} />
		{/each}
		<a href="/upcoming" class="link link-primary font-semibold italic">View all upcoming</a>
	</section>
</div>
