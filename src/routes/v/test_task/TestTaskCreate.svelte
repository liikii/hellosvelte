<script lang="ts">
    import { onMount } from 'svelte';

    let { onCancel, onSave } = $props();
    let superSuites = $state<any[]>([]);
    
    // 1. 搜索关键词状态
    let suiteSearch = $state('');

    let formData = $state({
        super_suite_id: '',
        test_host: '',
        test_host_usr: '',
        test_host_pwd: ''
    });

    // 2. 本地筛选逻辑：根据 suiteSearch 过滤 superSuites
    let filteredSuites = $derived(
        superSuites.filter(ss => 
            ss.suite_name.toLowerCase().includes(suiteSearch.toLowerCase())
        )
    );

    onMount(async () => {
        const res = await fetch('/api/super_suite?limit=100'); 
        const data = await res.json();
        superSuites = data.data;
    });

    async function submit() {
        const res = await fetch('/api/test_task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) onSave();
    }
</script>

<div class="card shadow-sm border-0 mx-auto" style="max-width: 600px;">
    <div class="card-header bg-white py-3"><h5 class="mb-0 fw-bold">创建新测试任务</h5></div>
    <div class="card-body p-4">
        
        <!-- 3. Super Suite 选择区域 -->
        <div class="mb-3">
            <label for="suite_search" class="form-label small fw-bold">选择 Super Suite</label>
            
            <!-- 搜索输入框 -->
            <div class="input-group input-group-sm mb-2">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                <input 
                    id="suite_search"
                    type="text" 
                    class="form-control border-start-0 ps-0" 
                    placeholder="快速筛选套件名称..." 
                    bind:value={suiteSearch} 
                />
                {#if suiteSearch}
                    <button class="btn btn-outline-secondary" onclick={() => suiteSearch = ''} type="button">×</button>
                {/if}
            </div>

            <!-- 下拉框，数据源改为 filteredSuites -->
            <select 
                id="super_suite_id" 
                class="form-select" 
                bind:value={formData.super_suite_id}
                size={filteredSuites.length > 0 ? undefined : 1}
            >
                <option value="">-- 请选择 ({filteredSuites.length}) --</option>
                {#each filteredSuites as ss}
                    <option value={ss.id}>{ss.suite_name}</option>
                {/each}
            </select>
            
            {#if filteredSuites.length === 0 && suiteSearch}
                <div class="form-text text-danger mt-1">没有匹配的套件</div>
            {/if}
        </div>

        <div class="mb-3">
            <label for="test_host" class="form-label small fw-bold">测试主机 (IP)</label>
            <input id="test_host" type="text" class="form-control" bind:value={formData.test_host} placeholder="192.168.1.1" />
        </div>

        <div class="row">
            <div class="col-6 mb-3">
                <label for="test_host_usr" class="form-label small fw-bold">SSH 用户</label>
                <input id="test_host_usr" type="text" class="form-control" bind:value={formData.test_host_usr} />
            </div>
            <div class="col-6 mb-3">
                <label for="test_host_pwd" class="form-label small fw-bold">SSH 密码</label>
                <input id="test_host_pwd" type="password" class="form-control" bind:value={formData.test_host_pwd} />
            </div>
        </div>

        <div class="d-flex gap-2 mt-4">
            <button class="btn btn-light flex-grow-1" onclick={onCancel}>取消</button>
            <button 
                class="btn btn-primary flex-grow-1 fw-bold" 
                onclick={submit}
                disabled={!formData.super_suite_id || !formData.test_host}
            >
                立即创建任务
            </button>
        </div>
    </div>
</div>

<style>
    /* 解决搜索时下拉框文字抖动 */
    .form-select {
        transition: border-color 0.15s ease-in-out;
    }
</style>
