<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { fade } from 'svelte/transition';
    import Pagination from "$lib/Pagination.svelte";
    import SuperSuiteCreate from "./SuperSuiteCreate.svelte"; // 引入你刚封装的组件

    let { data } = $props();
    
    // 1. 视图切换状态：'list' 为列表页，'create' 为创建组件页
    let viewMode = $state('list');

    // 2. 响应式数据
    let suites = $derived(data.list);
    let total = $derived(data.total);

    // 3. 操作函数
    async function handleDelete(id: number, name: string) {
        if (!confirm(`确定要删除 "${name}" 吗？`)) return;
        
        const res = await fetch(`/api/super_suite?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            invalidateAll(); 
        }
    }

    function handleSaveSuccess() {
        viewMode = 'list'; // 切回列表
        invalidateAll();   // 刷新后端数据
    }

    function handleCancel() {
        viewMode = 'list'; // 直接切回列表
    }
</script>

<div class="container-fluid mt-4 px-4">
    {#if viewMode === 'list'}
        <!-- 列表视图容器 -->
        <div in:fade={{ duration: 200 }}>
            <!-- Header Section -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="fw-bold text-dark mb-1">Super Suite Management</h2>
                    <p class="text-muted small mb-0">Total combined test suites: {total}</p>
                </div>
                <!-- 点击直接改变状态 -->
                <button class="btn btn-primary px-4 py-2 shadow-sm rounded-pill" onclick={() => viewMode = 'create'}>
                    <i class="bi bi-plus-lg me-1"></i> Create Super Suite
                </button>
            </div>

            <!-- Table Card -->
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light border-bottom">
                            <tr>
                                <th class="ps-4 py-3 text-secondary small text-uppercase">ID</th>
                                <th class="py-3 text-secondary small text-uppercase">Suite Name</th>
                                <th class="py-3 text-secondary small text-uppercase">Creator</th>
                                <th class="py-3 text-secondary small text-uppercase">Created At</th>
                                <th class="py-3 text-secondary small text-uppercase">Updated At</th>
                                <th class="pe-4 py-3 text-end text-secondary small text-uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each suites as suite}
                                <tr>
                                    <td class="ps-4 font-monospace text-muted small">#{suite.id}</td>
                                    <td><span class="fw-bold text-primary-emphasis">{suite.suite_name}</span></td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm me-2 bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center fw-bold">
                                                {suite.user_name.charAt(0)}
                                            </div>
                                            <span class="small">{suite.user_name}</span>
                                        </div>
                                    </td>
                                    <td class="text-muted small">{new Date(suite.create_time).toLocaleDateString()}</td>
                                    <td class="text-muted small">{new Date(suite.update_time).toLocaleDateString()}</td>
                                    <td class="pe-4 text-end">
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-light border dropdown-toggle" data-bs-toggle="dropdown">Manage</button>
                                            <ul class="dropdown-menu shadow border-0">
                                                <li><a class="dropdown-item" href="/super_suite/edit/{suite.id}"><i class="bi bi-pencil-square me-2 text-muted"></i>Edit Details</a></li>
                                                <li><hr class="dropdown-divider opacity-50"></li>
                                                <li><button class="dropdown-item text-danger" onclick={() => handleDelete(suite.id, suite.suite_name)}><i class="bi bi-trash3 me-2"></i>Delete Suite</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                <tr><td colspan="6" class="text-center py-5 text-muted italic">No Super Suites found.</td></tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 分页 -->
            <Pagination 
                total={data.total} 
                limit={data.limit} 
                current={data.currentPage} 
                onPageChange={(p) => goto(`?page=${p}`)} 
            />
        </div>
    {:else}
        <!-- 创建组件视图：进入该分支会触发 SuperSuiteCreate 挂载及内部 onMount 数据获取 -->
        <div in:fade={{ duration: 200 }}>
            <SuperSuiteCreate 
                onSaveSuccess={handleSaveSuccess} 
                onCancel={handleCancel} 
            />
        </div>
    {/if}
</div>

<style>
    :global(body) {
        background-color: #fcfcfd;
    }
    
    .avatar-sm {
        width: 28px;
        height: 28px;
        font-size: 0.75rem;
    }

    .table thead th {
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .dropdown-item {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }
</style>
