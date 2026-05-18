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

    // 存储各个 Suite 独立的 Pattern 过滤输入框状态
    let suitePatterns = $state<Record<string, string>>({});

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
        // 初始化当前 Suite 的 pattern 字符串
        suitePatterns[sId] = '';
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
        if (suitePatterns[sId] !== undefined) {
            delete suitePatterns[sId];
        }
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
            // 防止重复添加
            if (!suite.suite_cases.some((c: any) => c.case_id === testCase.case_id)) {
                suite.suite_cases = [...suite.suite_cases, testCase];
            }
        }
    }

    // --- Pattern 过滤匹配核心衍生与执行机制 ---
    
    // 安全获取正则匹配结果的方法
    function getMatchedCasesForSuite(sId: string, currentSelectedCases: any[]) {
        const pattern = suitePatterns[sId] || '';
        const fullCases = fullCasesMap[sId] || [];
        if (!pattern.trim() || fullCases.length === 0) return { appendable: [], removable: [] };

        try {
            const regexStr = pattern.trim().split('|').filter(Boolean).join('|');
            if (!regexStr) return { appendable: [], removable: [] };
            const regex = new RegExp(regexStr, 'i');

            // 1. 找出全量库中命中的案例
            const matchedFull = fullCases.filter(c => regex.test(c.case_name));
            
            // 2. 属于“当前可追加”的：存在于全量库命中，但目前还没有被选择的
            const appendable = matchedFull.filter(fc => !currentSelectedCases.some(sc => sc.case_id === fc.case_id));
            
            // 3. 属于“当前可移除”的：目前已经被选择，且名字符合正则特征的
            const removable = currentSelectedCases.filter(sc => regex.test(sc.case_name));

            return { appendable, removable };
        } catch (e) {
            return { appendable: [], removable: [] }; // 防御非法字符异常
        }
    }

    // 批量追加匹配用例
    function batchAppendByPattern(sId: string, appendableCases: any[]) {
        const suite = selectedSuites.find(s => s.suite_id === sId);
        if (suite && appendableCases.length > 0) {
            suite.suite_cases = [...suite.suite_cases, ...appendableCases];
            suitePatterns[sId] = ''; // 操作成功清空输入栏
        }
    }

    // 批量删除匹配用例
    function batchRemoveByPattern(sId: string, removableCases: any[]) {
        const suite = selectedSuites.find(s => s.suite_id === sId);
        if (suite && removableCases.length > 0) {
            const removeIds = new Set(removableCases.map(c => c.case_id));
            suite.suite_cases = suite.suite_cases.filter((c: any) => !removeIds.has(c.case_id));
            suitePatterns[sId] = ''; // 操作成功清空输入栏
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
        <!-- 左栏：测试套件选择库 -->
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

        <!-- 右栏：精细化组合编辑器 -->
        <div class="col-md-8">
            <div class="card shadow-sm border-0 panel-height bg-light bg-opacity-50">
                <div class="card-header bg-white border-0 pt-3">
                    <h6 class="fw-bold text-primary">包含的套件与用例详情</h6>
                </div>
                <div class="card-body overflow-auto pt-2">
                    {#each selectedSuites as suite (suite.suite_id)}
                        {@const matchResult = getMatchedCasesForSuite(suite.suite_id, suite.suite_cases)}
                        <div class="card border-0 shadow-sm mb-3 rounded-3" in:slide>
                            <div class="card-header bg-white d-flex justify-content-between align-items-center border-0 pb-0">
                                <span class="fw-bold"><i class="bi bi-collection me-2 text-primary"></i>{suite.suite_name}</span>
                                <button class="btn btn-sm btn-outline-danger border-0" onclick={() => removeSuite(suite.suite_id)}>移除套件</button>
                            </div>

                            <!-- 注入功能：Pattern 批量管理面板 -->
                            <div class="px-3 py-2 bg-light border-top border-bottom my-2">
                                <div class="row g-2 align-items-center">
                                    <div class="col-sm-6">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-regex"></i></span>
                                            <input 
                                                type="text" 
                                                class="form-control form-control-sm border-start-0 font-monospace text-sm" 
                                                placeholder="过滤规则 (如 login|v2_.*)" 
                                                bind:value={suitePatterns[suite.suite_id]} 
                                            />
                                        </div>
                                    </div>
                                    <div class="col-sm-6 d-flex gap-2 justify-content-end">
                                        <button 
                                            type="button" 
                                            class="btn btn-xs btn-success text-nowrap fw-bold"
                                            disabled={matchResult.appendable.length === 0}
                                            onclick={() => batchAppendByPattern(suite.suite_id, matchResult.appendable)}
                                        >
                                            <i class="bi bi-plus-lg me-1"></i>追加 ({matchResult.appendable.length})
                                        </button>
                                        <button 
                                            type="button" 
                                            class="btn btn-xs btn-outline-danger text-nowrap fw-bold"
                                            disabled={matchResult.removable.length === 0}
                                            onclick={() => batchRemoveByPattern(suite.suite_id, matchResult.removable)}
                                        >
                                            <i class="bi bi-dash-lg me-1"></i>移除 ({matchResult.removable.length})
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="card-body pt-1">
                                <div class="d-flex flex-wrap gap-2">
                                    <!-- 已选择加入的 Case 标签 -->
                                    {#each suite.suite_cases as c}
                                        <!-- 判断当前 case 是否在匹配移除的正则中 -->
                                        {@const isMatchedToRemove = matchResult.removable.some(rc => rc.case_id === c.case_id)}
                                        <span class="badge bg-primary d-flex align-items-center gap-1 py-2 px-3">
                                            <!-- 关键点：如果是命中的用例，图标变成红色高亮的减号 -->
                                            <i class="bi {isMatchedToRemove ? 'bi-dash-circle text-warning fw-bold' : 'bi-check-circle'}"></i>
                                            <span class:text-warning={isMatchedToRemove} class:fw-bold={isMatchedToRemove}>
                                                {c.case_name}
                                            </span>
                                            <button 
                                                type="button" 
                                                class="btn p-0 border-0 lh-1 text-white opacity-75 btn-remove-badge ms-1" 
                                                onclick={() => removeCase(suite.suite_id, c.case_id)}
                                                aria-label="移除用例"
                                            >
                                                <i class="bi bi-x-circle-fill"></i>
                                            </button>
                                        </span>
                                    {/each}

                                    <!-- 待挑选加入的剩余库 Case 标签 -->
                                    {#if fullCasesMap[suite.suite_id]}
                                        {#each fullCasesMap[suite.suite_id].filter(fc => !suite.suite_cases.some((sc: any) => sc.case_id === fc.case_id)) as fc}
                                            <!-- 判断当前 case 是否在匹配追加的正则中 -->
                                            {@const isMatchedToAppend = matchResult.appendable.some(ac => ac.case_id === fc.case_id)}
                                            <button 
                                                type="button" 
                                                class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 d-flex align-items-center gap-1 py-2 px-3 cp-add" 
                                                class:border-success={isMatchedToAppend}
                                                class:text-success={isMatchedToAppend}
                                                onclick={() => addCase(suite.suite_id, fc)}
                                            >
                                                <!-- 关键点：如果是命中待追加的用例，图标高亮变成绿色加号 -->
                                                <i class="bi {isMatchedToAppend ? 'bi-plus-circle text-success fw-bold' : 'bi-plus-lg'}"></i> 
                                                <span class:fw-bold={isMatchedToAppend}>{fc.case_name}</span>
                                            </button>
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

    /* Case 单元交互样式 */
    .cp-add { cursor: pointer; transition: 0.2s; text-align: left; }
    .cp-add:hover { background-color: #e9ecef !important; color: #000 !important; }

    .btn-remove-badge { transition: opacity 0.2s; }
    .btn-remove-badge:hover { opacity: 1 !important; }

    .badge { font-weight: normal; border-radius: 6px; }
    
    /* 自定义紧凑按钮样式仅用于 Pattern Bar */
    .btn-xs {
        padding: 0.25rem 0.4rem;
        font-size: 0.75rem;
        border-radius: 0.25rem;
    }
    .text-sm { font-size: 0.8rem; }
</style>
