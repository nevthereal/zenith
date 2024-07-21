<script lang="ts">
	import Blob from '$lib/assets/blob.svg';
</script>

<svelte:head>
	<title>Zenith - Sign in</title>
</svelte:head>

<div class="flex h-[75dvh] select-none flex-col items-center justify-center gap-4">
	<h1 class="mb-8 text-3xl font-black tracking-tighter md:text-6xl">Sign in</h1>
	<form action="?/signin" method="post" class="mx-4 grid grid-cols-2 md:mx-0">
		<p class="font-medium md:text-lg">
			Not convinced yet? <br /> Check out the <a href="/features" class="link">Features</a>.
		</p>
		<button class="btn btn-primary my-auto ml-auto flex gap-2"
			><i class="iconoir-github before:text-xl"></i>Sign in</button
		>
	</form>
</div>
