<script>
	import logo from '$lib/assets/zenith-logo.svg';
	import '../app.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	const { children, data } = $props();

	injectAnalytics();
	injectSpeedInsights();

	const user = data.user;
</script>

<nav class="flex select-none items-center justify-between p-4">
	<a href="/" class="flex items-center"
		><img src={logo} alt="Logo" class="size-16" /><span
			class="text-2xl font-bold italic md:text-4xl"
			>{#if user}
				up today
			{:else}
				zenith
			{/if}</span
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
