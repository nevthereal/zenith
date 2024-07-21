<svelte:head>
	<title>Zenith - Sign in</title>
</svelte:head>

<div class="grid h-[75dvh] md:grid-cols-2">
	<div class="flex flex-col items-center justify-center">
		<h1 class="mb-8 text-3xl font-black tracking-tighter md:text-6xl">Sign in</h1>
		<p class="text-center font-medium md:text-lg">
			Not convinced yet? <br /> Check out the <a href="/features" class="link">Features</a>.
		</p>
	</div>
	<form method="post" class="flex flex-col items-center justify-center gap-4">
		<button formaction="?/github" class="btn flex gap-2"
			><i class="iconoir-github before:text-xl"></i>Sign in with GitHub</button
		>
	</form>
</div>
