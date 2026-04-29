<script lang="ts">
	import FlakyComponent from './FlakyComponent.svelte';
</script>


<pre>svelte:boundary 错误边界：捕获子组件崩溃 → 显示降级 UI → 支持重置，保护应用不整体挂掉。</pre>


<!-- <FlakyComponent /> -->
<svelte:boundary onerror={(e) => console.error(e)}>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<p>Oops! {(error as Error).message}</p>
		<button onclick={reset}>Reset</button>
	{/snippet}
</svelte:boundary>
