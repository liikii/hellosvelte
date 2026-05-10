<script lang="ts">
    import { onMount } from 'svelte';
    import { CASE_STATUS, TASK_STATUS } from './status_config';
    import Pagination from "$lib/Pagination.svelte";

    // Destructure props explicitly for better Svelte 5 reactivity tracking
    let { task, onBack } = $props<{ 
        task: any, 
        onBack: () => void 
    }>();

    // Ensure taskId is stable for reactivity
    let taskId = $derived(task?.id);

    let details = $state<any[]>([]);
    let loading = $state(true);
    let order = $state('desc');
    let statusMin = $state('');
    let currentPage = $state(1);
    let totalCount = $state(0);
    const perPage = 20;

    async function loadDetail() {
        if (!taskId) return;
        
        loading = true;
        try {
            // Added error handling and manual cleanup of potential undefined params
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
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            const result = await res.json();
            details = result.data || [];
            totalCount = result.total_count || 0;
        } catch (err) {
            console.error("Failed to load details:", err);
            details = [];
        } finally {
            loading = false;
        }
    }

    // $effect automatically re-runs whenever taskId, currentPage, order, or statusMin changes
    $effect(() => {
        if (taskId) {
            loadDetail();
        }
    });

    function handleFilterChange() {
        currentPage = 1; // Reset to page 1 on filter/sort change
    }

    let selectedLog = $state<any>(null); // 存储当前点击的日志对象
    let logDrawerElement = $state<HTMLElement>();
    let logDrawerInstance: any;
    
    onMount( () => {
        async function init() {
            const bootstrap = await import("bootstrap");
            if (logDrawerElement) logDrawerInstance = new bootstrap.Offcanvas(logDrawerElement);
            // const tip = new bootstrap.Tooltip(tipEl);
            // return () => tip.dispose(); 
        }

        init();
		
	});

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
    <div class="d-flex align-items-center mb-3">
        <button class="btn btn-white border shadow-sm btn-sm me-3" onclick={onBack}>
            <i class="bi bi-arrow-left me-1"></i> 返回列表
        </button>
        <h4 class="mb-0 fw-bold">执行报告 <span class="text-muted small">#{taskId || '---'}</span></h4>
    </div>

    <!-- Parent Task Summary Card -->
    {#if task}
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body bg-white rounded-3 py-3">
                <div class="row align-items-center">
                    <div class="col-md-4 border-end">
                        <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">Super Suite</span>
                        <h5 class="fw-bold text-primary mb-0">{task.super_suite_name}</h5>
                    </div>
                    <div class="col-md-3 border-end">
                        <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">测试主机</span>
                        <div class="fw-semibold text-dark"><i class="bi bi-pc-display me-2"></i>{task.test_host}</div>
                        <div class="text-muted small">{task.test_host_usr}@{task.test_host}</div>
                    </div>
                    <div class="col-md-3 border-end">
                        <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">整体状态</span>
                        <!-- {@const st = TASK_STATUS[task.status_code]} -->
                            <div class="{TASK_STATUS[task.status_code].color} fw-bold">
                                <i class="bi {TASK_STATUS[task.status_code].icon} me-1"></i> {TASK_STATUS[task.status_code].label}
                            </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="text-uppercase text-muted extra-small fw-bold d-block mb-1">执行人</span>
                        <span class="badge bg-light text-dark border fw-normal">{task.user_name}</span>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Execution Logs List -->
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
                                        <div class="text-nowrap text-opacity-50 ms-3">↓ {new Date(item.end_time).toLocaleTimeString()}</div>
                                    </td>
                                    <!-- <td class="pe-4 small text-muted">
                                        <div class="text-truncate" style="max-width: 250px;" title={item.status_desc}>
                                            {item.status_desc}
                                        </div>
                                    </td> -->
                                    <!-- 表格中的结果描述列 -->
                                    <td class="pe-4 small text-muted">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <!-- 预览前 30 个字 -->
                                            <span class="text-truncate d-inline-block" style="max-width: 200px;">
                                                {item.status_desc.substring(0, 30)}{item.status_desc.length > 30 ? '...' : ''}
                                            </span>
                                            
                                            <!-- 查看全文按钮 -->
                                            <button 
                                                class="btn btn-sm btn-link text-primary p-0 ms-2 text-decoration-none"
                                                onclick={() => openLogDrawer(item)}
                                                title="查看完整日志"
                                            >
                                                <i class="bi bi-terminal-fill me-1"></i>明细
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                <tr>
                                    <td colspan="5" class="text-center py-5 text-muted">该任务下暂无执行记录</td>
                                </tr>
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

<!-- 日志查看抽屉 -->
<div class="offcanvas offcanvas-end w-50" bind:this={logDrawerElement} tabindex="-1">
    <div class="offcanvas-header bg-dark text-white">
        <h5 class="offcanvas-title fw-bold">
            <i class="bi bi-terminal me-2"></i>日志详情 
            <small class="text-white-50 ms-2 fw-normal">#{selectedLog?.case_id}</small>
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" title="关闭"></button>
    </div>
    <div class="offcanvas-body bg-dark p-0 overflow-hidden d-flex flex-column">
        <!-- 工具栏 -->
        <div class="d-flex justify-content-between align-items-center px-3 py-2 bg-secondary bg-opacity-25 border-bottom border-secondary">
            <span class="small text-white-50">{selectedLog?.case_name}</span>
            <button class="btn btn-sm btn-outline-light border-0" onclick={copyLog}>
                <i class="bi bi-clipboard me-1"></i>复制全文
            </button>
        </div>
        
        <!-- 日志内容区 -->
        <pre class="m-0 p-3 text-info flex-grow-1 overflow-auto font-monospace small custom-log-viewer" style="line-height: 1.6;">
            {selectedLog?.status_desc}
        </pre>
    </div>
</div>

<style>
    /* 让日志看起来像终端 */
    .custom-log-viewer {
        background-color: #1e1e1e;
        white-space: pre-wrap;
        word-break: break-all;
        color: #dcdcdc !important;
    }
    
    .custom-log-viewer::-webkit-scrollbar { width: 8px; }
    .custom-log-viewer::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }

    .extra-small { font-size: 0.7rem; }
    .btn-white { background: white; }
    th { font-size: 0.75rem; text-transform: uppercase; color: #888; border-top: none !important; }
    .table-hover tbody tr:hover { background-color: rgba(0, 123, 255, 0.02); }
</style>
