<script lang="ts">
	import type { tasksTable } from '$lib/db/schema';
	import dayjs from 'dayjs';
	import { Trash } from 'lucide-svelte';

	export let event: typeof tasksTable.$inferSelect;

	const deleteEvent = async () => {
		if (confirm(`Do you want to delete "${event.content}"`)) {
			await fetch(`/api/delete-event?id=${event.id}`, { method: 'DELETE' });
			location.reload();
		}
	};

	const due = dayjs(event.due);
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-2xl font-bold text-primary">{event.content}</h1>
		<p class={due.isBefore(dayjs()) ? 'text-error' : ''}>
			{due.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
		</p>
	</div>
	<button class="btn btn-circle my-auto" on:click={deleteEvent}>
		<Trash stroke-width={2} />
	</button>
</div>
