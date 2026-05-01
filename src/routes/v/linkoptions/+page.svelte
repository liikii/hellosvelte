<script lang="ts">
    import { marked } from 'marked';
    import linkoptions from './linkoptions.md?raw';
    const linkoptionspage = marked.parse(linkoptions);
</script>


<div>
    {@html linkoptionspage}
</div>
