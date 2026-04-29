<script lang="ts">
	import { send, receive } from './transition.js';
	let { todos, remove } = $props();
	
</script>

<ul class="todos">
	{#each todos as todo (todo.id)}
		<li
			class={{ done: todo.done }}
				in:receive={{ key: todo.id }}
	out:send={{ key: todo.id }}
		>
			<label>
				<input type="checkbox" bind:checked={todo.done}/>
				<span>{todo.description}</span>
				<button onclick={() => remove(todo)} aria-label="Remove"></button>
			</label>
		</li>
	{/each}
</ul>
