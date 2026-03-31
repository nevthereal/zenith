<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Props = HTMLAttributes<HTMLParagraphElement> & {
		children?: Snippet;
		class?: string;
		ref?: HTMLParagraphElement | null;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<p
	bind:this={ref}
	data-slot="field-error"
	class={cn('text-sm font-medium text-error', className)}
	{...restProps}
>
	{@render children?.()}
</p>
