<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { CASE_STATUS, TASK_STATUS } from './status_config';
    import Pagination from "$lib/Pagination.svelte";

    // 接收参数
    let { task, onBack } = $props<{ task: any, onBack: () => void }>();
    let taskId = $derived(task?.id);

    // 数据状态
    let details = $state<any[]>([]);
    let loading = $state(true);
    let order = $state('desc');
    let statusMin = $state('');
    let currentPage = $state(1);
    let totalCount = $state(0);
    const perPage = 20;

    // 日志抽屉状态
    let selectedLog = $state<any>(null);
    let logDrawerElement = $state<HTMLElement>();
    let logDrawerInstance: any;

    // 定时器引用
    let refreshInterval: any;

    // 1. 获取全量分页数据
    async function loadDetail() {
        if (!taskId) return;
        loading = true;
        try {
            const query = new URLSearchParams({
                page: currentPage.toString(),
                per_page: perPage.toString(),
                order_start_time: order
            });
            if (statusMin) {
                query.set('min_status', statusMin);
                query.set('max_status', statusMin);
            }
            const res = await fetch(`/api/test_task/${taskId}?${query.toString()}`);
            const result = await res.json();
            details = result.data || [];
            totalCount = result.total_count || 0;
        } catch (err) {
            console.error("加载详情失败:", err);
        } finally {
            loading = false;
        }
    }

    // 2. 局部轮询函数：只更新当前页非终态的 Case
    async function pollStatus() {
        // 如果任务整体已结束 (2:全成功, 3:有失败, 4:启动失败)，停止轮询
        if ([2, 3, 4].includes(task.status_code)) return;

        // 找出当前页中状态码为 0(not started) 或 1(start) 的 case_id
        const activeIds = details
            .filter(item => [0, 1].includes(item.status_code))
            .map(item => item.case_id);

        if (activeIds.length === 0) return;

        try {
            const res = await fetch('/api/task_case_status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId, case_ids: activeIds })
            });
            const result = await res.json();
            const updates = result.data; // 格式: { "1001": {...} }

            // 响应式更新数组中的特定对象
            details = details.map(item => {
                if (updates[item.case_id]) {
                    return { ...item, ...updates[item.case_id] };
                }
                return item;
            });
        } catch (err) {
            console.warn("局部刷新失败:", err);
        }
    }

    // 监听分页/筛选变化
    $effect(() => {
        if (taskId) loadDetail();
    });

    onMount(async () => {
        // 初始化 Bootstrap 抽屉
        const bootstrap = await import("bootstrap");
        if (logDrawerElement) logDrawerInstance = new bootstrap.Offcanvas(logDrawerElement);

        // 开启 30s 轮询
        refreshInterval = setInterval(pollStatus, 30000);
    });

    onDestroy(() => {
        if (refreshInterval) clearInterval(refreshInterval);
    });

    function handleFilterChange() {
        currentPage = 1;
        loadDetail();
    }

    function openLogDrawer(item: any) {
        selectedLog = item;
        logDrawerInstance.show();
    }

    function copyLog() {
        if (!selectedLog) return;
        navigator.clipboard.writeText(selectedLog.status_desc);
        alert("日志已复制到剪贴板");
    }
</script>

