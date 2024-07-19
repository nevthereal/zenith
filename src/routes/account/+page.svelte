<script lang="ts">
	import { cn } from '$lib/utils.js';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	let { data } = $props();

	const user = data.user;

	let revealed = $state(false);
</script>

<svelte:head>
	<title>Account - Overview</title>
</svelte:head>

<h1 class="account-title">Account overview</h1>

<div class="flex flex-col gap-2 md:text-lg">
	<p><span class="font-medium">Username:</span> {user.username}</p>
	<p class="flex items-center gap-2">
		<span class="font-medium">Email:</span>
		{#if user.email}
			<span class={cn(revealed ? 'blur-0' : 'blur-sm', 'duration-200 ease-in-out')}
				>{user.email}</span
			>
			<button class="btn btn-neutral btn-xs font-mono" onclick={() => (revealed = !revealed)}
				>{revealed ? 'Hide' : 'Show'}</button
			>
		{:else}
			<a href="/account/edit" class="link">Please add an email</a>
		{/if}
	</p>
	<p><span class="font-medium">Joined:</span> {dayjs().to(dayjs(user.joined))}</p>
	<p>
		<span class="font-medium">Paid:</span>
		<a class="link link-secondary" href="/account/billing"
			>{user.paid ? 'Yes' : 'No'}, See billing</a
		>
	</p>
	{#if user.admin}
		<a href="/admin" class="link font-mono">You are an admin</a>
	{/if}
</div>
