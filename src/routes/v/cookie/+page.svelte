<script lang="ts">
    let { data } = $props();
</script>

<div class="p-4">
    <h1>Cookie 演示</h1>
    <p>你刷新这个页面的次数是：<strong>{data.count}</strong></p>
    <p><small>（关闭浏览器再打开，数字依然会在基础上增加）</small></p>
    
    <button onclick={() => location.reload()}>刷新页面</button>
</div>
