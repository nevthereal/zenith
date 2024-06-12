<script lang="ts">
	import type { tasksTable } from '$lib/db/schema';
	import dayjs from 'dayjs';
	import { Trash } from 'lucide-svelte';

	export let task: typeof tasksTable.$inferSelect;

	const deleteTask = async () => {
		if (confirm(`Do you want to delete "${task.content}"`)) {
			await fetch(`/api/delete-task?id=${task.id}`, { method: 'DELETE' });
			location.reload();
		}
	};
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-2xl font-bold text-primary">{task.content}</h1>
		<p class="">
			{dayjs(task.due).toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
		</p>
	</div>
	<button class="btn btn-circle" on:click={deleteTask}>
		<Trash />
	</button>
</div>
