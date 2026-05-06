<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    let { data } = $props();

    // 使用 Svelte 5 的状态管理
    let users = $derived(data.users);
    let totalPages = $derived(Math.ceil(data.total / data.limit));
    $inspect(data.total, 'total', '====', totalPages); 

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
        goto(`?page=${newPage}`);
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
                                {user.user_status}
                                <!-- {user.user_status === 1 ? "已启用" : "已禁用"} -->
                            </span>
                        </td>
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
    <nav class="mt-4">
        <ul class="pagination justify-content-center">
            <li class="page-item {data.currentPage === 1 ? 'disabled' : ''}">
                <button
                    class="page-link"
                    onclick={() => changePage(data.currentPage - 1)}
                    >上一页</button
                >
            </li>

            {#each Array(totalPages) as _, i}
                <li
                    class="page-item {data.currentPage === i + 1
                        ? 'active'
                        : ''}"
                >
                    <button class="page-link" onclick={() => changePage(i + 1)}
                        >{i + 1}</button
                    >
                </li>
            {/each}

            <li
                class="page-item {data.currentPage === totalPages
                    ? 'disabled'
                    : ''}"
            >
                <button
                    class="page-link"
                    onclick={() => changePage(data.currentPage + 1)}
                    >下一页</button
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
</style>
