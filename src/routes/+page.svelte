<script lang="ts">
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';

	export let data: PageServerData;

	const { form } = superForm(data.form);
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-16 text-5xl font-bold">What are you up to?</h1>
	<form method="POST" class="flex items-center gap-4">
		<input
			class="input input-bordered input-primary border-2"
			type="text"
			placeholder="Event or Task"
			name="task"
			bind:value={$form.task}
		/>
		<button class="btn btn-primary">Add!</button>
	</form>
</div>
