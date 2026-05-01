<script lang="ts">
    import { marked } from 'marked';
    import layout2page from './layout2.md?raw';
    const layout2html = marked.parse(layout2page);
</script>

<h1>Breaking out of layouts</h1>

<div>
    {@html layout2html}
</div>
