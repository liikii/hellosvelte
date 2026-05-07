<script lang="ts">
    import { goto } from '$app/navigation';
    let { data } = $props();

    // 状态管理
    let superSuiteName = $state('');
    let leftSearch = $state('');  // 左侧搜索
    let rightSearch = $state(''); // 右侧搜索
    let selectedIds = $state<string[]>([]);
    let isSubmitting = $state(false);

    // 逻辑：筛选左侧（库中且未被选中的）
    // let availableSuites = $derived(
    //     data.allSuites.filter((s: any) => 
    //         !selectedIds.includes(s.suite_id) && 
    //         s.suite_name.toLowerCase().includes(leftSearch.toLowerCase())
    //     )
    // );
    let availableSuites = $derived(
        data.allSuites.filter((s: any) => {
            // 1. 排除已选中的
            if (selectedIds.includes(s.suite_id)) return false;
            
            // 2. 处理空搜索
            if (!leftSearch.trim()) return true;

            // 3. 将输入按 "|" 拆分成数组，比如 "登录|注册" -> ["登录", "注册"]
            const keywords = leftSearch.toLowerCase().split('|').filter(k => k.trim() !== '');

            // 4. 只要 suite_name 包含其中任何一个关键词，就返回 true
            return keywords.some(k => s.suite_name.toLowerCase().includes(k));
        })
    );

    // 逻辑：筛选右侧（已选中的）
    // let selectedSuites = $derived(
    //     data.allSuites.filter((s: any) => 
    //         selectedIds.includes(s.suite_id) && 
    //         s.suite_name.toLowerCase().includes(rightSearch.toLowerCase())
    //     )
    // );
    let selectedSuites = $derived(
        data.allSuites.filter((s: any) => {
            if (!selectedIds.includes(s.suite_id)) return false;
            if (!rightSearch.trim()) return true;

            const keywords = rightSearch.toLowerCase().split('|').filter(k => k.trim() !== '');
            return keywords.some(k => s.suite_name.toLowerCase().includes(k));
        })
    );

    // 全选左侧当前筛选结果
    function selectAllVisible() {
        const idsToAdd = availableSuites.map((s: any) => s.suite_id);
        selectedIds = [...selectedIds, ...idsToAdd];
    }

    // 全删右侧当前筛选结果
    function deselectAllVisible() {
        const idsToRemove = selectedSuites.map((s: any) => s.suite_id);
        selectedIds = selectedIds.filter(id => !idsToRemove.includes(id));
    }

    async function handleSubmit() {
        if (!superSuiteName || selectedIds.length === 0) return;
        isSubmitting = true;
        try {
            const res = await fetch('/api/super_suite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: superSuiteName, suite_ids: selectedIds })
            });
            if (res.ok) goto('/v/mugen');
        } finally { isSubmitting = false; }
    }
</script>

<div class="container-fluid mt-3 px-4">
    <!-- 顶部名称与提交栏 -->
    <div class="card shadow-sm border-0 mb-3 bg-white">
        <div class="card-body d-flex align-items-center gap-3 py-2">
            <h5 class="fw-bold mb-0 text-nowrap">新建 Super Suite:</h5>
            <input type="text" class="form-control border-2 w-25" placeholder="输入套件名称..." bind:value={superSuiteName} />
            <div class="ms-auto d-flex align-items-center gap-3">
                <span class="text-muted small">已选择 <strong>{selectedIds.length}</strong> 个套件</span>
                <button class="btn btn-primary px-4 fw-bold" 
                    disabled={isSubmitting || !superSuiteName || selectedIds.length === 0}
                    onclick={handleSubmit}>
                    {isSubmitting ? '保存中...' : '确认发布'}
                </button>
            </div>
        </div>
    </div>

    <div class="row g-3">
        <!-- 左栏：待选库 (50%) -->
        <div class="col-md-6">
            <div class="card shadow-sm border-0 panel-height">
                <div class="card-header bg-white border-0 pt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold"><i class="bi bi-plus-circle me-2"></i>待选池</span>
                        <button class="btn btn-link btn-sm text-decoration-none p-0" onclick={selectAllVisible}>全选当前</button>
                    </div>
                    <input type="text" class="form-control form-control-sm bg-light" placeholder="搜索待选..." bind:value={leftSearch} />
                </div>
                <div class="card-body overflow-auto pt-2">
                    <div class="row g-2">
                        {#each availableSuites as suite}
                            <div class="col-auto">
                                <button class="btn btn-tile add" onclick={() => selectedIds.push(suite.suite_id)}>
                                    {suite.suite_name} <span class="ms-1 op-50">+</span>
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- 右栏：已选区 (50%) -->
        <div class="col-md-6">
            <div class="card shadow-sm border-0 panel-height border-start border-primary border-4">
                <div class="card-header bg-white border-0 pt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold text-primary"><i class="bi bi-check2-all me-2"></i>已选清单</span>
                        <button class="btn btn-link btn-sm text-danger text-decoration-none p-0" onclick={deselectAllVisible}>移除当前</button>
                    </div>
                    <input type="text" class="form-control form-control-sm bg-light" placeholder="搜索已选..." bind:value={rightSearch} />
                </div>
                <div class="card-body overflow-auto pt-2">
                    <div class="row g-2">
                        {#each selectedSuites as suite}
                            <div class="col-auto">
                                <button class="btn btn-tile remove active" onclick={() => selectedIds = selectedIds.filter(id => id !== suite.suite_id)}>
                                    {suite.suite_name} <span class="ms-1 op-50">×</span>
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .panel-height {
        height: calc(100vh - 160px);
    }

    /* 磁贴通用样式 */
    .btn-tile {
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 5px 12px;
        font-size: 0.85rem;
        transition: all 0.15s;
        background: white;
    }

    .btn-tile.add:hover {
        border-color: #0d6efd;
        color: #0d6efd;
        background: #f0f7ff;
    }

    .btn-tile.remove.active {
        background-color: #e7f1ff;
        border-color: #0d6efd;
        color: #0d6efd;
    }

    .btn-tile.remove.active:hover {
        background-color: #fff5f5;
        border-color: #dc3545;
        color: #dc3545;
    }

    .op-50 { opacity: 0.5; }

    /* 滚动条美化 */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
    .card-body:hover::-webkit-scrollbar-thumb { background: #ddd; }
</style>
