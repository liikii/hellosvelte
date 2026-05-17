<script lang="ts">
    import { page } from "$app/state"; // Svelte 5 推荐用法
    import { fade } from "svelte/transition";
    import { invalidateAll, goto } from "$app/navigation";
    import Pagination from "$lib/Pagination.svelte";
    import { TASK_STATUS } from "./status_config";
    import TestTaskCreate from "./TestTaskCreate.svelte";
    import TestTaskDetail from "./TestTaskDetail.svelte";
    import { onMount } from "svelte";
    import MsgToast from "$lib/MsgToast.svelte";

    let { data } = $props();

    // 视图模式管理
    let viewMode = $state("list");
    let activeTask = $state<any>(null);

    // 筛选状态初始化 (从 URL 获取，确保页面刷新后输入框不复位)
    let startTime = $state(
        page.url.searchParams.get("start_create_time") || "",
    );
    let endTime = $state(page.url.searchParams.get("end_create_time") || "");
    let statusFilter = $state(page.url.searchParams.get("min_status") || "");
    let orderTime = $state(
        page.url.searchParams.get("order_create_time") || "desc",
    );

    // let tasks = $derived(data.tasks);

    // 1. 定义本地状态，初始可以为空数组
    let localTasks = $state<any[]>([]);

    // 2. 核心：使用 $effect 监听 data.tasks 的变化
    // 每当 data.tasks 引用改变（例如翻页、重新查询），就同步给 localTasks
    $effect(() => {
        localTasks = data.tasks;
    });

    // --- 定时更新状态功能 ---
    async function updateTaskStatuses() {
        if (viewMode !== "list" || !localTasks || localTasks.length === 0)
            return;

        const ids = localTasks.map((t: any) => t.id);
        try {
            const response = await fetch("/api/task_status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ids),
            });

            if (response.ok) {
                const statusMap = await response.json();

                // 3. 直接修改 localTasks，触发 UI 更新
                localTasks = localTasks.map((task: any) => {
                    if (
                        statusMap[task.id] !== undefined &&
                        statusMap[task.id] !== task.status_code
                    ) {
                        return { ...task, status_code: statusMap[task.id] };
                    }
                    return task;
                });
            }
        } catch (error) {
            console.error("Failed to update task statuses:", error);
        }
    }

    onMount(() => {
        const interval = setInterval(updateTaskStatuses, 60000); // 每60秒更新一次
        return () => clearInterval(interval); // 组件销毁时清除定时器
    });
    // -----------------------

    function applyFilter() {
        const url = new URL(window.location.origin + window.location.pathname);

        if (startTime) url.searchParams.set("start_create_time", startTime);
        if (endTime) url.searchParams.set("end_create_time", endTime);
        if (statusFilter !== "") {
            url.searchParams.set("min_status", statusFilter);
            url.searchParams.set("max_status", statusFilter);
        }
        url.searchParams.set("order_create_time", orderTime);
        url.searchParams.set("page", "1");

        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    function clearFilters() {
        startTime = "";
        endTime = "";
        statusFilter = "";
        orderTime = "desc";
        goto(window.location.pathname);
    }

    function openDetail(task: any) {
        activeTask = task;
        viewMode = "detail";
    }

    // 运行消息toast
    // 1. 声明 MsgToast 的响应式状态 (Svelte 5 Runes)
    let toastShow = $state(false);
    let toastType = $state<"success" | "danger">("success");
    let toastMsg = $state("");

    // 2. 发起 Run 请求的异步函数
    async function handleRunTask(taskId: number) {
        // 找出当前点击的任务
        const taskIndex = localTasks.findIndex((t) => t.id === taskId);
        // 记录原始状态，如果请求失败可以回滚
        const originalStatus =
            taskIndex !== -1 ? localTasks[taskIndex].status_code : 0;

        try {
            // 乐观更新：让前端的呼吸灯和动画立刻转起来！(假设 1 代表运行中)
            if (taskIndex !== -1) {
                localTasks[taskIndex].status_code = 1;
            }

            // 发起请求到我们刚才写好的 SvelteKit Mock 接口
            const response = await fetch("/api/run_test_task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ test_task_id: taskId }),
            });

            const resData = await response.json();

            if (response.status === 200 && resData.code === 200) {
                // 成功：弹出绿色提示，保持运行状态
                toastType = "success";
                toastMsg = resData.msg;
            } else {
                // 业务失败：弹出红色提示，回滚状态
                toastType = "danger";
                toastMsg = resData.msg || "启动失败";
                if (taskIndex !== -1)
                    localTasks[taskIndex].status_code = originalStatus;
            }
        } catch (error) {
            // 网络异常：弹出红色提示，回滚状态
            toastType = "danger";
            toastMsg = "网络连接异常，无法触发任务。";
            if (taskIndex !== -1)
                localTasks[taskIndex].status_code = originalStatus;
        } finally {
            // 唤醒消息弹窗
            toastShow = true;
        }
    }
