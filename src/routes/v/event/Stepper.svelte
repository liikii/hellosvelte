<script>
	let {increment, decrement} = $props();
</script>

<button class="btn btn-primary" onclick={decrement}>-1</button>
<button class="btn btn-primary" onclick={increment}>+1</button>
