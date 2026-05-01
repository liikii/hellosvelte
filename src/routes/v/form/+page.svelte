<script lang="ts">
    import { enhance } from '$app/forms';
    
    interface Props {
        form: { success: boolean; message: string } | null;
    }
    // form 变量专门用来接收 actions 返回的结果
    let { form }: Props = $props();
</script>

<div style="padding: 20px;">
    <h1>简单表单</h1>

    {#if form?.success}
        <p style="color: green;">{form.message}</p>
    {/if}

    <!-- method="POST" 是关键，它会自动触发后端的 actions -->
    <form method="POST" use:enhance>
        <label>
            昵称:
            <input type="text" name="nickname" required />
        </label>
        <button type="submit">提交到后端</button>
    </form>
</div>


<pre>
### progressive form
无页面刷新表单
# 这一节核心总结（1、2、3、4 清晰版）
1. **基础原理**：SvelteKit 的 `form` **原生就支持无 JS 运行**，表单提交、页面刷新都能正常工作，保证应用健壮。
2. **渐进增强（+page.svelte）**：有 JS 时，从 `$app/forms` 导入 `enhance`，给表单加 `use:enhance` 指令，实现**无刷新提交**。
3. **use:enhance 自动做的事**：模拟原生表单行为，但**不整页刷新**；自动更新表单数据、重新执行 `load`、处理跳转/错误。
4. **优化体验（+page.svelte）**：无刷新后可以搭配 Svelte 过渡动画（`fly`/`slide`），让新增/删除 todo 有流畅动画效果。
</pre>

