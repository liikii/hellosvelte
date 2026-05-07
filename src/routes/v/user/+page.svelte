<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    let { data } = $props();

    // 使用 Svelte 5 的状态管理
    let users = $derived(data.users);
    let totalPages = $derived(Math.ceil(data.total / data.limit));
    // let currentPage = $state(1);
    let currentPage = $derived(data.currentPage); 
    $inspect(data.total, "total", "====", totalPages);

    // 核心逻辑：计算显示的页码范围（当前页居中，前后各3个）
    let visiblePages = $derived(() => {
        let pages = [];
        let start = Math.max(1, currentPage - 3);
        let end = Math.min(totalPages, currentPage + 3);

        // 边界补齐：前不足3向后借
        if (currentPage <= 3) end = Math.min(totalPages, 7);
        // 边界补齐：后不足3向前借
        if (currentPage > totalPages - 3) start = Math.max(1, totalPages - 6);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    // 当 data.users 改变时（例如翻页），同步更新本地状态
    $effect(() => {
        users = data.users;
        // console.log(totalPages);
    });

    type User = {
        id: number;
        name: string;
        mail: string;
        create_time: string;
    };

    async function handleAction(user: User, action: string) {
        const userName = user.name;

        try {
            if (action === "delete") {
                if (!confirm(`确定要删除用户 ${userName} 吗？`)) return;

                const res = await fetch(`/api/user?id=${user.id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    // 从当前列表移除
                    users = users.filter((u: User) => u.id !== user.id);
                    // 重新加载数据以保持分页总数同步
                    invalidateAll();
                }
            } else {
                // 处理 enable (1) 和 disable (2)
                const newStatus = action === "enable" ? 1 : 2;

                const res = await fetch(`/api/user?id=${user.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: userName,
                        user_status: newStatus,
                    }),
                });

                if (res.ok) {
                    // 局部更新 UI 状态，无需刷新页面
                    const index = users.findIndex(
                        (u: User) => u.name === user.name,
                    );
                    if (index !== -1) {
                        users[index].user_status = newStatus;
                    }
                }
            }
        } catch (err) {
            alert("操作失败：" + (err as Error).message);
        }
    }
    function changePage(newPage: number) {
        if (newPage >= 1 && newPage <= totalPages) {
            goto(`?page=${newPage}`);
        }
    }
</script>

<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>用户管理</h2>
        <span class="badge bg-secondary">总计: {data.total}</span>
    </div>

    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>描述</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th class="text-end">操作</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.mail}</td>
                        <td class="text-muted small">{user.desc}</td>
                        <td>
                            <span
                                class="badge {user.user_status === 1
                                    ? 'bg-success'
                                    : 'bg-danger'}"
                            >
                                <!-- {user.user_status} -->
                                {user.user_status === 1 ? "已启用" : "已禁用"}
                            </span>
                        </td>
                        <td
                            >{new Date(
                                user.create_time,
                            ).toLocaleDateString()}</td
                        >
                        <td class="text-end">
                            <div class="dropdown">
                                <button
                                    class="btn btn-sm btn-outline-secondary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                >
                                    操作
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <button
                                            class="dropdown-item"
                                            disabled={user.user_status === 1}
                                            onclick={() =>
                                                handleAction(user, "enable")}
                                            >启用</button
                                        >
                                    </li>
                                    <li>
                                        <button
                                            class="dropdown-item"
                                            disabled={user.user_status === 2}
                                            onclick={() =>
                                                handleAction(user, "disable")}
                                            >禁用</button
                                        >
                                    </li>
                                    <li><hr class="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            class="dropdown-item text-danger"
                                            onclick={() =>
                                                handleAction(user, "delete")}
                                            >删除用户</button
                                        >
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <!-- 分页控件 -->
    <!-- 分页控件 -->
    <nav class="mt-4">
        <ul class="pagination justify-content-center shadow-sm">
            <!-- 首页 -->
            <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                <button class="page-link" onclick={() => changePage(1)}
                    >«</button
                >
            </li>
            <!-- 上一页 -->
            <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                <button
                    class="page-link"
                    onclick={() => changePage(currentPage - 1)}>Prev</button
                >
            </li>

            <!-- 动态中间页码 -->
            {#each visiblePages() as page}
                <li class="page-item {currentPage === page ? 'active' : ''}">
                    <button class="page-link" onclick={() => changePage(page)}>
                        {page}
                    </button>
                </li>
            {/each}

            <!-- 下一页 -->
            <li
                class="page-item {currentPage === totalPages ? 'disabled' : ''}"
            >
                <button
                    class="page-link"
                    onclick={() => changePage(currentPage + 1)}>Next</button
                >
            </li>
            <!-- 尾页 -->
            <li
                class="page-item {currentPage === totalPages ? 'disabled' : ''}"
            >
                <button class="page-link" onclick={() => changePage(totalPages)}
                    >»</button
                >
            </li>
        </ul>
    </nav>
</div>

<style>
    /* 可以在这里添加局部样式 */
    .table {
        font-size: 0.9rem;
    }
     /* 分页按钮美化 */
    .page-link {
        cursor: pointer;
        min-width: 40px;
        text-align: center;
        color: #666;
        border: 1px solid #dee2e6;
        margin: 0 2px;
        border-radius: 6px !important;
        transition: all 0.2s;
    }
    .page-item.active .page-link {
        background-color: var(--bs-primary);
        border-color: var(--bs-primary);
        color: white;
        box-shadow: 0 2px 6px rgba(13, 110, 253, 0.3);
    }
    .page-item.disabled .page-link {
        background-color: #f8f9fa;
        color: #ccc;
    }
</style>
