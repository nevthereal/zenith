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

<ul class="flex flex-col gap-1 md:text-lg">
	<li>
		<span class="font-medium">Username:</span>
		<span class="text-base-content/80">{user.username}</span>
	</li>
	<li class="flex items-center gap-2">
		<span class="font-medium">Email:</span>
		{#if user.email}
			<span
				class={cn(revealed ? 'blur-0' : 'blur-sm', 'text-base-content/80 duration-200 ease-in-out')}
				>{user.email}</span
			>
			<button class="btn btn-neutral btn-xs font-mono" onclick={() => (revealed = !revealed)}
				>{revealed ? 'Hide' : 'Show'}</button
			>
		{:else}
			<a href="/account/edit" class="link">Please add an email</a>
		{/if}
	</li>
	<li>
		<span class="font-medium">Joined:</span>
		<span class="text-base-content/80">{dayjs().to(dayjs(user.joined))}</span>
	</li>
	<li>
		<span class="font-medium">Paid:</span>
		<a class="link link-primary" href="/account/billing">{user.paid ? 'Yes' : 'No'}, See billing</a>
	</li>
	{#if user.admin}
		<li>
			<a href="/admin" class="link link-primary">You are an admin</a>
		</li>
	{/if}
</ul>
