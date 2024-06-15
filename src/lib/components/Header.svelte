<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { CalendarDays, CircleUser, List } from 'lucide-svelte';
</script>

<nav class="flex items-center justify-between p-4">
	<a href="/" class="flex items-center"
		><img src={logo} alt="Logo" class="size-20" /><span class="text-4xl font-bold italic"
			>Zenith</span
		></a
	>
	<div class="flex gap-8">
		<a class="my-auto flex items-center gap-2 text-lg font-medium" href="/upcoming"
			><CalendarDays /> <span class="hidden md:block">Upcoming</span></a
		>
		<a class="my-auto flex items-center gap-2 text-lg font-medium" href="/account"
			><CircleUser /> <span class="hidden md:block">Account</span></a
		>
	</div>
</nav>
