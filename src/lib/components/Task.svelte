<script lang="ts">
	import type { tasksTable } from '$lib/db/schema';
	import dayjs from 'dayjs';

	export let task: typeof tasksTable.$inferSelect;
</script>

<div class="card bg-base-200 p-8">
	<h1 class="text-2xl font-bold">{task.content}</h1>
	<p class="">
		{dayjs(task.due).toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
	</p>
</div>
