<script lang="ts">
	import Error from '$lib/components/Error.svelte';
	import Event from '$lib/components/Event.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { getUpcomingEvents } from '$lib/remote/events.remote';

	let { data } = $props();
	const user = $derived(data.user!);
	const upcomingEvents = getUpcomingEvents();
	const userLocale = $derived(user.locale);
	const userTimeZone = $derived(user.timeZone);
</script>

<svelte:head>
	<title>Upcoming</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="heading-main text-center">Upcoming</h1>
	<section class="mt-4 flex w-full max-w-2xl flex-col items-center gap-4 md:mt-8">
		<svelte:boundary>
			{@const events = await upcomingEvents}
			{#if events.length === 0}
				<h2 class="heading-small italic">Nothing upcoming.</h2>
			{:else}
				{#each events as event (event.id)}
					<Event projects={data.projects} {event} locale={userLocale} timeZone={userTimeZone} />
				{/each}
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
		<a href="/completed" class="link link-success font-semibold italic">See Completed</a>
	</section>
</div>
