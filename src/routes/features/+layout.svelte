<script>
	import EventDemo from '$lib/components/EventDemo.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Zenith - Features</title>
</svelte:head>

<h1 class="heading-super-big mb-8 text-center">Features</h1>
<EventDemo />
<article class="prose-h1:heading-main prose-h2:heading-sub prose mx-auto my-16">
	{@render children()}
</article>
