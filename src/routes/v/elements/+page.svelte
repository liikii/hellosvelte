<script lang="ts">
	let key = $state();
	let keyCode = $state();

	function onkeydown(event: KeyboardEvent) {
        console.log(event);
		key = event.key;
		keyCode = event.code;
	}
</script>

<svelte:window {onkeydown}/>

<div style="text-align: center">
	{#if key}
		<kbd>{key === ' ' ? 'Space' : key}</kbd>
		<p>{keyCode}</p>
	{:else}
		<p>Focus this window and press any key</p>
	{/if}
</div>
