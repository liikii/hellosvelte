<script lang="ts">
    import MsgToast from '$lib/MsgToast.svelte';

    interface TaskData {
        id: string;
        test_host: string;
        test_host_usr: string;
        test_host_pwd: string;
    }

    // Svelte 5 Runes 属性声明
    // 使用 bindable 让父组件可以通过绑定 open 状态来控制弹窗显示/隐藏
    let { 
        task = $bindable(), 
        open = $bindable(false) 
    } = $props<{ 
        task: TaskData; 
        open: boolean; 
    }>();

    let showPwd = $state(false);
    let isTesting = $state(false);
    let isSaving = $state(false);

    // Toast 状态
    let toastShow = $state(false);
    let toastType = $state<'success' | 'danger' | 'warning' | 'info'>('success');
    let toastMsg = $state('');

    function showToast(msg: string, type: typeof toastType = 'success') {
        toastMsg = msg;
        toastType = type;
        toastShow = true;
    }

    // 1. 连接测试 (POST)
    async function handleTestConnection() {
        isTesting = true;
        try {
            const res = await fetch('/api/host_check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    test_host: task.test_host,
                    test_host_usr: task.test_host_usr,
                    test_host_pwd: task.test_host_pwd
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast(data.message || '连接测试成功！', 'success');
            } else {
                showToast(data.message || '连接测试失败！', 'danger');
            }
        } catch (err) {
            showToast('网络请求失败！', 'danger');
        } finally {
            isTesting = false;
        }
    }

    // 2. 保存更新 (PUT -> /api/test_task/[id])
    async function handleSave() {
        isSaving = true;
        try {
            // 动态拼接 URL 路径
            const res = await fetch(`/api/test_task/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    test_host: task.test_host,
                    test_host_usr: task.test_host_usr,
                    test_host_pwd: task.test_host_pwd
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast(data.message || '配置保存成功！', 'success');
                setTimeout(() => { open = false; }, 800); // 延迟关闭让用户看清成功提示
            } else {
                showToast(data.message || '保存失败！', 'danger');
            }
        } catch (err) {
            showToast('保存请求失败！', 'danger');
        } finally {
            isSaving = false;
        }
    }
</script>

{#if open}
<div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5); z-index: 1055;">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <!-- 关键修改：Task ID 放入标题行展示，不再占用表单空间 -->
                <h5 class="modal-title fw-bold">
                    <i class="bi bi-shield-check me-2 text-primary"></i>Host 检查与配置
                    <span class="badge bg-secondary ms-2 font-monospace fs-6">#{task.id}</span>
                </h5>
                <button type="button" class="btn-close" onclick={() => open = false}></button>
            </div>
            <div class="modal-body">
                <!-- 移除原有的 Task ID input 框 -->
                <div class="mb-3">
                    <label for="host" class="form-label small fw-bold">Test Host</label>
                    <input id="host" type="text" class="form-control" bind:value={task.test_host} />
                </div>

                <div class="row">
                    <div class="col-5 mb-3">
                        <label for="usr" class="form-label small fw-bold">SSH 用户</label>
                        <input id="usr" type="text" class="form-control" bind:value={task.test_host_usr} />
                    </div>
                    <div class="col-7 mb-3">
                        <label for="pwd" class="form-label small fw-bold">SSH 密码</label>
                        <div class="input-group">
                            <input id="pwd" type={showPwd ? "text" : "password"} class="form-control" bind:value={task.test_host_pwd} />
                            <button 
                                class="btn btn-outline-secondary" 
                                type="button"
                                onmousedown={() => showPwd = true}
                                onmouseup={() => showPwd = false}
                                onmouseleave={() => showPwd = false}
                            >
                                <i class="bi {showPwd ? 'bi-eye-slash' : 'bi-eye'}"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-info text-white" onclick={handleTestConnection} disabled={isTesting}>
                    {#if isTesting}
                        <span class="spinner-border spinner-border-sm me-1"></span>测试中...
                    {:else}
                        <i class="bi bi-lightning-fill me-1"></i>连接测试
                    {/if}
                </button>
                <div>
                    <!-- 已移除取消按钮 -->
                    <button type="button" class="btn btn-primary" onclick={handleSave} disabled={isSaving}>
                        {#if isSaving}
                            <span class="spinner-border spinner-border-sm me-1"></span>保存中...
                        {:else}
                            <i class="bi bi-download me-1"></i>保存
                        {/if}
                    </button>
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
    duration={6000}
/>
