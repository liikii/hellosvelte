<script lang="ts">
	let mouse = $state({ x: 0, y: 0 });
</script>

<svelte:window
	onmousemove={(e) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}}
/>

<p>{mouse.x}x{mouse.y}</p>

<button onclick={() => mouse = null as any}>
	whatever you do, don't click this button
</button>
