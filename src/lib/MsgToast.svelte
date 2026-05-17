<script lang="ts">

  // 定义属性（Svelte 5 $props）
  let {
    show = $bindable(false),      // 双向绑定显示状态
    type = 'success',            // 提示类型：success, danger, warning, info
    message = '',                // 提示内容
    autoClose = true,            // 是否自动消失
    duration = 3000              // 自动消失延迟时间（毫秒）
  }: {
    show: boolean;
    type?: 'success' | 'danger' | 'warning' | 'info';
    message: string;
    autoClose?: boolean;
    duration?: number;
  } = $props();

  let timer: any = null;

  // 清理定时器的函数
  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  // 使用 Svelte 5 的 $effect 监听 show 的变化，处理自动关闭逻辑
  $effect(() => {
    if (show && autoClose) {
      clearTimer();
      timer = setTimeout(() => {
        show = false;
      }, duration);
    }
    // Svelte 5 优雅特性：这个返回的闭包会在 show 改变或组件被彻底销毁时自动触发
    return () => clearTimer();
  });

  // 手动关闭按钮
  function closeToast() {
    show = false;
  }
</script>

{#if show}
  <!-- 悬浮容器：固定在屏幕右上角 -->
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
    <div class="toast show align-items-center text-white bg-{type} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        
        <!-- 消息主体 -->
        <div class="toast-body d-flex align-items-center gap-2">
          {#if type === 'success'}
            <span>✅</span>
          {:else if type === 'danger'}
            <span>❌</span>
          {:else if type === 'warning'}
            <span>⚠️</span>
          {:else}
            <span>ℹ️</span>
          {/if}
          <span>{message}</span>
        </div>
        
        <!-- 关闭按钮 -->
        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick={closeToast} aria-label="Close"></button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* 加上一点简单的淡入动画，让过渡更平滑 */
  .toast {
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
