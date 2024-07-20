<script>
	import logo from '$lib/assets/zenith-logo.svg';
	import '../app.css';

	const { children, data } = $props();

	const user = data.user;
</script>

<nav class="flex select-none items-center justify-between p-4">
	<a href={user ? '/' : '/landing'} class="flex items-center"
		><img src={logo} alt="Logo" class="size-16 md:size-20" /><span
			class="text-2xl font-bold italic md:text-4xl"
			>{#if user}
				up today
			{:else}
				zenith
			{/if}</span
		></a
	>
	<div class="flex gap-6 md:gap-8">
		{#if user}
			<a class="my-auto flex items-center gap-2 text-lg font-medium" href="/upcoming"
				><i class="iconoir-calendar before:text-2xl"></i>
				<span class="hidden md:block">Upcoming</span></a
			>
			<a class="my-auto flex items-center gap-2 text-lg font-medium" href="/account"
				><i class="iconoir-user before:text-2xl"></i>
				<span class="hidden md:block">Account</span></a
			>
		{:else}
			<a class="my-auto flex items-center gap-2 text-lg font-medium" href="/features"
				><i class="iconoir-sparks before:text-2xl"></i>
				<span class="hidden md:block">Features</span></a
			>
			<a class="my-auto flex items-center gap-2 text-lg font-medium" href="/signin"
				><i class="iconoir-peace-hand before:text-2xl"></i>
				<span class="hidden md:block">Sign In</span></a
			>
		{/if}
	</div>
</nav>
<main class="mx-4 md:mx-auto md:max-w-[90dwv]">
	{@render children()}
</main>
