<script lang="ts">
    import { marked } from 'marked';
    import variable2page from './variable2.md?raw';
    const variable2html = marked.parse(variable2page);
</script>

<h1>Advanced routing</h1>

<div>
    {@html variable2html}
</div>
