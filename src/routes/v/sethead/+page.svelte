<script lang="ts">
    interface Props {
        data: { message: string };
    }
    let { data }: Props = $props();
</script>


<h1>{data.message}</h1>
<p>你看不到这个标题的样式，只能看到原始代码。</p>

<h3>set response headers demo</h3>
