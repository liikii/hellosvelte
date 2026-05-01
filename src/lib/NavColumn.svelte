<script lang="ts">
	let { links } = $props();
</script>
<!-- 
<ul class="nav flex-column">
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
-->
<nav class="nav nav-pills flex-column">
	{#each links as link}
		<li class="nav-item">
			<a class="nav-link" href={link.path}>{link.name}</a>
		</li>
	{/each}
</nav>
