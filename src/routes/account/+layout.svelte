<script lang="ts">
	import { CircleUser, HandCoins, Menu, Pencil } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content mb-8 rounded-2xl bg-base-200 p-4 md:p-16">
		<!-- Page content here -->
		<label
			for="my-drawer-2"
			class="drawer-button fixed -left-3 top-1/2 -translate-y-1/2 rotate-90 rounded-t-lg bg-base-200 p-2 text-xl font-bold lg:absolute lg:hidden"
			aria-label="open sidebar">Menu</label
		>
		{@render children()}
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul
			class="menu min-h-full w-min rounded-r-2xl bg-base-100 p-4 text-xl text-base-content md:rounded-r-none"
		>
			<!-- Sidebar content here -->
			<li><a href="/account"><CircleUser /> Overview</a></li>
			<li><a href="/account/edit"><Pencil /> Edit</a></li>
			<li><a href="/account/billing"><HandCoins /> Billing</a></li>
			<li>
				<form action="/account/?/signout" method="post">
					<button class="text-error">Log out</button>
				</form>
			</li>
		</ul>
	</div>
</div>
