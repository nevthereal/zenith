<script lang="ts">
	import type { users } from '$lib/db/schema';
	import dayjs from 'dayjs';

	interface Props {
		name: string;
		deadline: string | null;
		collaborators: (typeof users.$inferSelect)[];
		id: number;
	}

	let { name, deadline, collaborators, id }: Props = $props();
</script>

<a
	href={`/projects/${id}`}
	class="card motion-preset-focus flex h-48 flex-col justify-between bg-base-200 p-8"
>
	<h1 class="heading-sub mb-2">{name}</h1>
	<div>
		<p class="text-muted font-medium">
			{#if collaborators && collaborators.length != 0}
				<span
					>Shared with {collaborators[0].name}
					{#if collaborators.length > 1}
						and {collaborators.length - 1} other{collaborators.length - 1 != 1 ? 's' : ''}
					{/if}</span
				>
			{/if}
		</p>
		<p class="text-muted font-medium">
			{#if deadline}
				<span>Deadline: {dayjs(deadline).format('D MMMM YYYY')}</span>
			{:else}
				<span>No deadline set</span>
			{/if}
		</p>
	</div>
</a>
