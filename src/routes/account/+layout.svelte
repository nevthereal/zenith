<script lang="ts">
	import { CircleUser, HandCoins, LogOut, Pencil } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="flex flex-col px-2 md:flex-row md:px-8">
	<nav class="p-4 md:p-8">
		<ul class="flex flex-col gap-4 text-lg text-base-content md:text-xl">
			<li><a class="flex items-center gap-2" href="/account"><CircleUser />Overview</a></li>
			<li><a class="flex items-center gap-2" href="/account/edit"><Pencil />Edit</a></li>
			<li><a class="flex items-center gap-2" href="/account/billing"><HandCoins />Billing</a></li>
			<li>
				<form action="/account/?/signout" method="post">
					<button class="flex items-center gap-2 text-error"><LogOut />Log out</button>
				</form>
			</li>
		</ul>
	</nav>
	<section class="rounded-box p-4 md:p-8">
		{@render children()}
	</section>
</div>
