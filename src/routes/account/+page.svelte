<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	let { data } = $props();

	const user = data.user;

	const signout = async () => {
		await fetch('/api/signout', { method: 'POST' });
		location.reload();
	};
</script>

<h1>Welcome, {user.username}</h1>
<button onclick={signout} class="btn btn-error mt-4">Log out</button>
