<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { CircleUser, List } from 'lucide-svelte';
</script>

<nav class="flex items-center justify-between p-4">
	<a href="/" class="flex items-center"
		><img src={logo} alt="Logo" class="size-20" /><span class="text-4xl font-bold italic"
			>zenith</span
		></a
	>
	<div class="flex gap-8">
		<List />
		<CircleUser />
	</div>
</nav>
