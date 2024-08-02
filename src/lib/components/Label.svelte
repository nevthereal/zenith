<script lang="ts">
	import type { Snippet } from 'svelte';

	let { forAttr, children }: { forAttr: string; children: Snippet } = $props();
</script>

<label for={forAttr} class="text-muted mb-2 text-sm">{@render children()}</label>
