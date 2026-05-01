<script lang="ts">
	import TodoList from './TodoList.svelte';

    interface Todo {
        id: number;
        done: boolean;
        description: string;
    }

	const todos = $state<Todo[]>([
		{ id: 1, done: false, description: 'write some docs' },
		{ id: 2, done: false, description: 'start writing blog post' },
		{ id: 3, done: true, description: 'buy some milk' },
		{ id: 4, done: false, description: 'mow the lawn' },
		{ id: 5, done: false, description: 'feed the turtle' },
		{ id: 6, done: false, description: 'fix some bugs' }
	]);

	let uid = todos.length + 1;

	function remove(todo: Todo) {
		const index = todos.indexOf(todo);
		todos.splice(index, 1);
	}
</script>

<h3>animations transitions</h3>
<pre>
	animations
动画加参数animate:flip={{ duration: 1000 }}
App.svelte</pre>

<div class="board">
	<input
		placeholder="what needs to be done?"
		onkeydown={(e) => {
			if (e.key !== 'Enter') return;

			todos.push({
				id: uid++,
				done: false,
				description: e.currentTarget.value
			});

			e.currentTarget.value = '';
		}}
	/>

	<div class="todo">
		<h2>todo</h2>
		<TodoList todos={todos.filter((t) => !t.done)} {remove} />
	</div>

	<div class="done">
		<h2>done</h2>
		<TodoList todos={todos.filter((t) => t.done)} {remove} />
	</div>
</div>
