<script lang="ts">
	import Blob from '$lib/assets/blob.svg';
</script>

<svelte:head>
	<title>Zenith - Sign in</title>
</svelte:head>

<div class="flex h-[75dvh] select-none flex-col items-center justify-center gap-4">
	<h1 class="mb-8 text-6xl font-black tracking-tighter">Sign in</h1>
	<form action="?/signin" method="post" class="grid grid-cols-2">
		<p class="text-lg font-medium">
			Not convinced yet? <br /> Check out the <a href="/features" class="link">Features</a>.
		</p>
		<button class="btn btn-primary my-auto ml-auto">Sign in</button>
	</form>
</div>
