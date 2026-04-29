<script lang="ts">
	let todos = $state([
		{ done: false, text: 'finish Svelte tutorial' },
		{ done: false, text: 'build an app' },
		{ done: false, text: 'world domination' }
	]);

	function add() {
		todos.push({
			done: false,
			text: ''
		});
	}

	function clear() {
		todos = todos.filter((t) => !t.done);
	}

	let remaining = $derived(todos.filter((t) => !t.done).length);
</script>

<h3> binding html tag attribute example</h3>

<div class="centered">
	<h1>todos</h1>

	<ul class="todos">
		{#each todos as todo}
			<li class={{ done: todo.done }}>
				<input
					type="checkbox"
					bind:checked={todo.done}
				/>

				<input
					type="text"
					placeholder="What needs to be done?"
					bind:value={todo.text}
				/>
			</li>
		{/each}
	</ul>

	<p>{remaining} remaining</p>

	<button onclick={add}>
		Add new
	</button>

	<button onclick={clear}>
		Clear completed
	</button>
</div>