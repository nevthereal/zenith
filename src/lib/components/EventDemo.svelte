<script lang="ts">
	import dayjs from 'dayjs';
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<p class="heading-small select-none">
		"<span class="bg-primary/50">Dinner with Stacy</span>
		<span class="bg-secondary/50">tomorrow</span> at <span class="bg-secondary/50">6PM</span>"
	</p>
	<i class="fa-solid fa-arrow-down text-2xl text-secondary"></i>
	<div class="flex flex-row justify-between gap-4 rounded-box bg-base-200 p-8 text-left">
		<div>
			<h1 class="heading-sub mb-2">Dinner with Stacy</h1>
			<div class="text-md md:text-base">
				<p>
					<span>
						{dayjs()
							.add(1, 'day')
							.set('hour', 18)
							.set('minute', 0)
							.set('second', 0)
							.format('D MMMM YYYY, HH:mm')}
					</span>
				</p>
			</div>
		</div>
	</div>
</div>
