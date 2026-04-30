<script lang="ts">
    import { marked } from 'marked';
    import msg from './propstate.md?raw';

</script>


<div>
    {@html marked.parse(msg)}
</div>
