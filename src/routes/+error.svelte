<script>
	import { page } from '$app/state';
</script>

<div class="text-center">
	<h1 class="heading-main mb-4 mt-8">Something went wrong</h1>
	<p class="my-4 text-lg font-medium text-error">
		{page.status}: {page.error?.message}
		{#if page.error}
			<i class="fa-solid fa-triangle-exclamation"></i>
		{/if}
	</p>
	<a class="btn btn-primary" href="/">Back to home</a>
</div>
