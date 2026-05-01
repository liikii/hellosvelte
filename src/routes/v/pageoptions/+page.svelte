<script lang="ts">
    import { marked } from 'marked';
    import pageoptions from './pageoptions.md?raw';
    const pageoptionspage = marked.parse(pageoptions);
</script>

<h1>page options</h1>

<div>
    {@html pageoptionspage}
</div>
