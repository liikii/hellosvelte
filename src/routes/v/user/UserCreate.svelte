<script lang="ts">
    import { fade } from 'svelte/transition';
    import MsgToast from "$lib/MsgToast.svelte"; // 根據您的路徑調整

    // Svelte 5 Runes 屬性聲明
    let { 
        show = $bindable(false), 
        onSaveSuccess 
    } = $props<{
        show: boolean;
        onSaveSuccess: () => void;
    }>();

    // 表單資料狀態
    let newUser = $state({
        name: '',
        mail: '',
        desc: '',
        user_status: 1
    });

    // Toast 狀態管理
    let toastShow = $state(false);
    let toastType = $state<'success' | 'danger' | 'warning' | 'info'>('success');
    let toastMsg = $state('');

    function triggerToast(msg: string, type: typeof toastType = 'success') {
        toastMsg = msg;
        toastType = type;
        toastShow = true;
    }

    // 關閉模態框
    function closeModal() {
        show = false;
    }

    // 提交表單保存
    async function saveUser() {
        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            const data = await res.json();

            if (res.ok) {
                triggerToast(data.message || "用戶新增成功！", "success");
                newUser = { name: '', mail: '', desc: '', user_status: 1 }; // 重置表單
                
                setTimeout(() => {
                    closeModal(); // 關閉彈窗
                    onSaveSuccess(); // 通知父元件刷新列表
                }, 1000);
            } else {
                triggerToast(data.message || "儲存失敗，請檢查資料", "danger");
            }
        } catch (e) {
            triggerToast("提交請求失敗，請聯絡管理員", "danger");
        }
    }
</script>

<!-- 
    核心修改：拋棄 JS 控制，直接用 Svelte 渲染流控制。
    只要 show 為 true，就直接加上 Bootstrap 5 的強制顯示類別 (d-block) 和半透明黑色背景遮罩
-->
{#if show}
<div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5); z-index: 1055;" transition:fade={{ duration: 150 }}>
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">新增用戶資訊</h5>
                <!-- 修改：關閉按鈕綁定原生事件 -->
                <button type="button" class="btn-close" onclick={closeModal} title="關閉"></button>
            </div>
            <div class="modal-body">
                <form onsubmit={(e) => { e.preventDefault(); saveUser(); }}>
                    <div class="mb-3">
                        <label for="userNameInput" class="form-label small fw-bold">用戶名</label>
                        <input id="userNameInput" type="text" class="form-control" bind:value={newUser.name} placeholder="輸入用戶名" required />
                    </div>
                    <div class="mb-3">
                        <label for="emailInput" class="form-label small fw-bold">郵箱</label>
                        <input id="emailInput" type="email" class="form-control" bind:value={newUser.mail} placeholder="example@mail.com" required />
                    </div>
                    <div class="mb-3">
                        <label for="descInput" class="form-label small fw-bold">用戶描述</label>
                        <textarea id="descInput" class="form-control" rows="3" bind:value={newUser.desc} placeholder="簡單描述一下用戶..."></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="statusInput" class="form-label small fw-bold">初始狀態</label>
                        <select id="statusInput" class="form-select" bind:value={newUser.user_status}>
                            <option value={1}>啟用</option>
                            <option value={2}>禁用</option>
                        </select>
                    </div>
                    <div class="modal-footer px-0 pb-0 border-0">
                        <!-- 修改：取消按鈕綁定原生事件 -->
                        <button type="button" class="btn btn-light" onclick={closeModal}>取消</button>
                        <button type="submit" class="btn btn-primary px-4">保存用戶</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{/if}

<!-- 元件內部掛載的 Toast 提示 -->
<MsgToast
    bind:show={toastShow}
    type={toastType}
    message={toastMsg}
    autoClose={true}
    duration={4000}
/>
