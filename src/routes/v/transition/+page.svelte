<script lang="ts">
    import { fade, fly } from "svelte/transition";
    let visible = $state(true);

    import { slide } from "svelte/transition";

    let items = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
    ];

    let showItems = $state(true);
    let i = $state(5);

    // #key
    const messages = [
        "reticulating splines...",
        "generating witty dialog...",
        "swapping time and space...",
        "640K ought to be enough for anybody",
        "checking the gravitational constant in your locale...",
        "keep calm and npm install",
        "counting backwards from Infinity",
        "I'm sorry Dave, I can't do that.",
        "adjusting flux capacitor...",
        "constructing additional pylons...",
        "rm -rf /",
    ];

    function typewriter(node: HTMLElement, { speed = 1 }) {
        const valid =
            node.childNodes.length === 1 &&
            node.childNodes[0].nodeType === Node.TEXT_NODE;

        if (!valid) {
            throw new Error(
                `This transition only works on elements with a single text node child`,
            );
        }

        const text = node.textContent;
        const duration = text.length / (speed * 0.01);

        return {
            duration,
            tick: (t: number) => {
                const i = Math.trunc(text.length * t);
                node.textContent = text.slice(0, i);
            },
        };
    }

    let i_k= $state(-1);

    $effect(() => {
        const interval = setInterval(() => {
            i_k+= 1;
            i_k%= messages.length;
        }, 2500);

        return () => {
            clearInterval(interval);
        };
    });

</script>

<label>
    <input type="checkbox" bind:checked={visible} />
    visible
</label>

{#if visible}
    <p transition:fade>Fades in and out</p>
{/if}

{#if visible}
    <p transition:fly={{ y: 200, duration: 2000 }}>Fades in and out</p>
{/if}

{#if visible}
    <p in:fly={{ y: 200, duration: 2000 }}>Flies in</p>
{/if}

{#if visible}
    <p out:fly={{ y: 200, duration: 2000 }}>Flies out</p>
{/if}

<h6>Custom CSS transitions</h6>
<p>照着模板写</p>

<h6>transition event</h6>
<p>onintrostart 进入时触发</p>
<p>onoutrostart 退出时触发</p>
<p>onintroend 进入完成时触发</p>
<p>onoutroend 退出完成时触发</p>

<h6>Global transitions</h6>
<p>全局过渡</p>

<label>
    <input type="checkbox" bind:checked={showItems} />
    show list
</label>

<label>
    <input type="range" bind:value={i} max="10" />
</label>

{#if showItems}
    {#each items.slice(0, i) as item}
        <div transition:slide|global>
            {item}
        </div>
    {/each}
{/if}




<h1>#key i 的意思：当变量 i 发生变化时把里面的整个 DOM 删掉 → 重新创建一个新的而不是更新内容。</h1>

{#key i_k}
<p in:typewriter={{ speed: 10 }}>
    {messages[i_k] || ''}
</p>
{/key}
