<script>
	import { counter } from './shared.svelte.ts';
</script>

<button class="btn btn-primary" onclick={() => counter.count += 1}>
	clicks: {counter.count}
</button>
