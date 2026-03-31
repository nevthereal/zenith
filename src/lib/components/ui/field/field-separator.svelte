<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		ref?: HTMLDivElement | null;
	};

	let { ref = $bindable(null), class: className, ...restProps }: Props = $props();
</script>

<div
	bind:this={ref}
	aria-hidden="true"
	data-slot="field-separator"
	class={cn('h-px w-full bg-base-content/10', className)}
	{...restProps}
></div>
