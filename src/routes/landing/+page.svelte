<script lang="ts">
	import EventDemo from '$lib/components/EventDemo.svelte';
	import EarthImage from '$lib/assets/earth.jpg';
	import dayjs from 'dayjs';
</script>

<svelte:head>
	<title>Zenith</title>
	<meta name="description" content="AI-powered planning. No more annoying interfaces." />
	<meta property="og:title" content="Zenith" />
	<meta property="og:description" content="AI-powered planning. No more annoying interfaces." />
	<meta property="og:url" content="https://www.zenithproductivity.app" />
	<meta
		property="twitter:description"
		content="AI-powered planning. No more annoying interfaces."
	/>
	<meta property="twitter:title" content="Zenith" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@BremNeville" />
</svelte:head>

<section
	class="hero mx-auto my-8 h-[75dvh] w-11/12 rounded-box bg-base-100 bg-blend-color-dodge"
	style="background-image: url({EarthImage});"
>
	<div class="hero-overlay rounded-box bg-opacity-75"></div>
	<div class="hero-content grid w-[80%] text-center md:grid-cols-2">
		<div class="max-w-md md:text-left">
			<h1 class="heading-super-big">Zenith</h1>
			<p class="heading-small mb-4">everyday planning powered by AI, at your fingertips</p>
			<div class="flex gap-6 max-md:justify-center">
				<a href="/features" class="btn">Features</a>
				<a href="/signin" class="btn btn-primary">Sign In</a>
			</div>
		</div>
		<div class="max-md:hidden">
			<EventDemo />
		</div>
	</div>
</section>
