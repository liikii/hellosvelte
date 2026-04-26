<script>
	import Nested from './child.svelte';
    import PackageInfo from './PackageInfo.svelte';

    const pkg = {
		name: 'svelte',
		version: 5,
		description: 'blazing fast',
		website: 'https://svelte.dev'
	};
</script>

<h2 class="text-primary">In any real application, you'll need to pass data from one component down to its children.</h2>

<Nested answer={56} />
<Nested answer={57} />
<Nested />

<PackageInfo {...pkg} />

<PackageInfo
	name='abc'
	version={pkg.version}
	description={pkg.description}
	website={pkg.website}
/>
