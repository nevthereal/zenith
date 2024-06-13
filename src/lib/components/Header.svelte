<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { CalendarDays, CircleUser, List } from 'lucide-svelte';
</script>

<nav class="flex items-center justify-between p-4">
	<a href="/" class="flex items-center"
		><img src={logo} alt="Logo" class="size-20" /><span class="text-4xl font-bold italic"
			>zenith</span
		></a
	>
	<div class="flex gap-8">
		<a href="/upcoming"><CalendarDays /></a>
		<a href="/account"><CircleUser /></a>
	</div>
</nav>
