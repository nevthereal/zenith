<script lang="ts">
	let { username, code }: { username: string; code: number } = $props();
</script>

<h2 class="mb-4 text-xl">Hello, {username}</h2>
<p>Your verification code for Zenith is: <strong>{code}</strong>.</p>
<p>
	Make sure <strong>NOT</strong> to share this code with anyone. <br />
	Verify it <a href="https://zenithproductivity.app/account/email/verify">here</a>.
</p>
<p>
	Have fun using the app, <br />
	best, Nev
</p>
