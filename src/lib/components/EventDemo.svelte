<script lang="ts">
	import { eventsTable, projectsTable } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	import type { zToggleEvent, zEditEvent } from '$lib/zod';
	import dayjs from 'dayjs';
	import { type SuperValidated, type Infer, superForm, dateProxy } from 'sveltekit-superforms';

	interface Props {
		content: string;
		date: Date;
		project: boolean;
	}

	let { content, date, project }: Props = $props();
</script>

<div class="flex w-full flex-row justify-between gap-4 rounded-box bg-base-200 p-8">
	<div>
		<h1 class="heading-sub">{content}</h1>
		<div class="text-md md:text-base">
			<p>
				<span>
					{dayjs(date).format('D MMMM YYYY, HH:mm')}
				</span>
				{#if project}
					<span class="text-secondary"
						><i class="fa-solid fa-arrow-right max-md:hidden"></i>
						<span class="whitespace-nowrap">In a project</span></span
					>
				{/if}
			</p>
		</div>
	</div>
	<div class="flex md:gap-2">
		<button class="btn btn-circle my-auto">
			<i class="fa-solid fa-pencil text-lg md:text-xl"></i>
		</button>
		<button class="btn btn-circle my-auto">
			<i class="fa-regular fa-circle-check text-lg md:text-xl"></i>
		</button>
	</div>
</div>

<style>
	input::-webkit-calendar-picker-indicator {
		display: none;
	}

	input[type='date']::-webkit-input-placeholder {
		visibility: hidden !important;
	}
</style>
