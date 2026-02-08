<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import logo from '$lib/assets/zenith-logo.svg';
	import '../app.css';

	const { children, data } = $props();

	const user = data.user;

	onMount(async () => {
		if (!user) return;

		const resolved = Intl.DateTimeFormat().resolvedOptions();
		const locale = resolved.locale ?? navigator.language;
		const timeZone = resolved.timeZone;

		if (!locale || !timeZone) return;
		if (user.locale === locale && user.timeZone === timeZone) return;

		await fetch('/api/user-context', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ locale, timeZone })
		});
	});
</script>

<svelte:head>
	{#if !dev}
		<script
			defer
			src="https://analytics.nevillebrem.com/script.js"
			data-website-id="96c4fd49-95b0-4b54-928b-6cc0081a30a0"
		></script>
	{/if}
</svelte:head>

<nav class="motion-preset-blur-up flex select-none items-center justify-between p-4">
	<a href="/" class="flex items-center"
		><img src={logo} alt="Logo" class="size-16" /><span
			class="text-2xl font-bold italic md:text-4xl"
		>
			zenith</span
		></a
	>
	<div class="flex gap-8">
		{#if user}
			<a
				class="my-auto flex items-center gap-2 text-lg font-medium"
				href="/upcoming"
				aria-label="Upcoming Events"
				><i class="fa-solid fa-calendar-days text-xl"></i>
				<span class="hidden md:block">Upcoming</span></a
			>
			<a
				class="my-auto flex items-center gap-2 text-lg font-medium"
				href="/projects"
				aria-label="Projects"
				><i class="fa-solid fa-server text-xl"></i>
				<span class="hidden md:block">Projects</span></a
			>
			<a
				class="my-auto flex items-center gap-2 text-lg font-medium"
				href="/account"
				aria-label="Account Overview"
				><i class="fa-solid fa-user text-xl"></i>
				<span class="hidden md:block">Account</span></a
			>
		{:else}
			<a
				class="my-auto flex items-center gap-2 text-lg font-medium"
				href="/features"
				aria-label="Features"
				><i class="fa-solid fa-wand-magic-sparkles"></i>
				<span class="hidden md:block">Features</span></a
			>
			<a
				class="my-auto flex items-center gap-2 text-lg font-medium"
				href="/signin"
				aria-label="Sign in"
				><i class="fa-regular fa-hand-peace text-xl"></i>
				<span class="hidden md:block">Sign In</span></a
			>
		{/if}
	</div>
</nav>
<main class="mx-8 md:mx-auto md:max-w-[90dwv]">
	{@render children()}
</main>
