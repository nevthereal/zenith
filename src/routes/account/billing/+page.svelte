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
		<div class="flex flex-col gap-1 md:gap-2">
			<p class="font-medium text-success">Your account is paid</p>
			<p><span class="font-medium">Customer ID:</span> <span>{order.customerId}</span></p>
			<p><span class="font-medium">Order ID:</span> <span>{order.orderId}</span></p>
			<p>
				<span class="font-medium">Completed:</span>
				<span>{dayjs(order.completedAt).format('D MMMM YYYY, hh:mm')}</span>
			</p>
			<p>
				<span class="font-medium">Invoice:</span>
				<span><a href={order.invoiceUrl} class="link">Invoice URL</a></span>
			</p>
			<p>
				<span class="font-medium">For support contact:</span>
				<a target="_blank" href="mailto:contact@nevillebrem.com" class="link"
					>contact@nevillebrem.com</a
				>
			</p>
		</div>
	{:else}
		<p class="mb-2 text-warning">Please purchase the product to use the features of this app.</p>
		<form action="/?/purchase" method="post">
			<button class="btn btn-warning">Purchase ($20)</button>
		</form>
	{/if}
</div>
