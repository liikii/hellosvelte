<script>
	let { message } = $props();
</script>

<!-- svelte-ignore a11y_distracting_elements -->
<marquee>
	<h1>{message}</h1>
</marquee>

<style>
	marquee {
		font-family: 'Comic Sans MS';
		color: #e60073;
	}
</style>
