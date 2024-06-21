<script lang="ts">
	import dayjs from 'dayjs';
	import wretch from 'wretch';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	let { data } = $props();

	const user = data.user;
</script>

{#if !user.paid}
	<div class="flex">
		<button
			class="btn btn-warning btn-lg mx-auto"
			onclick={async () =>
				wretch('/api/stripe/purchase')
					.post()
					.json((json) => {
						return window.location.replace(json.url);
					})}>Purchase the product to continue</button
		>
	</div>
{/if}

<h1 class="mb-4 text-5xl font-bold tracking-tighter">Account overview</h1>
<div class="text-lg leading-8">
	<p><span class="font-medium">Username:</span> {user.username}</p>
	<p><span class="font-medium">Joined:</span> {dayjs().to(dayjs(user.joined))}</p>
	{#if user.admin}
		<p>You are an admin</p>
	{/if}
</div>
