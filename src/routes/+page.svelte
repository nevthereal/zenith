<script lang="ts">
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const task = data.object;
	const due = dayjs(task.due);
</script>

<div class="rounded-2xl border-2 p-4">
	<h1 class="mb-2">{task.title}</h1>
	<p>{due.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
</div>
