<script lang="ts">
    import { page } from "$app/state"; // Svelte 5 推荐用法
    import { fade } from 'svelte/transition';
    import { invalidateAll, goto } from '$app/navigation';
    import Pagination from "$lib/Pagination.svelte";
    import { TASK_STATUS } from './status_config';
    import TestTaskCreate from './TestTaskCreate.svelte';
    import TestTaskDetail from './TestTaskDetail.svelte';

    let { data } = $props();

    // 视图模式管理
    let viewMode = $state('list'); 
    let activeTask = $state<any>(null);

    // 筛选状态初始化 (从 URL 获取，确保页面刷新后输入框不复位)
    let startTime = $state(page.url.searchParams.get('start_create_time') || '');
    let endTime = $state(page.url.searchParams.get('end_create_time') || '');
    let statusFilter = $state(page.url.searchParams.get('min_status') || '');
    let orderTime = $state(page.url.searchParams.get('order_create_time') || 'desc');

    let tasks = $derived(data.tasks);

    function applyFilter() {
        const url = new URL(window.location.origin + window.location.pathname);
        
        if (startTime) url.searchParams.set('start_create_time', startTime);
        if (endTime) url.searchParams.set('end_create_time', endTime);
        if (statusFilter !== '') {
            url.searchParams.set('min_status', statusFilter);
            url.searchParams.set('max_status', statusFilter);
        }
        url.searchParams.set('order_create_time', orderTime);
        url.searchParams.set('page', '1'); 

        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    function clearFilters() {
        startTime = '';
        endTime = '';
        statusFilter = '';
        orderTime = 'desc';
        goto(window.location.pathname);
    }

    function openDetail(task: any) {
        activeTask = task;
        viewMode = 'detail';
    }
</script>

<div class="container-fluid mt-4 px-4">
    {#if viewMode === 'list'}
        <div in:fade>
            <!-- 顶部工具栏 (保持不变) -->
            <div class="d-flex justify-content-between align-items-end mb-4 bg-white p-3 rounded shadow-sm">
                <div class="d-flex gap-3 align-items-end">
                    <div>
                        <label class="form-label small fw-bold" for="st">时间范围</label>
                        <div class="input-group input-group-sm">
                            <input id="st" type="datetime-local" class="form-control" bind:value={startTime} />
                            <span class="input-group-text">至</span>
                            <input type="datetime-local" class="form-control" bind:value={endTime} />
                        </div>
                    </div>
                    <div>
                        <label class="form-label small fw-bold" for="sf">状态</label>
                        <select id="sf" class="form-select form-select-sm" bind:value={statusFilter}>
                            <option value="">全部</option>
                            {#each Object.entries(TASK_STATUS) as [val, cfg]}
                                <option value={val}>{cfg.label}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="form-label small fw-bold" for="ot">排序</label>
                        <select id="ot" class="form-select form-select-sm" bind:value={orderTime}>
                            <option value="desc">创建时间 ↓</option>
                            <option value="asc">创建时间 ↑</option>
                        </select>
                    </div>
                    <div class="btn-group btn-group-sm shadow-sm">
                        <button class="btn btn-dark px-3" onclick={applyFilter}>查询</button>
                        <button class="btn btn-outline-secondary" onclick={clearFilters} title="重置">
                            <i class="bi bi-arrow-counterclockwise"></i>
                        </button>
                    </div>
                </div>
                <button class="btn btn-primary rounded-pill px-4 shadow-sm" onclick={() => viewMode = 'create'}>
                    <i class="bi bi-plus-lg me-1"></i> 创建任务
                </button>
            </div>

            <!-- 列表 (保持不变) -->
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">任务ID</th>
                                <th>Super Suite</th>
                                <th>测试主机 (Host)</th>
                                <th>执行人</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th class="text-end pe-4">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each tasks as task}
                                <tr>
                                    <td class="ps-4 font-monospace small">#{task.id}</td>
                                    <td class="fw-bold">{task.super_suite_name}</td>
                                    <td>
                                        <div class="small fw-bold">{task.test_host}</div>
                                        <div class="text-muted" style="font-size: 0.7rem;">User: {task.test_host_usr}</div>
                                    </td>
                                    <td>{task.user_name}</td>
                                    <td>
                                        {#if TASK_STATUS[task.status_code]}
                                            <span class={TASK_STATUS[task.status_code].color}>
                                                <i class="bi {TASK_STATUS[task.status_code].icon} me-1"></i>
                                                {TASK_STATUS[task.status_code].label}
                                            </span>
                                        {:else}
                                            <span class="text-muted">
                                                <i class="bi bi-question-circle me-1"></i>
                                                未知 ({task.status_code})
                                            </span>
                                        {/if}
                                    </td>
                                    <td class="text-muted small">{new Date(task.create_time).toLocaleString()}</td>
                                    <td class="text-end pe-4">
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-light border dropdown-toggle" data-bs-toggle="dropdown">操作</button>
                                            <ul class="dropdown-menu shadow border-0">
                                                <li><button class="dropdown-item" onclick={() => openDetail(task)}><i class="bi bi-file-earmark-text me-2"></i>详情/报告</button></li>
                                                <li><button class="dropdown-item"><i class="bi bi-hdd-network me-2"></i>Host检查</button></li>
                                                <li><button class="dropdown-item text-primary"><i class="bi bi-play-fill me-2"></i>Run</button></li>
                                                <li><hr class="dropdown-divider"></li>
                                                <li><button class="dropdown-item text-danger"><i class="bi bi-trash me-2"></i>删除任务</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                <tr><td colspan="7" class="text-center py-5 text-muted">暂无测试任务</td></tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination total={data.total} limit={10} current={data.currentPage} onPageChange={(p) => goto(`?page=${p}`)} />
        </div>
    {:else if viewMode === 'create'}
        <TestTaskCreate onCancel={() => viewMode = 'list'} onSave={() => { viewMode = 'list'; invalidateAll(); }} />
    {:else if viewMode === 'detail' && activeTask}
        <TestTaskDetail 
            task={activeTask}
            onBack={() => viewMode = 'list'} 
        />
    {:else}
        <div class="text-center py-5 text-muted">
            <p>未选择任务或任务不存在</p>
            <button class="btn btn-sm btn-outline-secondary" onclick={() => viewMode = 'list'}>返回列表</button>
        </div>
    {/if}
</div>
