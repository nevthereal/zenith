<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';

	const { data } = $props();
	const user = data.user;
</script>

<svelte:head>
	<title>Account - Billing</title>
</svelte:head>

<section class="space-y-4">
	<h1 class="heading-main">Billing</h1>

	<div class="text-lg">
		{#if user.paid}
			<h1 class="heading-small mb-2">Your account is paid.</h1>
			<p>
				<a href="mailto:contact@nevillebrem.com" class="link">Contact me</a> for more information.
			</p>
		{/if}
		{#if !user.paid}
			{#if user.emailVerified}
				<p class="mb-2 text-warning">
					Please purchase the product to use the features of this app.
				</p>
				<div class="flex items-center gap-4">
					<a href="/api/stripe" class="btn btn-warning">Purchase ($20)</a>
				</div>
			{:else}
				<a href="/account/email" class="link link-warning"
					>Verify your email to purchase the product.</a
				>
			{/if}
		{/if}
	</div>
</section>
