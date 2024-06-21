<script lang="ts">
	import type Stripe from 'stripe';

	const { data } = $props();

	const session = data.session;

	const invoice = session.invoice as Stripe.Invoice;
</script>

{#if !session}
	<p>Session not found</p>
{:else}
	<div class="text-center">
		<h1 class="mb-8 text-3xl font-bold md:text-5xl">Thank you for your order!</h1>
		<div class="flex flex-col">
			<h1 class="mb-2 text-xl font-medium">Order details:</h1>
			<table class="table mx-auto max-w-[80vw] text-left">
				<tbody>
					<tr>
						<th class="font-bold">Session ID:</th>
						<td>{session.id}</td>
					</tr>
					<tr>
						<th class="font-bold">Email:</th>
						<td>{invoice.customer_email}</td>
					</tr>
					<tr>
						<th class="font-bold">Subtotal:</th>
						<td>${session.amount_subtotal! / 100}</td>
					</tr>
					<tr>
						<th class="font-bold">Total (with taxes and coupon codes):</th>
						<td>${session.amount_total! / 100}</td>
					</tr>
				</tbody>
			</table>
			<a href={invoice.hosted_invoice_url} target="_blank" class="link link-primary mx-auto mt-4"
				>See your invoice</a
			>
		</div>
	</div>
{/if}
