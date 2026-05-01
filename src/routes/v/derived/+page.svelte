<script lang="ts">
	let numbers = $state([1, 2, 3, 4]);
    let total = $derived(numbers.reduce((acc, cur) => acc + cur, 0));
	function addNumber() {
		numbers.push(numbers.length + 1);
	}
    
    function removeNumber() {
        numbers.pop();
    };

    $inspect(numbers).with(console.log);

</script>

<h2 class="text-primary">Derived State, inspect state</h2>

<p>{numbers.length > 0 ? numbers.join(' + ') : '0'} = {total}</p>

<button class="btn btn-primary" onclick={addNumber}>
	Add a number
</button>

<button class="btn btn-primary" onclick={removeNumber}>
    Remove a number
</button>
