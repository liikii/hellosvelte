<script lang="ts">
    import Counter from './Counter.svelte';
    
	let count = $state(0);

	function increment() {
		// TODO implement
		count += 19;
	}
    let numbers = $state([1, 2, 3, 4]);

	function addNumber() {
		// TODO implement
		numbers[numbers.length] = 5;
		// numbers.push(5);
	}
</script>

<button class="btn btn-primary" onclick={increment}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>


<p>{numbers.join(' + ')} = ...</p>

<button class="btn btn-primary" onclick={addNumber}>
	Add a number
</button>


<h2 class="text-primary">global state</h2>
<Counter />
<Counter />
<Counter />
