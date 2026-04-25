<script lang="ts">
    let activeIndex = $state(0);
</script>

{#snippet getnavli(path: string, name: string, index: number)}
<li class="nav-item">
	<a href="/" class="nav-link" aria-current="page" 
		class:active={activeIndex === index} 
		onclick={() => activeIndex = index}>
		{name}
	</a>
</li>
{/snippet}