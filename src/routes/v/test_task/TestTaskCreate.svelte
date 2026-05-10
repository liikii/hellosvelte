<script lang="ts">
    import { onMount } from 'svelte';

    let { onCancel, onSave } = $props();
    let superSuites = $state<any[]>([]);
    let formData = $state({
        super_suite_id: '',
        test_host: '',
        test_host_usr: '',
        test_host_pwd: ''
    });

    onMount(async () => {
        const res = await fetch('/api/super_suite?limit=100'); // 获取可选套件
        const data = await res.json();
        superSuites = data.data;
    });

    async function submit() {
        const res = await fetch('/api/test_tasks', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        if (res.ok) onSave();
    }
</script>

<div class="card shadow-sm border-0 mx-auto" style="max-width: 600px;">
    <div class="card-header bg-white py-3"><h5 class="mb-0 fw-bold">创建新测试任务</h5></div>
    <div class="card-body p-4">
        <div class="mb-3">
            <label for="super_suite_id" class="form-label small fw-bold">选择 Super Suite</label>
            <select id="super_suite_id" class="form-select" bind:value={formData.super_suite_id}>
                <option value="">-- 请选择 --</option>
                {#each superSuites as ss}
                    <option value={ss.id}>{ss.suite_name}</option>
                {/each}
            </select>
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
            <button class="btn btn-primary flex-grow-1 fw-bold" onclick={submit}>立即创建任务</button>
        </div>
    </div>
</div>
