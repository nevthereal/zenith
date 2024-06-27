<script lang="ts">
	import wretch from 'wretch';

	const { data } = $props();
	const user = data.user;
</script>

<h1 class="mb-4 text-5xl font-bold tracking-tighter">Billing</h1>

<div class="text-lg">
	{#if user.paid}
		<p>Your account is paid</p>
		<p>Your stripe ID: {user.stripeId}</p>
		<p>
			For support contact: <a href="mailto:contact@nevillebrem.com" class="link"
				>contact@nevillebrem.com</a
			>
		</p>
	{:else}
		<p class="mb-2">Please purchase the product to use the features of this app.</p>
		<button
			class="btn btn-warning"
			onclick={async () =>
				wretch('/api/stripe/purchase')
					.post()
					.json((json) => {
						return window.location.replace(json.url);
					})}>Purchase ($10)</button
		>
	{/if}
</div>
