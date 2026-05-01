<script lang="ts">
    import { marked } from 'marked';
    import hook from './hook.md?raw';
    const hookpage = marked.parse(hook);
</script>

<h1>hello world</h1>
<a href="/v/hook"> to hook </a>

<div>
    {@html hookpage}
</div>
