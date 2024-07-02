<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import { cn } from '$lib/utils';

	let { data } = $props();

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
	<form
		action="?/create"
		method="POST"
		class={cn(
			'my-12 flex items-center gap-4',
			!user.paid && 'tooltip tooltip-bottom tooltip-secondary'
		)}
		data-tip={!user.paid && 'Please refer to the account page and purchase the product to continue'}
		use:enhance
	>
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

	<section class="flex flex-col items-center gap-4">
		{#await events}
			<h2 class="text-xl font-semibold italic">Fetching events...</h2>
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
