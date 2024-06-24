<script lang="ts">
	import { Sparkles, type Icon } from 'lucide-svelte';
	import type { Component } from 'svelte';

	type FeatureCardProps = {
		featureName: string;
		icon: Component<Icon>;
	};
</script>

<section class="prose mx-auto prose-h1:font-black prose-h1:tracking-tighter">
	<h1>Features</h1>
	<p>Before we talk about the actual features themselves, let's talk about</p>
	<h2>Pricing</h2>
	<p>
		Since using AI and storing Data somewhere isn't free, especially not at scale, you can purchase
		this product for <strong>$10</strong>. It is a one-time purchase with no subscription tied to it
		and you have full access to all features.
	</p>
	<h2>AI Features</h2>
	<p>
		Since I feel uncomfortable using AI for <strong>EVERYTHING</strong>, I narrowed it down to just
		use it for <strong>Event Generation</strong>. The AI will understand what you are saying and
		convert it to a full event with all properties assumed.
	</p>
	<p>
		Why? Because I think clicking through menus after menus is very tedious and has a lot of
		friction. Just having one text field is much more convenient and with the good understanding
		capabilites of <em>GPT-4o</em> everything gets done for you.
	</p>
</section>
