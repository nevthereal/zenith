<script lang="ts">
	import Blob from '$lib/assets/blob.svg';
</script>

<svelte:head>
	<title>Zenith - Sign in</title>
</svelte:head>

<div class="flex h-[90dvh] select-none flex-col items-center justify-center gap-4">
	<div class="z-10 flex flex-col items-center justify-center">
		<h1 class="mb-8 text-6xl font-black tracking-tighter">Sign in</h1>
		<div class="grid grid-cols-2">
			<p class="text-lg font-medium">
				Not convinced yet? <br /> Check out the <a href="/features" class="link">Features</a>.
			</p>
			<a href="/api/github" class="btn m-auto">Sign in</a>
		</div>
	</div>
	<img class="fixed blur-xl" src={Blob} alt="blob" />
</div>
