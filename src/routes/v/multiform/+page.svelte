<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
</script>

<h1>任务管理</h1>

{#if form?.success}
    <p style="color: blue;">{form.msg}</p>
{/if}

<!-- 表单 1: 调用 create -->
<form method="POST" action="?/create" use:enhance>
    <input type="text" name="description" placeholder="输入任务描述" required />
    <button type="submit">新增任务</button>
</form>

<hr />

<!-- 表单 2: 调用 delete -->
<form method="POST" action="?/delete" use:enhance>
    <input type="number" name="id" placeholder="输入任务 ID" required />
    <button type="submit" style="color: red;">删除任务</button>
</form>
