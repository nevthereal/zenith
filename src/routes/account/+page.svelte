<script lang="ts">
	import { cn } from '$lib/utils.js';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	let { data } = $props();

	const user = data.user;

	let revealed = $state(false);
</script>

<h1 class="account-title">Account overview</h1>

<div class="leading-8 md:text-lg">
	<p><span class="font-medium">Username:</span> {user.username}</p>
	<p class="flex items-center gap-2">
		<span class="font-medium">Email:</span>
		<span class={cn(revealed ? 'blur-0' : 'blur-sm', 'duration-200 ease-in-out')}>{user.email}</span
		>
		<button class="btn btn-neutral btn-xs font-mono" onclick={() => (revealed = !revealed)}
			>{revealed ? 'Hide' : 'Show'}</button
		>
	</p>
	<p><span class="font-medium">Joined:</span> {dayjs().to(dayjs(user.joined))}</p>
	<p>
		<span class="font-medium">Paid:</span>
		<a class="link link-secondary" href="/account/billing"
			>{user.paid ? 'Yes' : 'No'}, See billing</a
		>
	</p>
	{#if user.admin}
		<p>You are an admin</p>
	{/if}
</div>
