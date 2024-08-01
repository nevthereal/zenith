<script lang="ts">
	import Spinner from './Spinner.svelte';

	let { text }: { text: string } = $props();
</script>

<span class="font-mono"><Spinner /> Loading {text}...</span>
