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

<div class="hero h-[90dvh] bg-black" style={`background-image: url(${hero})`}>
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-md">
			<h1 class="mb-4 text-8xl font-black tracking-tighter">Zenith</h1>
			<p class="mb-4 text-2xl font-medium">everyday planning powered by AI, at your fingertips</p>
			<div class="flex justify-center gap-6">
				<a href="/features" class="btn btn-primary">Features</a>
				<a href="/signin" class="btn shadow-md">Sign In</a>
			</div>
		</div>
	</div>
</div>
