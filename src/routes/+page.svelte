<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import dayjs from 'dayjs';

	let { data } = $props();

	const { form, delayed, enhance, constraints, allErrors } = superForm(data.createForm, {
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
	{#if data.remaining != 0 || user.paid}
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
				<p class="text-muted mt-2">Free remaining: {data.remaining}</p>
			{/if}
			{#if $allErrors}
				{#each $allErrors as err}
					<span class="mt-2 text-error">{err.messages}</span>
				{/each}
			{/if}
		</form>
	{:else}
		<p class="heading-small my-8 text-warning">
			You have used all of your free queries. <a href="/account/billing" class="link link-warning"
				>purchase</a
			> the product to continue.
		</p>
	{/if}

	<section class="mb-8 flex w-full max-w-2xl flex-col items-center gap-12">
		{#await data.events}
			<Loading text="events" />
		{:then events}
			{#if events.length == 0}
				<h2 class="heading-small italic">Nothing planned today.</h2>
			{:else}
				{@const dueEvents = events.filter((e) => dayjs(e.date).isAfter(dayjs()))}
				{@const overDueEvents = events.filter((e) => dayjs(e.date).isBefore(dayjs()))}
				{#if dueEvents.length != 0}
					<h3 class="heading-sub mb-2 mr-auto">Today:</h3>
					{#each dueEvents as event (event.id)}
						<Event
							projects={data.projects}
							{event}
							editFormData={data.editForm}
							toggleFormData={data.toggleForm}
						/>
					{/each}
				{/if}
				{#if overDueEvents.length != 0}
					<h3 class="heading-sub mb-2 mr-auto">Overdue:</h3>
					{#each overDueEvents as event (event.id)}
						<Event
							projects={data.projects}
							{event}
							editFormData={data.editForm}
							toggleFormData={data.toggleForm}
						/>
					{/each}
				{/if}
			{/if}
		{:catch}
			<Error />
		{/await}
		<p class="flex gap-4">
			<a href="/upcoming" class="link link-primary font-semibold italic">All upcoming</a>
			<span>|</span>
			<a href="/completed" class="link link-success font-semibold italic">Completed</a>
		</p>
	</section>
</div>