<div class="bg-light p-3 min-vh-100">
    <!-- 头部导航 -->
    <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center">
            <button class="btn btn-white border shadow-sm btn-sm me-3" onclick={onBack}>
                <i class="bi bi-arrow-left"></i> 返回列表
            </button>
            <h4 class="mb-0 fw-bold text-dark">执行报告 <span class="text-muted small">#{taskId}</span></h4>
        </div>
        {#if ![2, 3, 4].includes(task.status_code)}
            <div class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2">
                <span class="spinner-grow spinner-grow-sm me-2" role="status"></span>
                正在实时同步状态 (30s)
            </div>
        {/if}
    </div>

    <!-- 任务概览卡片 -->
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-body bg-white rounded-3 py-3">
            <div class="row align-items-center">
                <div class="col-md-4 border-end">
                    <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">Super Suite</span>
                    <h5 class="fw-bold text-primary mb-0">{task.super_suite_name}</h5>
                </div>
                <div class="col-md-3 border-end">
                    <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">测试主机</span>
                    <div class="fw-semibold text-dark">{task.test_host}</div>
                    <div class="text-muted small">{task.test_host_usr}@{task.test_host}</div>
                </div>
                <div class="col-md-3 border-end">
                    <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">任务状态</span>
                    {#if TASK_STATUS[task.status_code]}
                        <div class="{TASK_STATUS[task.status_code].color} fw-bold">
                            <i class="bi {TASK_STATUS[task.status_code].icon} me-1"></i>
                            {TASK_STATUS[task.status_code].label}
                        </div>
                    {/if}
                </div>
                <div class="col-md-2 text-center">
                    <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">执行人</span>
                    <span class="badge bg-light text-dark border fw-normal">{task.user_name}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 用例执行详情 -->
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-list-check me-2 text-primary"></i>用例执行明细</h6>
            <div class="d-flex gap-2">
                <select class="form-select form-select-sm w-auto shadow-sm" bind:value={statusMin} onchange={handleFilterChange}>
                    <option value="">所有状态</option>
                    {#each Object.entries(CASE_STATUS) as [val, cfg]}
                        <option value={val}>{cfg.label}</option>
                    {/each}
                </select>
                <select class="form-select form-select-sm w-auto shadow-sm" bind:value={order} onchange={handleFilterChange}>
                    <option value="desc">最新开始 ↓</option>
                    <option value="asc">最早开始 ↑</option>
                </select>
            </div>
        </div>

        <div class="card-body p-0 bg-white">
            {#if loading}
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted small">正在同步执行进度...</p>
                </div>
            {:else}
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">ID</th>
                                <th>测试用例</th>
                                <th>执行状态</th>
                                <th>时间跨度</th>
                                <th class="pe-4">结果描述</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each details as item}
                                <tr>
                                    <td class="ps-4 small font-monospace text-secondary">#{item.case_id}</td>
                                    <td>
                                        <div class="fw-bold text-dark">{item.case_name}</div>
                                        <div class="text-muted extra-small">{item.suite_name}</div>
                                    </td>
                                    <td>
                                        <span class="badge {CASE_STATUS[item.status_code]?.color || 'bg-secondary'} px-2 py-1 fw-normal">
                                            {CASE_STATUS[item.status_code]?.label || 'unknown'}
                                        </span>
                                    </td>
                                    <td class="small text-muted">
                                        <div class="text-nowrap"><i class="bi bi-clock me-1"></i> {new Date(item.start_time).toLocaleTimeString()}</div>
                                        <div class="text-nowrap text-opacity-50"><i class="bi bi-arrow-right-short"></i> {item.end_time ? new Date(item.end_time).toLocaleTimeString() : '--:--'}</div>
                                    </td>
                                    <td class="pe-4">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <span class="text-truncate small text-muted" style="max-width: 200px;" title={item.status_desc}>
                                                {item.status_desc.substring(0, 40)}{item.status_desc.length > 40 ? '...' : ''}
                                            </span>
                                            <button class="btn btn-sm btn-link text-primary p-0 text-decoration-none" onclick={() => openLogDrawer(item)}>
                                                详情
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                <tr><td colspan="5" class="text-center py-5 text-muted">该任务下暂无执行记录</td></tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                {#if totalCount > perPage}
                    <div class="p-3 border-top bg-light bg-opacity-10">
                        <Pagination 
                            total={totalCount} 
                            limit={perPage} 
                            current={currentPage} 
                            onPageChange={(p) => currentPage = p} 
                        />
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

<!-- 日志详情抽屉 -->
<div class="offcanvas offcanvas-end w-50" bind:this={logDrawerElement} tabindex="-1">
    <div class="offcanvas-header bg-dark text-white">
        <h5 class="offcanvas-title fw-bold">
            <i class="bi bi-terminal me-2"></i>日志明细
            <small class="text-white-50 ms-2 fw-normal">#{selectedLog?.case_id}</small>
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" title="关闭"></button>
    </div>
    <div class="offcanvas-body bg-dark p-0 overflow-hidden d-flex flex-column">
        <div class="d-flex justify-content-between align-items-center px-3 py-2 bg-secondary bg-opacity-25 border-bottom border-secondary">
            <span class="small text-white-50 text-truncate me-3">{selectedLog?.case_name}</span>
            <button class="btn btn-sm btn-outline-light border-0" onclick={copyLog}>
                <i class="bi bi-clipboard me-1"></i>复制全文
            </button>
        </div>
        <pre class="m-0 p-3 flex-grow-1 overflow-auto font-monospace small custom-log-viewer">{selectedLog?.status_desc}</pre>
    </div>
</div>

<style>
    .extra-small { font-size: 0.7rem; }
    .btn-white { background: white; }
    th { font-size: 0.75rem; text-transform: uppercase; color: #888; border-top: none !important; }
    
    .custom-log-viewer {
        background-color: #1e1e1e;
        white-space: pre-wrap;
        word-break: break-all;
        color: #dcdcdc !important;
        line-height: 1.6;
    }

    /* 滚动条美化 */
    .custom-log-viewer::-webkit-scrollbar { width: 8px; }
    .custom-log-viewer::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
</style>
