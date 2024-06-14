<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const user = data.user;
</script>

<h1>Welcome, {user.username}</h1>
