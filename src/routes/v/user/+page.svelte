<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import Pagination from "$lib/Pagination.svelte";
    import { onMount } from "svelte";

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

    // --- 新增用户表单状态 ---
    let newUser = $state({
        name: '',
        mail: '',
        desc: '',
        user_status: 1
    });
    let modalElement = $state<HTMLElement>();
    let modalInstance: any;

    onMount( () => {
		 async function init() {
			const bootstrap = await import("bootstrap");
			if (modalElement) modalInstance = new bootstrap.Modal(modalElement);
		 }
		init();
		// // 3. 返回一个同步的清理函数
		// return () => {
		// 	cleanupPromise.then(cleanup => cleanup?.());
		// };
		
	});

    async function saveUser() {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                modalInstance.hide(); // 关闭弹窗
                newUser = { name: '', mail: '', desc: '', user_status: 1 }; // 重置表单
                invalidateAll(); // 刷新列表
            } else {
                const err = await res.json();
                alert("保存失败: " + (err.message || "未知错误"));
            }
        } catch (e) {
            alert("提交请求失败");
        }
    }
    // --- 结束 ---
    

</script>
<div class="container-fluid mt-4 px-4"> <!-- 改为全屏流布局 -->
    
    <!-- 顶部标题与操作栏：采用任务页的对齐风格 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold text-dark mb-1">用户管理</h2>
            <p class="text-muted small mb-0">管理系统访问权限与用户信息</p>
        </div>
        <div class="d-flex gap-3">
            <button class="btn btn-primary d-flex align-items-center px-3 shadow-sm rounded-pill" onclick={() => modalInstance.show()}>
                <i class="bi bi-person-plus-fill me-2"></i> 新增用户
            </button>
            <div class="badge bg-white text-dark border d-flex align-items-center px-3 shadow-sm rounded-pill">
                <span class="text-muted me-1">总计:</span> <strong>{data.total}</strong>
            </div>
        </div>
    </div>

    <!-- 表格卡片：增加 shadow 和 border 细节 -->
    <!-- <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div class="table-responsive">
            <table class="table table-hover align-middle bg-white mb-0"> -->
<div class="card border-0 shadow-sm rounded-3" style="min-height: 350px;">
    <div class="table-responsive" style="overflow: visible;"> 
        <table class="table table-hover align-middle bg-white mb-0">
            <thead class="table-light border-bottom">
                    <tr class="text-uppercase small fw-bold text-secondary">
                        <th class="ps-4 py-3">用户名</th>
                        <th class="py-3">邮箱</th>
                        <th class="py-3">描述</th>
                        <th class="py-3">状态</th>
                        <th class="py-3">创建时间</th>
                        <th class="text-end pe-4 py-3">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <td class="ps-4">
                                <div class="d-flex align-items-center">
                                    <div class="avatar-circle me-2">{user.name.charAt(0)}</div>
                                    <strong class="text-dark">{user.name}</strong>
                                </div>
                            </td>
                            <td><span class="text-secondary">{user.mail}</span></td>
                            <td><span class="text-muted smaller">{user.desc || '-'}</span></td>
                            <td>
                                <span class="badge rounded-pill {user.user_status === 1 ? 'bg-success' : 'bg-danger'} bg-opacity-10 {user.user_status === 1 ? 'text-success' : 'text-danger'} border {user.user_status === 1 ? 'border-success' : 'border-danger'} border-opacity-25 px-3">
                                    {user.user_status === 1 ? "已启用" : "已禁用"}
                                </span>
                            </td>
                            <td class="text-muted smaller">{new Date(user.create_time).toLocaleDateString()}</td>
                            <td class="text-end pe-4">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-light border dropdown-toggle" data-bs-toggle="dropdown">
                                        管理
                                    </button>
                                    <ul class="dropdown-menu shadow border-0">
                                        <li>
                                            <button class="dropdown-item py-2" disabled={user.user_status === 1} onclick={() => handleAction(user, "enable")}>
                                                <i class="bi bi-check-circle me-2 text-success"></i>启用账号
                                            </button>
                                        </li>
                                        <li>
                                            <button class="dropdown-item py-2" disabled={user.user_status === 2} onclick={() => handleAction(user, "disable")}>
                                                <i class="bi bi-dash-circle me-2 text-warning"></i>禁用账号
                                            </button>
                                        </li>
                                        <li><hr class="dropdown-divider opacity-50"></li>
                                        <li>
                                            <button class="dropdown-item py-2 text-danger" onclick={() => handleAction(user, "delete")}>
                                                <i class="bi bi-trash3 me-2"></i>删除用户
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
    </div>

    <!-- 分页控件 -->
    <div class="d-flex justify-content-center mt-4">
        <Pagination 
            total={data.total} 
            limit={data.limit} 
            current={currentPage} 
            onPageChange={handlePageChange} 
        />
    </div>
</div>

<!-- Modal 部分保持之前的 a11y 修正即可 ... -->



<!-- 新增用户模态框 -->
<div class="modal fade" bind:this={modalElement} tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">新增用户信息</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" title="关闭"></button>
            </div>
            <div class="modal-body">
                <form onsubmit={(e) => { e.preventDefault(); saveUser(); }}>
                    <div class="mb-3">
                        <label for="userNameInput" class="form-label small fw-bold">用户名</label>
                        <input id="userNameInput" type="text" class="form-control" bind:value={newUser.name} placeholder="输入用户名" required />
                    </div>
                    <div class="mb-3">
                        <label for="emailInput" class="form-label small fw-bold">邮箱</label>
                        <input id="emailInput" type="email" class="form-control" bind:value={newUser.mail} placeholder="example@mail.com" required />
                    </div>
                    <div class="mb-3">
                        <label for="descInput" class="form-label small fw-bold">用户描述</label>
                        <textarea id="descInput" class="form-control" rows="3" bind:value={newUser.desc} placeholder="简单描述一下用户..."></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="statusInput" class="form-label small fw-bold">初始状态</label>
                        <select id="statusInput" class="form-select" bind:value={newUser.user_status}>
                            <option value={1}>启用</option>
                            <option value={2}>禁用</option>
                        </select>
                    </div>
                    <div class="modal-footer px-0 pb-0 border-0">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary px-4">保存用户</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<style>
    .table { font-size: 0.95rem; }
    .table-hover tbody tr:hover { background-color: rgba(0,0,0,0.02); }
</style>

