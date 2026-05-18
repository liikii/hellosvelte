<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { fade } from 'svelte/transition';
    import Pagination from "$lib/Pagination.svelte";
    import SuperSuiteCreate from "./SuperSuiteCreate.svelte";
    import SuperSuiteEditor from "./SuperSuiteEditor.svelte"; // Import the editor

    let { data } = $props();
    
    // 1. View state: 'list', 'create', or 'edit'
    let viewMode = $state('list');
    let activeId = $state<string | number | null>(null); // Track which ID we are editing

    let suites = $derived(data.list);
    let total = $derived(data.total);

    // Enter Edit Mode
    function enterEditMode(id: string | number) {
        activeId = id;
        viewMode = 'edit';
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        const res = await fetch(`/api/super_suite?id=${id}`, { method: 'DELETE' });
        if (res.ok) invalidateAll(); 
    }

    function handleSuccess() {
        viewMode = 'list';
        activeId = null;
        invalidateAll();
    }

    function handleCancel() {
        viewMode = 'list';
        activeId = null;
    }
</script>

<div class="container-fluid mt-4 px-4">
    {#if viewMode === 'list'}
        <div in:fade={{ duration: 200 }}>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="fw-bold text-dark mb-1">Super Suite Management</h2>
                    <p class="text-muted small mb-0">Total combined test suites: {total}</p>
                </div>
                <button class="btn btn-primary px-4 py-2 shadow-sm rounded-pill" onclick={() => viewMode = 'create'}>
                    <i class="bi bi-plus-lg me-1"></i> Create Super Suite
                </button>
            </div>

            <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light border-bottom">
                            <tr>
                                <th class="ps-4 py-3 small text-uppercase">ID</th>
                                <th class="py-3 small text-uppercase">Suite Name</th>
                                <th class="py-3 small text-uppercase">Creator</th>
                                <th class="py-3 small text-uppercase">Created At</th>
                                <th class="py-3 small text-uppercase">Updated At</th>
                                <th class="pe-4 py-3 text-end small text-uppercase">Actions</th>
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
                                                <li>
                                                    <!-- UI Change: Trigger local state instead of link -->
                                                    <button class="dropdown-item" onclick={() => enterEditMode(suite.id)}>
                                                        <i class="bi bi-pencil-square me-2 text-muted"></i>Edit Details
                                                    </button>
                                                </li>
                                                <li><hr class="dropdown-divider opacity-50"></li>
                                                <li><button class="dropdown-item text-danger" onclick={() => handleDelete(suite.id, suite.suite_name)}><i class="bi bi-trash3 me-2"></i>Delete Suite</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                <tr><td colspan="6" class="text-center py-5 text-muted">No Super Suites found.</td></tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination 
                total={data.total} 
                limit={data.limit} 
                current={data.currentPage} 
                onPageChange={(p) => goto(`?page=${p}`)} 
            />
        </div>

    {:else if viewMode === 'create'}
        <div in:fade={{ duration: 200 }}>
            <SuperSuiteCreate onSaveSuccess={handleSuccess} onCancel={handleCancel} />
        </div>

    {:else if viewMode === 'edit' && activeId}
        <div in:fade={{ duration: 200 }}>
            <SuperSuiteEditor 
                suiteId={activeId} 
                onSaveSuccess={handleSuccess} 
                onCancel={handleCancel} 
            />
        </div>
    {/if}
</div>

<style>
    /* Styles remain the same */
    .avatar-sm { width: 28px; height: 28px; font-size: 0.75rem; }
    .dropdown-item { cursor: pointer; }
</style>
