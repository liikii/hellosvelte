<script>
    let { data, children } = $props(); // 接收 data 和 子页面内容
</script>

<nav style="background: #eee; padding: 1rem;">
    <strong>{data.siteName}</strong> | 欢迎，{data.user.name} ({data.user.role})
</nav>

<main style="padding: 1rem;">
    {@render children()} <!-- 这里显示子页面的内容 -->
</main>
