<script>
	import { page } from '$app/stores';
</script>

<div class="text-center">
	<h1 class="heading-main mt-8">Something went wrong</h1>
	<p class="my-4 text-lg font-medium text-error">{$page.status}: {$page.error?.message}</p>
	<a class="btn btn-primary" href="/">Back to home</a>
</div>
