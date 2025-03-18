<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { cn } from '$lib/utils.js';

	let { data } = $props();

	const { user, subscription, events, freeTodayCount } = $derived(data);

	const { form, delayed, enhance, constraints, errors } = superForm(data.createForm, {
		invalidateAll: true
	});

	dayjs.extend(relativeTime);
</script>

<svelte:head>
	<title>Zenith - Today</title>
</svelte:head>

<div class="flex flex-col items-center">
	<div class="motion-preset-blur-up text-center">
		<h3 class="heading-small">
			Hi, <span class="font-bold text-primary">{user.name}</span>
		</h3>
		<h1 class="heading-main">What are your plans?</h1>
	</div>
	{#if subscription || user.role === 'admin' || freeTodayCount < 5}
		<form
			action="?/create"
			method="POST"
			class="motion-preset-blur-up my-12 flex flex-col motion-delay-300"
			use:enhance
		>
			<div class="flex items-center justify-center gap-4">
				<input
					class="input input-bordered input-primary border-2"
					type="text"
					placeholder="Event or Task"
					name="event"
					bind:value={$form.event}
					{...$constraints.event}
				/>
				<button class="btn btn-primary" disabled={!subscription && freeTodayCount >= 5}
					>Add!
					{#if $delayed}
						<Spinner />
					{/if}
				</button>
			</div>
			{#if !subscription}
				<span class={cn('text-muted mt-2', freeTodayCount >= 5 && 'text-error')}
					>{5 - freeTodayCount} daily Events left on free tier {#if freeTodayCount >= 5}
						<a href="/account/billing" class="font-bold">Upgrade</a>
					{/if}</span
				>
			{/if}
			{#if $errors.event}
				<span class="mt-2 text-error">{$errors.event.join(', ')}</span>
			{/if}
		</form>
	{:else}
		<a href="/account/billing" class="heading-small link link-warning my-8 text-warning"
			>Your daily quota has run out. Please upgrade.</a
		>
	{/if}

	<section class="mb-8 flex w-full max-w-2xl flex-col items-center">
		{#await events}
			<Loading text="events" />
		{:then events}
			{#if events.length == 0}
				<h2 class="heading-small italic">All done for today!</h2>
			{:else}
				{@const dueEvents = events.filter((e) => dayjs(e.date).isAfter(dayjs()))}
				{@const overDueEvents = events.filter((e) => dayjs(e.date).isBefore(dayjs()))}
				{#if dueEvents.length != 0}
					<h3 class="heading-sub my-4 mr-auto">Today:</h3>
					<div class="flex w-full flex-col gap-4">
						{#each dueEvents as event (event.id)}
							<Event
								projects={data.projects}
								{event}
								editFormData={data.editForm}
								toggleFormData={data.toggleForm}
							/>
						{/each}
					</div>
				{/if}
				{#if overDueEvents.length != 0}
					<h3 class="heading-sub my-4 mr-auto">Overdue:</h3>
					<div class="flex w-full flex-col gap-4">
						{#each overDueEvents as event (event.id)}
							<Event
								projects={data.projects}
								{event}
								editFormData={data.editForm}
								toggleFormData={data.toggleForm}
							/>
						{/each}
					</div>
				{/if}
			{/if}
		{:catch}
			<Error />
		{/await}
		<p class="mt-4 flex gap-4">
			<a href="/upcoming" class="link link-primary font-semibold italic">All upcoming</a>
			<span>|</span>
			<a href="/completed" class="link link-success font-semibold italic">Completed</a>
		</p>
	</section>
</div>
