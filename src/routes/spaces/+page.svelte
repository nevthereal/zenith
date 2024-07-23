<script lang="ts">
	import Event from '$lib/components/Event.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>All Spaces</title>
</svelte:head>

<div class="flex flex-col items-center">
	<h1 class="text-center text-3xl font-bold md:text-5xl">All Spaces</h1>
	<section class="mt-4 flex w-full max-w-2xl flex-col items-center gap-4 md:mt-8"></section>
</div>
