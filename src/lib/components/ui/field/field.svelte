<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Orientation = 'vertical' | 'horizontal' | 'responsive';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		orientation?: Orientation;
		ref?: HTMLDivElement | null;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		orientation = 'vertical',
		...restProps
	}: Props = $props();
</script>

<div
	bind:this={ref}
	data-slot="field"
	data-orientation={orientation}
	class={cn(
		'group/field flex gap-3',
		orientation === 'vertical' && 'flex-col',
		orientation === 'horizontal' && 'items-center justify-between gap-4',
		orientation === 'responsive' && 'flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
		className
	)}
	role="group"
	{...restProps}
>
	{@render children?.()}
</div>
