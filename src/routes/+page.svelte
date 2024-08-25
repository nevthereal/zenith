<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	let { data } = $props();

	const { form, delayed, enhance, constraints, allErrors } = superForm(data.createForm, {
		invalidateAll: true
	});

	dayjs.extend(relativeTime);

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
	{#if user.paid || (user.trialEnd != null && user.trialEnd > dayjs().toDate())}
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
			{#if user.trialEnd != null && user.trialEnd > dayjs().toDate()}
				<p class="text-muted mt-2">Your trial ends in {dayjs().to(dayjs(user.trialEnd))}</p>
			{/if}
			{#if $allErrors}
				{#each $allErrors as err}
					<span class="mt-2 text-error">{err.messages}</span>
				{/each}
			{/if}
		</form>
	{:else if user.trialEnd != null && user.trialEnd < dayjs().toDate()}
		<a href="/account/billing" class=" heading-small link link-warning my-8 text-warning"
			>Your free trial is over. Purchase the product to continue</a
		>
	{:else}
		<a href="/account/billing" class=" heading-small link link-warning my-8 text-warning"
			>Activate the free trial or purchase the product to continue.</a
		>
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
