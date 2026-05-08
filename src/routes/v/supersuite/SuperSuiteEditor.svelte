<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';

    let { suiteId, onSaveSuccess, onCancel } = $props<{
        suiteId: string | number;
        onSaveSuccess: () => void;
        onCancel: () => void;
    }>();

    // --- 状态管理 ---
    let loading = $state(true);
    let isSubmitting = $state(false);
    let superSuiteName = $state('');
    let leftSearch = $state('');
    
    // 存储当前超级套件内选中的数据（包含 Suite 及其下的 Cases）
    let selectedSuites = $state<any[]>([]); 
    // 库中所有的 Suite 列表
    let allMugenSuites = $state<any[]>([]);
    // 用于存储每个 Suite 库中完整的用例列表（用于对比哪些没被选）
    let fullCasesMap = $state<Record<string, any[]>>({});

    // --- 初始化数据 ---
    onMount(async () => {
        try {
            const [detailRes, mugenRes] = await Promise.all([
                fetch(`/api/super_suite/${suiteId}`),
                fetch('/api/mugen')
            ]);
            
            const detail = await detailRes.json();
            const mugen = await mugenRes.json();

            superSuiteName = detail.super_suite_name;
            selectedSuites = detail.super_suite_data;
            allMugenSuites = mugen.suite_data;

            // 预加载已选 Suite 的全量用例，以便显示“待添加”部分
            for (const suite of selectedSuites) {
                await fetchFullCases(suite.suite_id);
            }
        } finally {
            loading = false;
        }
    });

    // 获取某个 Suite 下所有的可选用例
    async function fetchFullCases(sId: string) {
        if (fullCasesMap[sId]) return;
        const res = await fetch(`/api/mugen/case/${sId}`);
        const data = await res.json();
        fullCasesMap[sId] = data.cases;
    }

    // --- 核心逻辑 ---

    // 筛选左侧库（排除掉右侧已有的 Suite）
    let availableMugenSuites = $derived(
        allMugenSuites.filter(s => 
            !selectedSuites.some(ss => ss.suite_id === s.suite_id) &&
            s.suite_name.toLowerCase().includes(leftSearch.toLowerCase())
        )
    );

    // 添加整个 Suite
    async function addSuite(suite: any) {
        await fetchFullCases(suite.suite_id);
        // 默认添加该 Suite 下的所有用例
        const newEntry = {
            suite_id: suite.suite_id,
            suite_name: suite.suite_name,
            suite_cases: [...fullCasesMap[suite.suite_id]]
        };
        selectedSuites = [...selectedSuites, newEntry];
    }

    // 移除整个 Suite
    function removeSuite(sId: string) {
        selectedSuites = selectedSuites.filter(s => s.suite_id !== sId);
    }

    // 移除单个 Case
    function removeCase(sId: string, cId: string) {
        const suite = selectedSuites.find(s => s.suite_id === sId);
        if (suite) {
            suite.suite_cases = suite.suite_cases.filter((c: any) => c.case_id !== cId);
        }
    }

    // 添加单个 Case
    function addCase(sId: string, testCase: any) {
        const suite = selectedSuites.find(s => s.suite_id === sId);
        if (suite) {
            suite.suite_cases = [...suite.suite_cases, testCase];
        }
    }

    // 保存更新
    async function handleUpdate() {
        isSubmitting = true;
        try {
            const res = await fetch(`/api/super_suite/${suiteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    super_suite_name: superSuiteName,
                    super_suite_data: selectedSuites
                })
            });
            if (res.ok) onSaveSuccess();
        } finally {
            isSubmitting = false;
        }
    }
</script>

{#if loading}
    <div class="text-center py-5"><div class="spinner-border text-primary"></div></div>
{:else}
    <!-- 顶部操作栏 -->
    <div class="card shadow-sm border-0 mb-3 bg-white">
        <div class="card-body d-flex align-items-center gap-3 py-2">
            <button class="btn btn-outline-secondary btn-sm" onclick={onCancel}>返回</button>
            <h5 class="fw-bold mb-0">编辑:</h5>
            <input type="text" class="form-control border-2 w-50" bind:value={superSuiteName} />
            <button class="btn btn-primary ms-auto px-4 fw-bold" disabled={isSubmitting} onclick={handleUpdate}>
                {isSubmitting ? '保存中...' : '更新 Super Suite'}
            </button>
        </div>
    </div>

    <div class="row g-3">
        <!-- 左栏：库 -->
        <div class="col-md-4">
            <div class="card shadow-sm border-0 panel-height">
                <div class="card-header bg-white border-0 pt-3">
                    <h6 class="fw-bold text-secondary">添加测试套件库</h6>
                    <input type="text" class="form-control form-control-sm bg-light" placeholder="搜索库..." bind:value={leftSearch} />
                </div>
                <div class="card-body overflow-auto">
                    {#each availableMugenSuites as suite}
                        <button class="btn btn-tile-light w-100 text-start mb-2" onclick={() => addSuite(suite)}>
                            <i class="bi bi-plus-circle me-2"></i>{suite.suite_name}
                        </button>
                    {/each}
                </div>
            </div>
        </div>

        <!-- 右栏：精细化编辑器 -->
        <div class="col-md-8">
            <div class="card shadow-sm border-0 panel-height bg-light bg-opacity-50">
                <div class="card-header bg-white border-0 pt-3">
                    <h6 class="fw-bold text-primary">包含的套件与用例详情</h6>
                </div>
                <div class="card-body overflow-auto pt-2">
                    {#each selectedSuites as suite (suite.suite_id)}
                        <div class="card border-0 shadow-sm mb-3 rounded-3" in:slide>
                            <div class="card-header bg-white d-flex justify-content-between align-items-center border-0">
                                <span class="fw-bold"><i class="bi bi-collection me-2 text-primary"></i>{suite.suite_name}</span>
                                <button class="btn btn-sm btn-outline-danger border-0" onclick={() => removeSuite(suite.suite_id)}>移除套件</button>
                            </div>
                            <div class="card-body pt-0">
                                <div class="d-flex flex-wrap gap-2">
                                    <!-- 已选 Case -->
                                    {#each suite.suite_cases as c}
                                        <span class="badge bg-primary d-flex align-items-center gap-1 py-2 px-3">
                                            {c.case_name}
                                            <i class="bi bi-x-circle-fill cp" onclick={() => removeCase(suite.suite_id, c.case_id)}></i>
                                        </span>
                                    {/each}

                                    <!-- 未选 Case (计算得出) -->
                                    {#if fullCasesMap[suite.suite_id]}
                                        {#each fullCasesMap[suite.suite_id].filter(fc => !suite.suite_cases.some((sc: any) => sc.case_id === fc.case_id)) as fc}
                                            <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 d-flex align-items-center gap-1 py-2 px-3 cp-add" onclick={() => addCase(suite.suite_id, fc)}>
                                                <i class="bi bi-plus-lg"></i> {fc.case_name}
                                            </span>
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .panel-height { height: calc(100vh - 200px); }
    
    /* 库磁贴样式 */
    .btn-tile-light {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 10px;
        font-size: 0.9rem;
        transition: 0.2s;
    }
    .btn-tile-light:hover { background: #f0f7ff; border-color: #0d6efd; color: #0d6efd; }

    /* Case 交互样式 */
    .cp { cursor: pointer; opacity: 0.7; }
    .cp:hover { opacity: 1; }
    
    .cp-add { cursor: pointer; transition: 0.2s; }
    .cp-add:hover { background-color: #e9ecef !important; color: #000 !important; }

    .badge { font-weight: normal; border-radius: 6px; }
</style>
