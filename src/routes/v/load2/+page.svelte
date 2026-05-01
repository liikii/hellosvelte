<script lang="ts">
    import { marked } from 'marked';
    import load2page from './load2.md?raw';
    const load2html = marked.parse(load2page);
</script>

<h1>Advanced routing</h1>

<div>
    {@html load2html}
</div>
