<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Props = HTMLAttributes<HTMLLegendElement> & {
		children?: Snippet;
		class?: string;
		ref?: HTMLLegendElement | null;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<legend
	bind:this={ref}
	data-slot="field-legend"
	class={cn('text-sm font-semibold tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</legend>