</script>

<div class="container-fluid mt-4 px-4">
    {#if viewMode === "list"}
        <div in:fade>
            <!-- 顶部工具栏 (保持不变) -->
            <div
                class="d-flex justify-content-between align-items-end mb-4 bg-white p-3 rounded shadow-sm"
            >
                <div class="d-flex gap-3 align-items-end">
                    <div>
                        <label class="form-label small fw-bold" for="st"
                            >时间范围</label
                        >
                        <div class="input-group input-group-sm">
                            <input
                                id="st"
                                type="datetime-local"
                                class="form-control"
                                bind:value={startTime}
                            />
                            <span class="input-group-text">至</span>
                            <input
                                type="datetime-local"
                                class="form-control"
                                bind:value={endTime}
                            />
                        </div>
                    </div>
                    <div>
                        <label class="form-label small fw-bold" for="sf"
                            >状态</label
                        >
                        <select
                            id="sf"
                            class="form-select form-select-sm"
                            bind:value={statusFilter}
                        >
                            <option value="">全部</option>
                            {#each Object.entries(TASK_STATUS) as [val, cfg]}
                                <option value={val}>{cfg.label}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="form-label small fw-bold" for="ot"
                            >排序</label
                        >
                        <select
                            id="ot"
                            class="form-select form-select-sm"
                            bind:value={orderTime}
                        >
                            <option value="desc">创建时间 ↓</option>
                            <option value="asc">创建时间 ↑</option>
                        </select>
                    </div>
                    <div class="btn-group btn-group-sm shadow-sm">
                        <button class="btn btn-dark px-3" onclick={applyFilter}
                            >查询</button
                        >
                        <button
                            class="btn btn-outline-secondary"
                            onclick={clearFilters}
                            title="重置"
                        >
                            <i class="bi bi-arrow-counterclockwise"></i>
                        </button>
                    </div>
                </div>
                <button
                    class="btn btn-primary rounded-pill px-4 shadow-sm"
                    onclick={() => (viewMode = "create")}
                >
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
                            {#each localTasks as task}
                                <tr>
                                    <td class="ps-4 font-monospace small"
                                        >#{task.id}</td
                                    >
                                    <td class="fw-bold"
                                        >{task.super_suite_name}</td
                                    >
                                    <td>
                                        <div class="small fw-bold">
                                            {task.test_host}
                                        </div>
                                        <div
                                            class="text-muted"
                                            style="font-size: 0.7rem;"
                                        >
                                            User: {task.test_host_usr}
                                        </div>
                                    </td>
                                    <td>{task.user_name}</td>
                                    <!-- <td>
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
                                    </td> -->
                                    <td class="status-cell">
                                        {#if TASK_STATUS[task.status_code]}
                                            <!-- 如果状态是“运行中”或“排队中”，添加呼吸灯效果 -->
                                            {@const isRunning =
                                                task.status_code === 1}
                                            <!-- 这里的ID根据你 status_config 的实际值调整 -->

                                            <span
                                                class="{TASK_STATUS[
                                                    task.status_code
                                                ].color} {isRunning
                                                    ? 'status-updating'
                                                    : ''}"
                                            >
                                                <i
                                                    class="bi {TASK_STATUS[
                                                        task.status_code
                                                    ].icon} me-1 {isRunning
                                                        ? 'animate-spin'
                                                        : ''}"
                                                ></i>
                                                {TASK_STATUS[task.status_code]
                                                    .label}
                                            </span>
                                        {:else}
                                            <span class="text-muted">
                                                <i
                                                    class="bi bi-question-circle me-1"
                                                ></i>
                                                未知 ({task.status_code})
                                            </span>
                                        {/if}
                                    </td>

                                    <td class="text-muted small"
                                        >{new Date(
                                            task.create_time,
                                        ).toLocaleString()}</td
                                    >
                                    <td class="text-end pe-4">
                                        <div class="dropdown">
                                            <button
                                                class="btn btn-sm btn-light border dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                >操作</button
                                            >
                                            <ul
                                                class="dropdown-menu shadow border-0"
                                            >
                                                <li>
                                                    <button
                                                        class="dropdown-item"
                                                        onclick={() =>
                                                            openDetail(task)}
                                                        ><i
                                                            class="bi bi-file-earmark-text me-2"
                                                        ></i>详情/报告</button
                                                    >
                                                </li>
                                                <li>
                                                    <button
                                                        class="dropdown-item"
                                                        ><i
                                                            class="bi bi-hdd-network me-2"
                                                        ></i>Host检查</button
                                                    >
                                                </li>
                                                <li>
                                                    <button
                                                        class="dropdown-item text-primary"
                                                        onclick={() =>
                                                            handleRunTask(
                                                                task.id,
                                                            )}
                                                    >
                                                        <i
                                                            class="bi bi-play-fill me-2"
                                                        ></i>Run
                                                    </button>
                                                </li>
                                                <li>
                                                    <hr
                                                        class="dropdown-divider"
                                                    />
                                                </li>
                                                <li>
                                                    <button
                                                        class="dropdown-item text-danger"
                                                        ><i
                                                            class="bi bi-trash me-2"
                                                        ></i>删除任务</button
                                                    >
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                <tr
                                    ><td
                                        colspan="7"
                                        class="text-center py-5 text-muted"
                                        >暂无测试任务</td
                                    ></tr
                                >
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                total={data.total}
                limit={10}
                current={data.currentPage}
                onPageChange={(p) => goto(`?page=${p}`)}
            />
        </div>
    {:else if viewMode === "create"}
        <TestTaskCreate
            onCancel={() => (viewMode = "list")}
            onSave={() => {
                viewMode = "list";
                invalidateAll();
            }}
        />
    {:else if viewMode === "detail" && activeTask}
        <TestTaskDetail task={activeTask} onBack={() => (viewMode = "list")} />
    {:else}
        <div class="text-center py-5 text-muted">
            <p>未选择任务或任务不存在</p>
            <button
                class="btn btn-sm btn-outline-secondary"
                onclick={() => (viewMode = "list")}>返回列表</button
            >
        </div>
    {/if}
</div>

<MsgToast
    bind:show={toastShow}
    type={toastType}
    message={toastMsg}
    autoClose={true}
    duration={6000}
/>

<style>
    /* 旋转动画：用于刷新或运行中的图标 */
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .animate-spin {
        display: inline-block;
        animation: spin 2s linear infinite;
    }

    /* 呼吸灯动画：让用户感觉到“实时监控中” */
    @keyframes pulse-opacity {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }
    .status-updating {
        animation: pulse-opacity 2s ease-in-out infinite;
    }

    /* 状态变更时的平滑过渡 */
    .status-cell {
        transition: all 0.3s ease;
    }
</style>
