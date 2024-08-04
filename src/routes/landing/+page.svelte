<script lang="ts">
	import EarthImage from '$lib/assets/earth.jpg?enhanced';
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
	class="hero relative mx-auto my-8 h-[75dvh] w-11/12 rounded-box bg-base-100 bg-blend-color-dodge"
>
	<enhanced:img src={EarthImage} class="absolute inset-0 h-full w-full rounded-box object-cover" />
	<div class="hero-overlay absolute inset-0 rounded-box bg-opacity-70"></div>
	<div class="hero-content relative z-10 w-[80%] text-center">
		<div class="md:max-w-md">
			<h1 class="heading-super-big">Zenith</h1>
			<p class="heading-small mb-4">everyday planning powered by AI, at your fingertips</p>
			<div class="flex justify-center gap-6">
				<a href="/features" class="btn">Features</a>
				<a href="/signin" class="btn btn-primary">Sign In</a>
			</div>
		</div>
	</div>
</section>
