	<script lang="ts">
		import { cn } from '$lib/utils.js';
		import { dayjs } from '$lib/datetime';

	let { data } = $props();

	const user = data.user;
	const userTimeZone = $derived(data.user?.timeZone);
	const now = $derived(userTimeZone ? dayjs().tz(userTimeZone) : dayjs());
	const joinedAt = $derived(
		userTimeZone ? dayjs(user.createdAt).tz(userTimeZone) : dayjs(user.createdAt)
	);

	let revealed = $state(false);
</script>

<svelte:head>
	<title>Account - Overview</title>
</svelte:head>

<section class="space-y-4">
	<h1 class="heading-main">Account overview</h1>

	<ul class="flex flex-col gap-1 md:text-lg">
		<li>
			<span class="font-medium">Username:</span>
			<span class="text-muted">{user.name}</span>
		</li>
		<li class="flex items-center gap-2">
			<span class="font-medium">Email:</span>
			{#if user.email}
				<span
					class={cn(
						revealed ? 'blur-0' : 'blur-sm',
						'text-base-content/80 duration-100 ease-in-out'
					)}>{user.email}</span
				>
				<button class="btn btn-neutral btn-xs font-mono" onclick={() => (revealed = !revealed)}
					>{revealed ? 'Hide' : 'Show'}</button
				>
			{:else}
				<a href="/account/email" class="link link-primary">Please add an email</a>
			{/if}
		</li>
		<li>
			<span class="font-medium">Joined:</span>
			<span class="text-muted">{now.to(joinedAt)}</span>
		</li>
		<li>
			<span class="font-medium">Paid:</span>
			<a class="link link-primary" href="/account/billing">
				{data.subscription ? 'Yes' : 'No'}, See billing
			</a>
		</li>
		<li>
			<span class="font-medium">Completed Tasks:</span>
			<span class="text-muted">{data.completedCount}</span>
		</li>
		{#if user.role === 'admin'}
			<li>
				<a href="/admin" class="link link-primary">You are an admin</a>
			</li>
		{/if}
	</ul>
</section>
