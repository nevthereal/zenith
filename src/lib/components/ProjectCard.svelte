<script lang="ts">
	import type { users } from '$lib/db/schema';
	import { dayjs, formatDate, parseUserDateTime } from '$lib/datetime';

	interface Props {
		name: string;
		deadline: string | Date | null;
		collaborators: (typeof users.$inferSelect)[];
		id: number;
		locale?: string | null;
		timeZone?: string | null;
	}

	let { name, deadline, collaborators, id, locale, timeZone }: Props = $props();

	const deadlineDate = $derived.by(() => {
		if (!deadline) return null;
		const dateString =
			deadline instanceof Date ? dayjs(deadline).utc().format('YYYY-MM-DD') : deadline;
		const parsed = timeZone
			? parseUserDateTime(`${dateString}T00:00`, timeZone)
			: new Date(dateString);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	});
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
			{#if deadlineDate}
				<span>Deadline: {formatDate(deadlineDate, { locale, timeZone })}</span>
			{:else}
				<span>No deadline set</span>
			{/if}
		</p>
	</div>
</a>
