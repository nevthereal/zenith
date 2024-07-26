<script lang="ts">
	import hero from '$lib/assets/zenith-hero.png';
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

<div class="hero h-[75dvh] rounded-box" style={`background-image: url(${hero})`}>
	<div class="hero-overlay rounded-box bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-md">
			<h1 class="heading-super-big">Zenith</h1>
			<p class="heading-sub">everyday planning powered by AI, at your fingertips</p>
			<div class="flex justify-center gap-6">
				<a href="/features" class="btn">Features</a>
				<a href="/signin" class="btn btn-primary">Sign In</a>
			</div>
		</div>
	</div>
</div>
