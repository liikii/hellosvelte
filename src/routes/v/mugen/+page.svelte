<script lang="ts">
    import { goto } from "$app/navigation";
    import MugenTable from "./MugenTable.svelte";
    import Pagination from "$lib/Pagination.svelte";

    let { data } = $props();

    // 状态从 data 中派生
    let suiteData = $derived(data.suiteData);
    let totalCount = $derived(data.total);
    let currentPage = $derived(data.currentPage);

    function handlePageChange(page: number) {
        goto(`?page=${page}`);
    }
</script>

<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary mb-0">Mugen Test Explorer</h2>
        <div class="d-flex align-items-center gap-2">
            <span class="badge bg-light text-primary border border-primary border-opacity-25 p-2">
                Total: {totalCount} Suites
            </span>
        </div>
    </div>

    <!-- 数据展示 -->
    {#if suiteData.length > 0}
        <MugenTable {suiteData} />
    {:else}
        <div class="alert alert-info text-center shadow-sm">
            暂无测试套件数据
        </div>
    {/if}

    <!-- 使用刚刚封装的通用分页组件 -->
    <Pagination 
        total={totalCount} 
        limit={data.limit} 
        current={currentPage} 
        onPageChange={handlePageChange} 
    />
</div>

<style>
    :global(body) {
        background-color: #f8f9fa;
    }
</style>
