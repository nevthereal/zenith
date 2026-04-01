<script lang="ts">
	import Event from '$lib/components/Event.svelte';
	import Error from '$lib/components/Error.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as Field from '$lib/components/ui/field/index.js';
	import { dayjs } from '$lib/datetime';
	import { createEvent, getTodayEvents } from '$lib/remote/events.remote';
	import { cn } from '$lib/utils.js';
	import { zCreateEvent } from '$lib/zod';

	let { data } = $props();
	const user = $derived(data.user!);
	const userLocale = $derived(user.locale);
	const userTimeZone = $derived(user.timeZone);

	const { subscription, freeTodayCount } = $derived(data);
	const projects = $derived(data.projects);
	const todayEvents = getTodayEvents();
	const canCreateEvents = $derived(subscription || user.role === 'admin' || freeTodayCount < 5);
	const showFreeTierInfo = $derived(!subscription && user.role !== 'admin');

	const createEventForm = createEvent.preflight(zCreateEvent);
	const enhancedCreateEventForm = createEventForm.enhance(async ({ form, submit }) => {
		await submit();

		if (!createEventForm.fields.allIssues()?.length) {
			form.reset();
		}
	});
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
	{#if canCreateEvents}
		<form
			{...enhancedCreateEventForm}
			class="motion-preset-blur-up my-12 w-full max-w-2xl motion-delay-300"
		>
			<Field.Set>
				<Field.Group class="gap-3">
					<Field.Field
						class="gap-4"
						data-invalid={createEventForm.fields.event.issues()?.length ? true : undefined}
					>
						<div class="flex items-start gap-4 max-md:flex-col">
							<Field.Content class="gap-2">
								<Field.Label for="event">Event or task</Field.Label>
								<input
									id="event"
									class={cn(
										'input input-bordered input-primary w-full border-2',
										createEventForm.fields.event.issues()?.length && 'input-error'
									)}
									placeholder="Event or Task"
									{...createEventForm.fields.event.as('text')}
								/>
								{#each createEventForm.fields.event.issues() ?? [] as issue (`event-${issue.message}`)}
									<Field.Error>{issue.message}</Field.Error>
								{/each}
							</Field.Content>
							<button
								class="btn btn-primary mt-7 min-w-28"
								disabled={createEventForm.pending > 0 || !canCreateEvents}
							>
								Add!
								{#if createEventForm.pending > 0}
									<Spinner />
								{/if}
							</button>
						</div>
						{#each createEventForm.fields.allIssues() ?? [] as issue (`all-${issue.path.join('.')}-${issue.message}`)}
							{#if issue.path.length === 0}
								<Field.Error>{issue.message}</Field.Error>
							{/if}
						{/each}
					</Field.Field>
				</Field.Group>
			</Field.Set>
			{#if showFreeTierInfo}
				<span class={cn('text-muted mt-2 block', freeTodayCount >= 5 && 'text-error')}
					>{5 - freeTodayCount} daily Events left on free tier {#if freeTodayCount >= 5}
						<a href="/account/billing" class="underline">Upgrade</a>
					{/if}</span
				>
			{/if}
		</form>
	{:else}
		<a href="/account/billing" class="heading-small link link-warning my-8 text-warning"
			>Your daily quota has run out. Please upgrade.</a
		>
	{/if}

	<section class="mb-8 flex w-full max-w-2xl flex-col items-center">
		<svelte:boundary>
			{@const events = await todayEvents}
			{#if events.length == 0}
				<h2 class="heading-small italic">All done for today!</h2>
			{:else}
				{@const now = userTimeZone ? dayjs().tz(userTimeZone) : dayjs()}
				{@const dueEvents = events.filter((e) =>
					(userTimeZone ? dayjs(e.date).tz(userTimeZone) : dayjs(e.date)).isAfter(now)
				)}
				{@const overDueEvents = events.filter((e) =>
					(userTimeZone ? dayjs(e.date).tz(userTimeZone) : dayjs(e.date)).isBefore(now)
				)}
				{#if dueEvents.length != 0}
					<h3 class="heading-sub my-4 mr-auto">Today:</h3>
					<div class="flex w-full flex-col gap-4">
						{#each dueEvents as event (event.id)}
							<Event {projects} {event} locale={userLocale} timeZone={userTimeZone} />
						{/each}
					</div>
				{/if}
				{#if overDueEvents.length != 0}
					<h3 class="heading-sub my-4 mr-auto">Overdue:</h3>
					<div class="flex w-full flex-col gap-4">
						{#each overDueEvents as event (event.id)}
							<Event {projects} {event} locale={userLocale} timeZone={userTimeZone} />
						{/each}
					</div>
				{/if}
			{/if}

			{#snippet pending()}
				<Loading text="events" />
			{/snippet}

			{#snippet failed(_error, reset)}
				<div class="flex flex-col items-center gap-3">
					<Error />
					<button class="btn btn-outline btn-sm" onclick={reset}>Retry</button>
				</div>
			{/snippet}
		</svelte:boundary>
		<p class="mt-4 flex gap-4">
			<a href="/upcoming" class="link link-primary font-semibold italic">All upcoming</a>
			<span>|</span>
			<a href="/completed" class="link link-success font-semibold italic">Completed</a>
		</p>
	</section>
</div>
