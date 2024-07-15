<script lang="ts">
	import { tagEnum } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	import dayjs from 'dayjs';
	import { Pencil, Trash } from 'lucide-svelte';

	interface Props {
		content: string;
		tag: typeof tagEnum.enumValues;
		date: dayjs.Dayjs;
	}

	let { content, tag, date }: Props = $props();
</script>

<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 md:w-[30vw]">
	<div>
		<h1 class="text-3xl font-bold text-primary">{content}</h1>
		<p>
			<span class={cn(date.isBefore(dayjs()) && 'text-warning')}
				>{date.format('D MMMM YYYY, HH:mm')}</span
			>
			{'·'}
			<span class="font-medium text-secondary">{tag}</span>
		</p>
	</div>
	<div class="flex gap-2">
		<button class="btn btn-circle my-auto">
			<Pencil stroke-width={2} />
		</button>
		<button class="btn btn-circle my-auto">
			<Trash stroke-width={2} />
		</button>
	</div>
</div>
