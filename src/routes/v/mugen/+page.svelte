<script lang="ts">
    import { onMount } from "svelte";
    import MugenTable from "./MugenTable.svelte";

    interface TestCase {
        case_name: string;
        case_id: string;
    }

    interface TestSuite {
        suite_name: string;
        suite_id: string;
        suite_cases: TestCase[];
    }

    // 状态管理
    let suiteData = $state<TestSuite[]>([]);
    let totalCount = $state(0);
    let currentPage = $state(1);
    let pageSize = 10;
    let loading = $state(true);

    // 异步获取数据
    async function fetchData(page: number) {
        loading = true;
        try {
            // 模拟 API 调用，实际请替换为 fetch(`/api/mugen?page=${page}&size=${pageSize}`)
            const response = await fetch(
                `http://127.0.0.1:3000/mugen?page=${page}`,
            );
            const data = await response.json();

            suiteData = data.suite_data;
            totalCount = data.total_count;
        } catch (e) {
            console.error("加载失败", e);
        } finally {
            loading = false;
        }
    }

    // 分页点击
    function changePage(newPage: number) {
        if (newPage < 1 || newPage > Math.ceil(totalCount / pageSize)) return;
        currentPage = newPage;
        fetchData(currentPage);
    }

    onMount(() => fetchData(currentPage));

    // 计算总页数
    let totalPages = $derived(Math.ceil(totalCount / pageSize));

    // 计算要显示的页码数组 (核心逻辑)
    let visiblePages = $derived(() => {
        let pages = [];
        let start = Math.max(1, currentPage - 3);
        let end = Math.min(totalPages, currentPage + 3);

        // 边界补齐：如果前面不足3个，向后借
        if (currentPage <= 3) {
            end = Math.min(totalPages, 7);
        }
        // 边界补齐：如果后面不足3个，向前借
        if (currentPage > totalPages - 3) {
            start = Math.max(1, totalPages - 6);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    function goToPage(p: number) {
        if (p >= 1 && p <= totalPages) {
            currentPage = p;
            fetchData(p); // 重新请求后端
        }
    }
</script>

<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary mb-0">Mugen Test Explorer</h2>
        <span class="badge bg-secondary">Total: {totalCount} Suites</span>
    </div>

    {#if loading}
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Loading test suites...</p>
        </div>
    {:else}
        <MugenTable {suiteData} />

        <!-- Bootstrap 分页组件 -->

        <!-- 分页 UI -->
        <nav class="mt-4">
            <ul class="pagination justify-content-center shadow-sm">
                <!-- 首页 & 上一页 -->
                <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                    <button class="page-link" onclick={() => goToPage(1)}
                        >«</button
                    >
                </li>
                <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                    <button
                        class="page-link"
                        onclick={() => goToPage(currentPage - 1)}>Prev</button
                    >
                </li>

                <!-- 动态页码 -->
                {#each visiblePages() as page}
                    <li
                        class="page-item {currentPage === page ? 'active' : ''}"
                    >
                        <button
                            class="page-link"
                            onclick={() => goToPage(page)}
                        >
                            {page}
                        </button>
                    </li>
                {/each}

                <!-- 下一页 & 尾页 -->
                <li
                    class="page-item {currentPage === totalPages
                        ? 'disabled'
                        : ''}"
                >
                    <button
                        class="page-link"
                        onclick={() => goToPage(currentPage + 1)}>Next</button
                    >
                </li>
                <li
                    class="page-item {currentPage === totalPages
                        ? 'disabled'
                        : ''}"
                >
                    <button
                        class="page-link"
                        onclick={() => goToPage(totalPages)}>»</button
                    >
                </li>
            </ul>
        </nav>
    {/if}
</div>

<style>
    :global(body) {
        background-color: #f8f9fa;
    }
    /* 优化点击体验 */
  .page-link {
    cursor: pointer;
    min-width: 45px;
    text-align: center;
    border: none;
    color: #555;
    margin: 0 2px;
    border-radius: 6px !important;
  }
  .page-item.active .page-link {
    background-color: var(--bs-primary);
    color: white;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
  }

</style>
