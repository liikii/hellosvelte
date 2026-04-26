<script>
	let { name, version, description, website } = $props();
    // let stuff = $props();
    // let { name, ...stuff } = $props();
</script>

<p>
	The <code>{name}</code> package is {description}. Download version {version} from
	<a href="https://www.npmjs.com/package/{name}">npm</a> and <a href={website}>learn more here</a>
</p>
