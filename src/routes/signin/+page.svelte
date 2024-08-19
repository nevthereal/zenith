<svelte:head>
	<title>Zenith - Sign in</title>
</svelte:head>

<div class="grid h-[75dvh] md:grid-cols-2">
	<div class="flex flex-col items-center justify-center">
		<h1 class="heading-super-big mb-4">Sign in</h1>
		<p class="heading-small text-center">
			Not convinced yet? <br /> Check out the <a href="/features" class="link">Features</a>.
		</p>
	</div>
	<form method="post" class="flex flex-col items-center gap-4 md:justify-center">
		<button formaction="?/github" class="btn flex gap-4 text-lg"
			><i class="fa-brands fa-github"></i>Sign in with GitHub</button
		>
	</form>
</div>
