<script lang="ts">
	import type { projectsTable } from '$lib/db/schema';
	import dayjs from 'dayjs';

	interface Props {
		name: string;
		deadline: Date | null;
		collaborators: { userId: string; projectId: number | null; user: { username: string } }[];
	}

	let { name, deadline, collaborators }: Props = $props();

	let collaboratorlist = $state('');

	if (collaborators.length != 0) {
		collaboratorlist = collaborators.map((collaborator) => collaborator.user.username).join(', ');
	}
</script>

<div class="card flex h-36 flex-col justify-between bg-base-200 p-6">
	<h1 class="text-2xl font-bold">{name}</h1>
	<div>
		<p class="font-medium text-base-content/80">
			{#if collaborators.length != 0}
				<span>Shared with {collaboratorlist}</span>
			{/if}
		</p>
		<p class="font-medium">
			{#if deadline}
				<span>Deadline: {dayjs(deadline).format('D MMMM YYYY, HH:mm')}</span>
			{:else}
				<span>No deadline set</span>
			{/if}
		</p>
	</div>
</div>
