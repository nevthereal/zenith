<script lang="ts">
	import wretch from 'wretch';

	let { data } = $props();

	const user = data.user;

	const signout = async () => {
		wretch('/api/signout').post();
		location.reload();
	};

	const purchase = async () => {
		wretch('/api/stripe/purchase')
			.post()
			.json((json) => {
				return window.location.replace(json.url);
			});
	};
</script>

<h1>Welcome, {user.username}</h1>
{#if user.admin}
	<p>You are an admin</p>
{/if}
<button onclick={purchase}>Purchase the product to continue</button>

<button onclick={signout} class="btn btn-error mt-4">Log out</button>
