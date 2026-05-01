<script lang="ts">
    import { enhance } from '$app/forms';

    let creating = $state(false); // 控制加载状态
</script>

<h1>流畅交互表单</h1>

<form
    method="POST"
    action="?/create"
    use:enhance={() => {
        // 1. 提交瞬间：开始加载
        creating = true;

        return async ({ update }) => {
            // 2. 这里的 update() 会处理服务器返回的结果（更新 form 变量等）
            await update();
            // 3. 处理完成：关闭加载
            creating = false;
        };
    }}
>
    <input type="text" name="description" placeholder="写点什么..." required />
    
    <button type="submit" disabled={creating}>
        {creating ? '保存中...' : '立即保存'}
    </button>
</form>

{#if creating}
    <p>正在努力上传数据，请稍候...</p>
{/if}
