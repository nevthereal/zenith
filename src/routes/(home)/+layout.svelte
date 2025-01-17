<script lang="ts">
	let { children } = $props();
</script>

{@render children()}
<footer class="text-center font-bold">
	© {new Date().getFullYear()} <a href="https://nevillebrem.com" class="link">Neville Brem</a>
</footer>
