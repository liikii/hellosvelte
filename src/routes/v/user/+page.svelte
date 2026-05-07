<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import Pagination from "$lib/Pagination.svelte";

    let { data } = $props();

    // 1. 状态定义：直接派生，代码更清爽
    let users = $derived(data.users);
    let currentPage = $derived(data.currentPage);

    // 2. 类型定义
    type User = {
        id: number;
        name: string;
        mail: string;
        desc?: string;
        user_status: number;
        create_time: string;
    };

    // 3. 业务逻辑：操作 API
    async function handleAction(user: User, action: string) {
        try {
            if (action === "delete") {
                if (!confirm(`确定要删除用户 ${user.name} 吗？`)) return;
                const res = await fetch(`/api/user?id=${user.id}`, { method: "DELETE" });
                if (res.ok) invalidateAll(); // 刷新页面数据
            } else {
                const newStatus = action === "enable" ? 1 : 2;
                const res = await fetch(`/api/user?id=${user.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: user.name, user_status: newStatus }),
                });
                if (res.ok) invalidateAll(); // 也可以用 invalidateAll 保持全局状态一致
            }
        } catch (err) {
            alert("操作失败：" + (err as Error).message);
        }
    }

    // 4. 分页跳转逻辑
    function handlePageChange(page: number) {
        goto(`?page=${page}`);
    }
</script>

<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-dark">用户管理</h2>
        <span class="badge bg-secondary px-3 py-2">总计: {data.total}</span>
    </div>

    <div class="table-responsive shadow-sm rounded-3">
        <table class="table table-hover align-middle bg-white mb-0">
            <thead class="table-light">
                <tr>
                    <th class="ps-3">用户名</th>
                    <th>邮箱</th>
                    <th>描述</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th class="text-end pe-3">操作</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr>
                        <td class="ps-3"><strong>{user.name}</strong></td>
                        <td>{user.mail}</td>
                        <td class="text-muted small">{user.desc || '-'}</td>
                        <td>
                            <span class="badge {user.user_status === 1 ? 'bg-success' : 'bg-danger'} bg-opacity-75">
                                {user.user_status === 1 ? "已启用" : "已禁用"}
                            </span>
                        </td>
                        <td>{new Date(user.create_time).toLocaleDateString()}</td>
                        <td class="text-end pe-3">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                    管理
                                </button>
                                <ul class="dropdown-menu shadow">
                                    <li>
                                        <button class="dropdown-item" disabled={user.user_status === 1} onclick={() => handleAction(user, "enable")}>
                                            <i class="bi bi-check-circle me-2"></i>启用
                                        </button>
                                    </li>
                                    <li>
                                        <button class="dropdown-item" disabled={user.user_status === 2} onclick={() => handleAction(user, "disable")}>
                                            <i class="bi bi-slash-circle me-2"></i>禁用
                                        </button>
                                    </li>
                                    <li><hr class="dropdown-divider" /></li>
                                    <li>
                                        <button class="dropdown-item text-danger" onclick={() => handleAction(user, "delete")}>
                                            <i class="bi bi-trash me-2"></i>删除用户
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <!-- 5. 使用通用分页组件 -->
    <Pagination 
        total={data.total} 
        limit={data.limit} 
        current={currentPage} 
        onPageChange={handlePageChange} 
    />
</div>

<style>
    .table { font-size: 0.95rem; }
    .table-hover tbody tr:hover { background-color: rgba(0,0,0,0.02); }
</style>
