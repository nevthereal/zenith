<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth/client.js';

	const { data } = $props();
	const user = data.user;

	const { subscription } = $derived(data);
</script>

<svelte:head>
	<title>Account - Billing</title>
</svelte:head>

<section class="space-y-4">
	<h1 class="heading-main">Billing</h1>

	<div class="text-lg">
		{#if subscription}
			<h1 class="heading-small mb-2">Your account is paid.</h1>
			<p>
				Subscribed since <span class="text-primary"
					>{Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(subscription.periodStart)}</span
				>
			</p>
			<p>
				Your Stripe ID:
				<span class="font-mono italic text-primary">{subscription.stripeCustomerId}</span>
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
						onclick={async () => {
							try {
								await authClient(page.url.origin).subscription.upgrade({
									plan: 'pro',
									successUrl: `${page.url.origin}`,
									cancelUrl: `${page.url.origin}/account/billing`
								});
							} catch (error) {
								console.log(error);
							}
						}}>Purchase ($20)</button
					>
				</div>
			{:else}
				<a href="/account/email" class="link link-warning"
					>Verify your email to purchase the product.</a
				>
			{/if}
		{/if}
	</div>
</section>
