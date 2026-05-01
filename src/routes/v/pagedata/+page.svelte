<script lang="ts">
    // Svelte 5 写法：直接从 $props 拿 data
    let { data } = $props();
</script>




<h1>你好，{data.user}！</h1>
<p>你的状态是：<span style="color: green;">{data.status}</span></p>
<p>你的今日幸运数字是：<strong>{data.luckyNumber}</strong></p>

<button class="btn btn-primary" onclick={() => location.reload()}>刷新试试（数字会变）</button>

<br>
<pre>**`+page.server.js` 负责在服务器端加载数据
`load()` 函数返回数据
`+page.svelte` 通过 `data` 属性接收并展示**

这就是 SvelteKit **页面数据加载**的完整流程 ✅</pre>