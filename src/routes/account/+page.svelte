<script lang="ts">
	import { cn } from '$lib/utils.js';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	let { data } = $props();

	const user = data.user;
</script>

<svelte:head>
	<title>Account - Overview</title>
</svelte:head>

<h1 class="heading-main">Account overview</h1>

<ul class="flex flex-col gap-1 md:text-lg">
	<li>
		<span class="font-medium">Username:</span>
		<span class="text-muted">{user.username}</span>
	</li>
	<li class="flex items-center gap-2">
		<span class="font-medium">Email:</span>
		{#if user.email}
			<span class="text-muted"
				>{user.email}
				{#if !user.emailVerified}
					<a href="/account/email" class="link">, please verify</a>
				{/if}</span
			>
		{:else}
			<a href="/account/email" class="link link-primary">Please add an email</a>
		{/if}
	</li>
	<li>
		<span class="font-medium">Joined:</span>
		<span class="text-muted">{dayjs().to(dayjs(user.joined))}</span>
	</li>
	<li>
		<span class="font-medium">Paid:</span>
		<a class="link link-primary" href="/account/billing">{user.paid ? 'Yes' : 'No'}, See billing</a>
	</li>
	<li>
		<span class="font-medium">Completed Tasks:</span>
		<span class="text-muted">{data.completedCount.length}</span>
	</li>
	{#if user.admin}
		<li>
			<a href="/admin" class="link link-primary">You are an admin</a>
		</li>
	{/if}
</ul>
