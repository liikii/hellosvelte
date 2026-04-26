<script lang="ts">
	const emojis: Record<string, string> = {
		apple: '🍎',
		banana: '🍌',
		carrot: '🥕',
		doughnut: '🍩',
		egg: '🥚'
	};

    // type EmojiKey = keyof typeof emojis; // => 'apple' | 'banana' | 'carrot' | 'doughnut' | 'egg'

	// `name` is updated whenever the prop value changes...
	// let { name }: { name: EmojiKey } = $props();
    let { name }: { name: keyof typeof emojis } = $props();
    // let {name} = $props();
    // let { name }: { name: keyof typeof emojis } = $props();
	// ...but `emoji` is fixed upon initialisation
	const emoji = $derived(emojis[name]);
</script>

<p>{emoji} = {name}</p>
