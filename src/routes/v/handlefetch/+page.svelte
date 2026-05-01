<script lang="ts">
    import { marked } from 'marked';
    import fetch from './fetch.md?raw';
    const fetchpage = marked.parse(fetch);
</script>

<h1>handle server fetch error</h1>

<div>
    {@html fetchpage}
</div>
