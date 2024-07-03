<script lang="ts">
	import dayjs from 'dayjs';
	import Stripe from 'stripe';
	import wretch from 'wretch';

	const { data } = $props();
	const user = data.user;
	const order = data.order;
</script>

<h1 class="mb-4 text-5xl font-bold tracking-tighter">Billing</h1>

<div class="text-lg">
	{#if user.paid && order}
		<p>Your account is paid</p>
		<table class="table my-6 prose-th:font-bold">
			<tbody>
				<tr>
					<th>Customer ID:</th>
					<td>{order.customerId}</td>
				</tr>
				<tr>
					<th>Order ID:</th>
					<td>{order.orderId}</td>
				</tr>
				<tr>
					<th>Completed:</th>
					<td>{dayjs(order.completedAt).format('D MMMM YYYY, hh:mm')}</td>
				</tr>
				<tr>
					<th>Invoice</th>
					<td><a href={order.invoiceUrl} class="link">Invoice URL</a></td>
				</tr>
			</tbody>
		</table>
		<p>
			For support contact: <a target="_blank" href="mailto:contact@nevillebrem.com" class="link"
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
