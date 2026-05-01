<script lang="ts">
    import { marked } from 'marked';
    import route2page from './route2.md?raw';
    const route2html = marked.parse(route2page);
</script>

<h1>Advanced routing</h1>

<div>
    {@html route2html}
</div>
