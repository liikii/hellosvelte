<script lang="ts">
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import MsgToast from '$lib/MsgToast.svelte';

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
            // 如果当前存在已选套件，默认展开第一个
            if (selectedSuites && selectedSuites.length > 0) {
                activeSuiteId = selectedSuites[0].suite_id;
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

     // ✨ 新增：Toast 状态管理
    let toastShow = $state(false);
    let toastType = $state<'success' | 'danger' | 'warning' | 'info'>('success');
    let toastMsg = $state('');

    // ✨ 封装触发 Toast 的快捷函数
    function showToast(msg: string, type: typeof toastType = 'success') {
        toastMsg = msg;
        toastType = type;
        toastShow = true;
    }

    // 保存更新
    async function handleUpdate() {
        isSubmitting = true;
        try {
            const cleanedSuites = selectedSuites.filter(
                suite => suite.suite_cases && suite.suite_cases.length > 0
            );

            const res = await fetch(`/api/super_suite/${suiteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    super_suite_name: superSuiteName,
                    super_suite_data: cleanedSuites
                })
            });

            const data = await res.json();

            if (res.ok) {
                // 成功回显
                showToast(data.message || 'Super Suite 更新成功！', 'success');
                // 延迟执行成功回调，让用户看清 Toast 提示
                setTimeout(() => {
                    onSaveSuccess();
                }, 1500);
            } else {
                // 业务级失败回显（如后端拦截报错）
                showToast(data.message || '更新失败，请重试！', 'danger');
            }
        } catch (err) {
            // 网络级或代码崩溃失败回显
            showToast('网络请求异常，请稍后重试！', 'danger');
        } finally {
            isSubmitting = false;
        }
    }

    let activeSuiteId = $state<string | null>(null);

    function addAllFilteredSuites() {
        availableMugenSuites.forEach(suite => {
            addSuite(suite);
        });
        leftSearch = '';
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

    <!-- 
        由于去掉了自定义 CSS 的 panel-height 计算，
        这里使用标准内联样式 style="height: calc(100vh - 160px);" 来维持固定高度滚动 
    -->
    <div class="row g-3" style="height: calc(100vh - 160px);">
        <!-- 左栏：测试套件选择库 -->
        <div class="col-md-3 h-100">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white border-0 pt-3 pb-2">
                    <h6 class="fw-bold text-secondary mb-2">添加测试套件库</h6>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control bg-light" placeholder="搜索库..." bind:value={leftSearch} />
                        <button 
                            class="btn btn-outline-primary" 
                            type="button" 
                            title="一键追加当前搜索到的所有套件"
                            disabled={availableMugenSuites.length === 0}
                            onclick={addAllFilteredSuites}
                        >
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
                <!-- 移除了自定义按钮样式，完全使用原生 btn-light + 紧凑 Padding (py-1 px-2) + 极小字号 (small) -->
                <div class="card-body overflow-auto pt-0 px-2">
                    {#each availableMugenSuites as suite}
                        <button 
                            class="btn btn-light border text-start w-100 mb-1 py-1 px-2 small text-truncate" 
                            onclick={() => addSuite(suite)}
                        >
                            <i class="bi bi-plus-lg me-1 text-success"></i>{suite.suite_name}
                        </button>
                    {/each}
                </div>
            </div>
        </div>

        <!-- 右栏：精细化组合编辑器 -->
        <div class="col-md-9 h-100">
            <div class="card shadow-sm border-0 h-100 bg-light bg-opacity-50">
                <div class="card-header bg-white border-0 pt-3 pb-1">
                    <h6 class="fw-bold text-primary">包含的套件与用例详情</h6>
                </div>
                <div class="card-body overflow-auto pt-1">
                    <div class="row g-2">
                        {#each selectedSuites as suite (suite.suite_id)}
                            {@const isOpen = activeSuiteId === suite.suite_id}
                            {@const matchResult = getMatchedCasesForSuite(suite.suite_id, suite.suite_cases)}
                            
                            <!-- 
                                网格系统：展开时占据一整行(col-12)，收起时呈现多行多列紧凑排布
                                完全利用 Bootstrap 内联边框颜色类进行状态高亮 
                            -->
                            <div class={isOpen ? "col-12" : "col-sm-6 col-md-4 col-lg-3"} in:slide>
                                <div 
                                    class="card border shadow-sm rounded-3 h-100" 
                                    class:border-primary={isOpen} 
                                    class:border-light={!isOpen}
                                >
                                    <!-- 
                                        卡片头部：通过样式类实现手势和 hover 背景
                                        使用 btn 类包裹头部实现原生的光标效果和点击态 
                                    -->
                                    <div 
                                        class="card-header bg-white d-flex justify-content-between align-items-center border-0 py-2"
                                        style="cursor: pointer; user-select: none;"
                                        role="button"
                                        tabindex="0"
                                        onclick={() => activeSuiteId = isOpen ? null : suite.suite_id}
                                        onkeydown={(e) => e.key === 'Enter' && (activeSuiteId = isOpen ? null : suite.suite_id)}
                                    >
                                        <span class="fw-bold text-truncate small" title={suite.suite_name}>
                                            <i class="bi {isOpen ? 'bi-chevron-down text-primary' : 'bi-chevron-right text-muted'} me-1"></i>
                                            {suite.suite_name}
                                        </span>
                                        <button 
                                            class="btn btn-link btn-sm p-0 text-danger border-0 text-decoration-none shadow-none" 
                                            onclick={(e) => { e.stopPropagation(); removeSuite(suite.suite_id); }}
                                            title="移除此套件"
                                        >
                                            <i class="bi bi-trash3"></i>
                                        </button>
                                    </div>

                                    {#if isOpen}
                                        <div class="bg-white border-top rounded-bottom" transition:slide>
                                            <!-- Pattern 批量管理面板 -->
                                            <div class="px-3 py-2 bg-light border-bottom">
                                                <div class="row g-2 align-items-center">
                                                    <div class="col-sm-7">
                                                        <div class="input-group input-group-sm">
                                                            <span class="input-group-text bg-white border-end-0 text-muted py-0 px-2">
                                                                <i class="bi bi-regex small"></i>
                                                            </span>
                                                            <!-- 通过 Bootstrap 的 style="font-size: 0.8rem;" 代替外部 class -->
                                                            <input 
                                                                type="text" 
                                                                class="form-control form-control-sm border-start-0 font-monospace" 
                                                                style="font-size: 0.8rem;"
                                                                placeholder="过滤规则 (如 login|v2_.*)" 
                                                                bind:value={suitePatterns[suite.suite_id]} 
                                                                onclick={(e) => e.stopPropagation()} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-5 d-flex gap-1 justify-content-end">
                                                        <button 
                                                            type="button" 
                                                            class="btn btn-success btn-sm text-nowrap py-0.5 px-2"
                                                            style="font-size: 0.75rem; border-radius: 4px;"
                                                            disabled={matchResult.appendable.length === 0}
                                                            onclick={(e) => { e.stopPropagation(); batchAppendByPattern(suite.suite_id, matchResult.appendable); }}
                                                        >
                                                            追加({matchResult.appendable.length})
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            class="btn btn-outline-danger btn-sm text-nowrap py-0.5 px-2"
                                                            style="font-size: 0.75rem; border-radius: 4px;"
                                                            disabled={matchResult.removable.length === 0}
                                                            onclick={(e) => { e.stopPropagation(); batchRemoveByPattern(suite.suite_id, matchResult.removable); }}
                                                        >
                                                            移除({matchResult.removable.length})
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="card-body pt-2 pb-3">
                                                <div class="d-flex flex-wrap gap-1">
                                                    <!-- 已选择加入的 Case 标签 -->
                                                    {#each suite.suite_cases as c}
                                                        {@const isMatchedToRemove = matchResult.removable.some(rc => rc.case_id === c.case_id)}
                                                        <span 
                                                            class="badge bg-primary d-flex align-items-center gap-1 py-1.5 px-2 font-monospace"
                                                            style="font-size: 0.75rem; font-weight: normal; border-radius: 4px;"
                                                        >
                                                            <i class="bi {isMatchedToRemove ? 'bi-dash-circle text-warning fw-bold' : 'bi-check-circle'}"></i>
                                                            <span class:text-warning={isMatchedToRemove} class:fw-bold={isMatchedToRemove}>
                                                                {c.case_name}
                                                            </span>
                                                            <button 
                                                                type="button" 
                                                                class="btn p-0 border-0 lh-1 text-white opacity-75 ms-1" 
                                                                style="font-size: 0.75rem;"
                                                                onclick={(e) => { e.stopPropagation(); removeCase(suite.suite_id, c.case_id); }}
                                                            >
                                                                <i class="bi bi-x-circle-fill"></i>
                                                            </button>
                                                        </span>
                                                    {/each}

                                                    <!-- 待挑选加入的剩余库 Case 标签（完全通过内联样式和原生组件表达） -->
                                                    {#if fullCasesMap[suite.suite_id]}
                                                        {#each fullCasesMap[suite.suite_id].filter(fc => !suite.suite_cases.some((sc: any) => sc.case_id === fc.case_id)) as fc}
                                                            {@const isMatchedToAppend = matchResult.appendable.some(ac => ac.case_id === fc.case_id)}
                                                            <button 
                                                                type="button" 
                                                                class="badge bg-secondary bg-opacity-10 text-secondary border d-flex align-items-center gap-1 py-1.5 px-2 text-start" 
                                                                style="font-size: 0.75rem; font-weight: normal; border-radius: 4px; cursor: pointer;"
                                                                class:border-success={isMatchedToAppend}
                                                                class:text-success={isMatchedToAppend}
                                                                class:border-secondary={!isMatchedToAppend}
                                                                class:border-opacity-25={!isMatchedToAppend}
                                                                onclick={(e) => { e.stopPropagation(); addCase(suite.suite_id, fc); }}
                                                            >
                                                                <i class="bi {isMatchedToAppend ? 'bi-plus-circle text-success fw-bold' : 'bi-plus-lg'}"></i> 
                                                                <span class:fw-bold={isMatchedToAppend}>{fc.case_name}</span>
                                                            </button>
                                                        {/each}
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    {#if !isOpen}
                                        <!-- 收起状态下，卡片底部垫个白底，保持多列排布时的视觉对齐 -->
                                        <div class="bg-white py-1"></div>
                                    {/if}
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}


<MsgToast
    bind:show={toastShow}
    type={toastType}
    message={toastMsg}
    autoClose={true}
    duration={4000}
/>


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
