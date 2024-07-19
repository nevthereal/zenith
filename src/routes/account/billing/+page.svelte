<script lang="ts">
	import dayjs from 'dayjs';

	const { data } = $props();
	const user = data.user;
	const order = data.order;
</script>

<svelte:head>
	<title>Account - Billing</title>
</svelte:head>

<h1 class="account-title">Billing</h1>

<div class="text-lg">
	{#if user.paid && order}
		<ul class="flex flex-col gap-1 text-base md:text-lg">
			<li class="font-medium text-success">Your account is paid</li>
			<li>
				<span class="font-medium">Customer ID:</span>
				<span class="text-base-content/80">{order.customerId}</span>
			</li>
			<li>
				<span class="font-medium">Order ID:</span>
				<span class="text-base-content/80">{order.orderId}</span>
			</li>
			<li>
				<span class="font-medium">Completed:</span>
				<span class="text-base-content/80"
					>{dayjs(order.completedAt).format('D MMMM YYYY, hh:mm')}</span
				>
			</li>
			<li>
				<span class="font-medium">Invoice:</span>
				<a href={order.invoiceUrl} class="link link-primary">Invoice URL</a>
			</li>
			<li>
				<span class="font-medium">For support contact:</span>
				<a target="_blank" href="mailto:contact@nevillebrem.com" class="link link-primary"
					>contact@nevillebrem.com</a
				>
			</li>
		</ul>
	{:else}
		<p class="mb-2 text-warning">Please purchase the product to use the features of this app.</p>
		<form action="/?/purchase" method="post">
			<button class="btn btn-warning">Purchase ($20)</button>
		</form>
	{/if}
</div>
