<script>
	import EventDemo from '$lib/components/EventDemo.svelte';
</script>

<svelte:head>
	<title>Zenith - Features</title>
</svelte:head>

<h1 class="heading-super-big mb-8 text-center">Features</h1>
<EventDemo />
<section class="prose-h1:heading-main prose-h2:heading-sub prose mx-auto my-16">
	<h2 id="ai-features">AI Features</h2>
	<p>
		Since I feel uncomfortable using AI for <strong>EVERYTHING</strong>, I narrowed it down to just
		use it for <strong>Event Generation</strong>. The AI will understand what you are saying and
		convert it to a full event with all properties.
	</p>
	<p>
		Why? Because I think clicking through menus after menus is very tedious and has a lot of
		friction. Just having one text field is much more convenient and with the understanding
		capabilities of <strong>GPT-4o</strong> the task or event will be generated. To not skyrocket my
		OpenAI bill, I have set the amount of requests to 10 per hour.
	</p>
	<p>
		Right now, this is the only AI-powered feature, but I am planning to add recommendations for
		when you want to add an event to a project, but that has to wait for a future release.
	</p>
	<h2 id="projects">Projects</h2>
	<p>
		In Zenith, you have the ability to organize your events into projects. In a future iteration you
		will be able to share them with other users. Projects consist of a title and an optional
		deadline.
	</p>
	<h2 id="pricing">Pricing</h2>
	<p>
		Since using AI and storing Data somewhere isn't free, especially not at scale, you have to
		purchase this product for <strong>$20</strong> to use all of it's features. It is a one-time
		purchase with no subscription tied to it and you have full access to all features. Your payment
		is securely processed with
		<strong>Stripe</strong>. You can pay with every popular credit card, as well as with
		<strong>Apple Pay</strong> and <strong>Google Pay</strong>.
	</p>
	<p>
		Suggest a feature? Hit me up at <a href="mailto:contact@nevillebrem.com"
			>contact@nevillebrem.com</a
		>
	</p>
</section>
