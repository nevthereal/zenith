<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	let { data } = $props();

	const user = data.user;
</script>

<div class="mb-4 flex items-center justify-between">
	<h1 class="text-5xl font-bold tracking-tighter">Account overview</h1>
</div>
<div class="debug text-lg leading-8">
	<p><span class="font-medium">Username:</span> {user.username}</p>
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
