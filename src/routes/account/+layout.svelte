<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth/client';
	import { redirect } from '@sveltejs/kit';

	const { children } = $props();
</script>

<div class="flex flex-col px-2 md:flex-row md:px-8">
	<nav class="rounded-box bg-base-200 p-4 md:p-8">
		<ul class="flex flex-col gap-4 text-lg text-base-content md:text-xl">
			<li>
				<a class="flex items-center gap-2" href="/account">
					<i class="fa-solid fa-user"></i>
					Overview</a
				>
			</li>
			<li>
				<a class="flex items-center gap-2" href="/account/edit"
					><i class="fa-solid fa-pencil"></i>Edit</a
				>
			</li>
			<li>
				<a class="flex items-center gap-2" href="/account/billing"
					><i class="fa-solid fa-file-invoice-dollar"></i>Billing</a
				>
			</li>
			<li>
				<button
					onclick={async () => {
						await authClient(page.url.origin).signOut();
						location.reload();
					}}
					class="flex items-center gap-2 text-error"
					><i class="fa-solid fa-right-from-bracket"></i>Log out</button
				>
			</li>
		</ul>
	</nav>
	<section class="rounded-box p-4 md:p-8">
		{@render children()}
	</section>
</div>
