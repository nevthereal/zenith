<script lang="ts">
	const { children } = $props();
</script>

<div class="flex flex-col px-2 md:flex-row md:px-8">
	<nav class="rounded-box bg-base-200 p-4 md:p-8">
		<ul class="flex flex-col gap-4 text-lg text-base-content md:text-xl">
			<li>
				<a class="flex items-center gap-2" href="/account">
					<i class="iconoir-user before:text-2xl"></i>
					Overview</a
				>
			</li>
			<li>
				<a class="flex items-center gap-2" href="/account/edit"
					><i class="iconoir-edit-pencil before:text-2xl"></i>Edit</a
				>
			</li>
			<li>
				<a class="flex items-center gap-2" href="/account/billing"
					><i class="iconoir-coins before:text-2xl"></i>Billing</a
				>
			</li>
			<li>
				<form action="/account/?/signout" method="post">
					<button class="flex items-center gap-2 text-error"
						><i class="iconoir-log-out before:text-2xl"></i>Log out</button
					>
				</form>
			</li>
		</ul>
	</nav>
	<section class="rounded-box p-4 md:p-8">
		{@render children()}
	</section>
</div>
