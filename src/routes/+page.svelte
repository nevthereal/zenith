<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
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
	<title>Zenith - Today</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h3 class="text-lg font-medium md:text-xl">
		Hi, <span class="font-bold text-primary">{user.username}</span>
	</h3>
	<h1 class="text-center text-3xl font-bold md:text-5xl">What are your plans?</h1>
	{#if user.paid}
		<form action="?/create" method="POST" class="my-12 flex items-center gap-4" use:enhance>
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

	<section class="flex flex-col items-center gap-4">
		{#if events.length == 0}
			<h2 class="text-xl font-semibold italic">Nothing planned today.</h2>
		{/if}
		{#each events as event (event.id)}
			<Event {event} editFormData={data.editForm} deleteFormData={data.deleteForm} />
		{/each}
		<a href="/upcoming" class="link link-primary mb-4 font-semibold italic">View all upcoming</a>
	</section>
</div>
