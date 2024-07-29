<script lang="ts">
	import galaxyHero from '$lib/assets/zenith-hero.png';
	import EventDemo from '$lib/components/EventDemo.svelte';
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
	class="hero mx-auto my-8 h-[80dvh] w-11/12 rounded-box"
	style="background-image: url({galaxyHero})"
>
	<div class="hero-overlay rounded-box bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-md">
			<h1 class="heading-super-big">Zenith</h1>
			<p class="heading-sub">everyday planning powered by AI, at your fingertips</p>
			<div class="flex justify-center gap-6">
				<a href="#about" class="btn">Features</a>
				<a href="/signin" class="btn btn-primary">Sign In</a>
			</div>
		</div>
	</div>
</section>
<section id="about" class="mx-8 my-8 grid max-w-[80vw] items-center md:mx-auto md:grid-cols-2">
	<div class="text-center">
		<h1 class="heading-main">Planning, assisted by <span class="text-secondary">AI</span></h1>
		<h3 class="heading-muted">Don't mess with UIs if machines can do the job for you!</h3>
	</div>
	<div class="my-16 flex flex-col items-center justify-center gap-4">
		<p class="text-center text-lg font-bold md:text-2xl">"Dinner with Stacy tomorrow at 6PM"</p>
		<i class="fa-solid fa-arrow-down mb-4 text-2xl text-secondary"></i>
		<EventDemo
			content="Dinner with Stacy"
			date={dayjs().add(1, 'day').set('hour', 18).set('minute', 0).set('second', 0).toDate()}
			project={false}
		/>
	</div>
</section>
<section class="grid md:grid-flow-row md:grid-cols-2"></section>
