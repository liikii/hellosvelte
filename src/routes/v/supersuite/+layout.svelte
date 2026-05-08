<script lang="ts">
  /**
   * Super Suite 模块的通用布局
   * 负责统一背景色和内边距，确保列表页和创建页切换时视觉一致
   */
  let { children } = $props();
</script>

<!-- 
  min-vh-100: 确保背景灰色铺满全屏
  bg-light: 使用 Bootstrap 的浅灰色背景，衬托出白色的 Card
-->
<div class="min-vh-100 bg-light-subtle">
    <main class="py-2">
        <!-- 这里渲染的是 +page.svelte 的内容 -->
        {@render children()}
    </main>
</div>

<style>
    /* 全局背景微调：让它比纯白色稍微深一点点 (#f8f9fa)，增加层次感 */
    :global(body) {
        background-color: #f8f9fa !important;
    }

    /* 统一滚动条样式，让界面更精致 */
    :global(::-webkit-scrollbar) {
        width: 6px;
        height: 6px;
    }
    :global(::-webkit-scrollbar-thumb) {
        background: #ccc;
        border-radius: 10px;
    }
    :global(::-webkit-scrollbar-track) {
        background: transparent;
    }
</style>
