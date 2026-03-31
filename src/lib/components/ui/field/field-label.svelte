<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Props = HTMLLabelAttributes & {
		children?: Snippet;
		class?: string;
		ref?: HTMLLabelElement | null;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<label
	bind:this={ref}
	data-slot="field-label"
	class={cn('text-sm font-medium leading-none', className)}
	{...restProps}
>
	{@render children?.()}
</label>
