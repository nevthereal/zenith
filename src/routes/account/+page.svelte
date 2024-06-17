<script lang="ts">
	import type { PageServerData } from './$types';

	let { data } = $props();

	const user = data.user;
</script>

<h1>Welcome, {user.username}</h1>
