<script lang="ts">
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms';

	export let data: PageServerData;

	const { form } = superForm(data.form);
</script>

<form method="POST" class="flex w-[50vw] flex-col">
	<label for="task">Task:</label>
	<input class="rounded-2xl border-2 p-2" type="text" name="task" bind:value={$form.task} />
</form>

<div class="rounded-2xl border-2 p-4">
	<h1 class="mb-2">Task name</h1>
	<p>Date</p>
</div>
