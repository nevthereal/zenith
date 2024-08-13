<script lang="ts">
	import Spinner from './Spinner.svelte';

	let { text }: { text: string } = $props();
</script>

<p class="font-mono">Loading {text}...</p>
