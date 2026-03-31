<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Props = HTMLAttributes<HTMLFieldSetElement> & {
		children?: Snippet;
		class?: string;
		ref?: HTMLFieldSetElement | null;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<fieldset
	bind:this={ref}
	data-slot="field-set"
	class={cn('flex min-w-0 flex-col gap-4', className)}
	{...restProps}
>
	{@render children?.()}
</fieldset>
