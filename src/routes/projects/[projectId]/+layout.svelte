<script lang="ts">
	let { children } = $props();
</script>

<div class="flex p-4">
	<a class="mr-auto flex items-center gap-2 font-medium md:text-xl" href="/projects"
		><i class="fa-solid fa-arrow-left"></i><span>All projects</span></a
	>
</div>
<section class="p-4">
	{@render children()}
</section>
