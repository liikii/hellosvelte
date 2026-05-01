<script lang="ts">
    let isInside = $state(false);
    const options = ["h1", "h2", "h3", "p", "marquee"];
    let selected = $state(options[0]);
</script>

<!-- 监听鼠标进入和离开整个 body 区域 -->
<svelte:body
    on:mouseenter={() => (isInside = true)}
    on:mouseleave={() => (isInside = false)}
/>

<pre>
### svelte:body
onmouseenter=
onmouseleave=
### svelte:head
### svelte:element
</pre>

<div>
    {#if isInside}
        <p>✅ 鼠标在页面内</p>
    {:else}
        <p>❌ 鼠标跑出去啦！</p>
    {/if}
</div>


<select bind:value={selected}>
	{#each options as option}
		<option value={option}>{option}</option>
	{/each}
</select>

<!-- {#if selected === 'h1'}
	<h1>I'm a <code>&lt;h1&gt;</code> element</h1>
{:else}
	<p>TODO others</p>
{/if} -->

<svelte:element this={selected}>
	I'm a <code>{selected}</code> element
</svelte:element>
