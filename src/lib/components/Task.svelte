<script lang="ts">
	import type { tasksTable } from '$lib/db/schema';
	import dayjs from 'dayjs';
	import { Check, Trash } from 'lucide-svelte';

	export let task: typeof tasksTable.$inferSelect;
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-2xl font-bold text-primary">{task.content}</h1>
		<p class="">
			{dayjs(task.due).toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
		</p>
	</div>
	<button class="btn btn-circle">
		<Trash />
	</button>
</div>
