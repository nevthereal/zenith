<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { authClient, getActiveSubscription } from '$lib/auth/client.js';
	import Loading from '$lib/components/Loading.svelte';

	const { data } = $props();
	const user = data.user;
</script>

<svelte:head>
	<title>Account - Billing</title>
</svelte:head>

<section class="space-y-4">
	<h1 class="heading-main">Billing</h1>

	<div class="text-lg">
		{#await getActiveSubscription(page.url.origin)}
			<Loading text="subscription data" />
		{:then subscription}
			{#if subscription}
				<h1 class="heading-small mb-2">Your account is paid.</h1>
				<p>
					<a href="mailto:support@zenithproductivity.app" class="link">Contact me</a> for more information.
				</p>
			{/if}
			{#if !subscription}
				{#if user.emailVerified}
					<p class="mb-2 text-warning">
						Please purchase the product to use the features of this app.
					</p>
					<div class="flex items-center gap-4">
						<button
							data-umami-event={!dev ? 'purchase' : null}
							class="btn btn-warning"
							onclick={() =>
								authClient(page.url.origin).subscription.upgrade({
									plan: 'pro',
									successUrl: `${page.url.origin}`,
									cancelUrl: `${page.url.origin}/account/billing`
								})}>Purchase ($20)</button
						>
					</div>
				{:else}
					<a href="/account/email" class="link link-warning"
						>Verify your email to purchase the product.</a
					>
				{/if}
			{/if}
		{/await}
	</div>
</section>
