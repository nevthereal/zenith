<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import wretch from 'wretch';

	let { data } = $props();

	const user = data.user;

	const purchase = async () => {
		wretch('/api/stripe/purchase')
			.post()
			.json((json) => {
				return window.location.replace(json.url);
			});
	};
</script>

{#if !user.paid}
	<div class="flex">
		<button class="btn btn-warning btn-lg mx-auto" onclick={purchase}
			>Purchase the product to continue</button
		>
	</div>
{/if}

<h1>Welcome, {user.username}</h1>
{#if user.admin}
	<p>You are an admin</p>
{/if}

<a href="/api/signout" class="btn btn-error mt-4">Log out</a>
