<script>
	import { page } from '$app/stores';
</script>

<div class="text-center">
	<h1 class="account-title mt-8">Something went wrong</h1>
	<p class="my-4 text-lg font-medium text-error">{$page.status}: {$page.error?.message}</p>
	<a class="btn btn-primary" href="/projects">Back to projects</a>
</div>
