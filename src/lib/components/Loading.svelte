<script lang="ts">
	import Spinner from './Spinner.svelte';

	let { text }: { text: string } = $props();
</script>

<p><Spinner /><span class="font-mono">Loading {text}...</span></p>
