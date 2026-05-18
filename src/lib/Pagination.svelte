<script lang="ts">
  /**
   * 通用分页组件 (Svelte 5)
   */
  let { 
    total = 0, 
    limit = 10, 
    current = 1, 
    onPageChange 
  } = $props<{
    total: number;       // 总条数
    limit: number;       // 每页条数
    current: number;     // 当前页码
    onPageChange: (page: number) => void; // 页码改变回调
  }>();

  // 计算总页数
  let totalPages = $derived(Math.ceil(total / limit) || 1);

  // 计算显示的页码范围（当前页居中，前后各3个）
  let visiblePages = $derived(() => {
    let pages = [];
    let start = Math.max(1, current - 3);
    let end = Math.min(totalPages, current + 3);

    if (current <= 3) end = Math.min(totalPages, 7);
    if (current > totalPages - 3) start = Math.max(1, totalPages - 6);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });
</script>

<nav class="mt-4">
  <ul class="pagination justify-content-center shadow-sm">
    <!-- 首页 -->
    <li class="page-item {current === 1 ? 'disabled' : ''}">
      <button class="page-link shadow-none" onclick={() => onPageChange(1)} title="首页">«</button>
    </li>

    <!-- 上一页 -->
    <li class="page-item {current === 1 ? 'disabled' : ''}">
      <button class="page-link shadow-none" onclick={() => onPageChange(current - 1)}>Prev</button>
    </li>

    <!-- 动态页码 -->
    {#each visiblePages() as page}
      <li class="page-item {current === page ? 'active' : ''}">
        <button class="page-link shadow-none" onclick={() => onPageChange(page)}>
          {page}
        </button>
      </li>
    {/each}

    <!-- 下一页 -->
    <li class="page-item {current === totalPages ? 'disabled' : ''}">
      <button class="page-link shadow-none" onclick={() => onPageChange(current + 1)}>Next</button>
    </li>

    <!-- 尾页 -->
    <li class="page-item {current === totalPages ? 'disabled' : ''}">
      <button class="page-link shadow-none" onclick={() => onPageChange(totalPages)} title="尾页">»</button>
    </li>
  </ul>
</nav>

<style>
  .page-link {
    cursor: pointer;
    min-width: 42px;
    text-align: center;
    color: #555;
    border: 1px solid #dee2e6;
    margin: 0 2px;
    border-radius: 6px !important;
    transition: all 0.2s ease-in-out;
  }

  .page-item.active .page-link {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
    color: white;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
  }

  .page-item.disabled .page-link {
    background-color: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
  }

  .page-link:hover:not(.active):not(.disabled) {
    background-color: #eee;
    color: #000;
  }
</style>
