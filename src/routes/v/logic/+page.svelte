<script lang="ts">
    let count = $state(0);

    function increment() {
        count += 1;
    }

    function decrement() {
        count -= 1;
    }

    const colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "violet",
    ];
    let selected = $state(colors[0]);

    import Thing from './Thing.svelte';

	let things = $state([
		{ id: 1, name: 'apple' },
		{ id: 2, name: 'banana' },
		{ id: 3, name: 'carrot' },
		{ id: 4, name: 'doughnut' },
		{ id: 5, name: 'egg' }
	]);

    import { roll } from './logutils.ts';

	let promise = $state(roll());

</script>

<button class="btn btn-primary" onclick={increment}>
    + {count}
    {count === 1 ? "times" : "time"}
</button>

<button class="btn btn-primary" onclick={decrement}>
    - {count}
    {count === 1 ? "time" : "times"}
</button>

{#if count > 18}
    <p class="text-danger">{count} is greater than 18</p>
{:else if count > 12}
    <p class="text-success">
        Count is greater than 12, but less than 18: {count}
    </p>
{:else}
    <p class="text-success">Count is {count}</p>
{/if}

<h1 style="color: {selected}">Pick a colour</h1>

<div>
    {#each colors as color, i}
        <button 
            class="btn"
            style="background: {color};border-radius: 50%;"
            aria-label={color}
            aria-current={selected === color}
            onclick={() => (selected = color)}
            title={color}
        >
            {i + 1}
        </button>
    {/each}
</div>

<h5>

    This is the Keyed Each Block syntax in Svelte. It is used to give Svelte a unique identifier (a "key") for each item in a list.
What does it do?
The (thing.id) part tells Svelte: "Don't just look at the position in the array; look at this specific ID to track which DOM element belongs to which data object."
</h5>


<button class="btn btn-primary" onclick={() => things.shift()}>
	Remove first thing
</button>

{#each things as thing (thing.id)}
	<Thing name={thing.name} />
{/each}


<h3>
    Roll the dice
</h3>
<button class="btn btn-primary" onclick={() => promise = roll()}>
	roll the dice
</button>

{#await promise}
<p>...rolling</p>
{:then number}
	<p>----- {number}</p>
{:catch error}
	<p>error {error.message}</p>
{/await}

<!-- 


<style>
    h1 {
        font-size: 2rem;
        font-weight: 700;
        transition: color 0.2s;
    }

    div {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 5px;
        max-width: 400px;
    }

    button {
        aspect-ratio: 1;
        border-radius: 50%;
        background: var(--color, #fff);
        transform: translate(-2px, -2px);
        filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2));
        transition: all 0.1s;
        color: black;
        font-weight: 300;
        font-size: 1rem;
    }

    button[aria-current="true"] {
        transform: none;
        filter: none;
        box-shadow: inset 3px 3px 4px rgba(0, 0, 0, 0.2);
    }
</style> -->
