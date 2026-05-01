<script lang="ts">
	import { page } from "$app/state";
</script>

<h4>To create routes with dynamic parameters, use square brackets 
	around a valid variable name. For example, a file like src/routes/blog/[slug]/+page.
	svelte will create a route that matches /blog/one, /blog/two, /blog/three and so on.</h4>
<!-- 使用 $ 符号访问 store 的值 -->
<h1>正在阅读文章：{ page.params.slug }</h1>
