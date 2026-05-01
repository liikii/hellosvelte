<script lang="ts">
	let name = $state('world');
	let a = $state(1);
	let b = $state(2);
	let yes = $state(false);

	interface Question {
		id: number;
		text: string;
	}
	
	let questions: Question[] = [
		{
			id: 1,
			text: `Where did you go to school?`
		},
		{
			id: 2,
			text: `What is your mother's name?`
		},
		{
			id: 3,
			text: `What is another personal fact that an attacker could easily find with Google?`
		}
	];

	let selected =  $state<Question>(questions[0]);

	let answer = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		let msg =`answered question ${selected.id} (${selected.text}) with "${answer}"`;
		console.log(msg);
		
	}

	let scoops = $state(1);
	let flavours = $state([]);

	const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

	import { marked } from 'marked';
	let value = $state(`Some words are *italic*, some are **bold**\n\n- lists\n- are\n- cool`);
</script>

<input bind:value={name} />

<h1>Hello {name}!</h1>


<label>
	<input type="number" bind:value={a} min="0" max="10" />
	<input type="range" bind:value={a} min="0" max="10" />
</label>

<label>
	<input type="number" bind:value={b} min="0" max="10" />
	<input type="range" bind:value={b} min="0" max="10" />
</label>

<p>{a} + {b} = {a + b}</p>

<h6>Checkbox</h6>
<label>
	<input type="checkbox" bind:checked={yes} />
	Yes! Send me regular email spam
</label>

{#if yes}
	<p>
		Thank you. We will bombard your inbox and sell
		your personal details.
	</p>
{:else}
	<p>
		You must opt in to continue. If you're not
		paying, you're the product.
	</p>
{/if}

<button class="btn btn-primary" disabled={!yes}>Subscribe</button>

<h6>select</h6>

<h2>Insecurity questions</h2>

<form onsubmit={handleSubmit}>
	<select
		bind:value={selected}
		onchange={() => (answer = '')}
	>
		{#each questions as question}
			<option  value={question}>
				{question.text}
			</option>
		{/each}
	</select>

	<input bind:value={answer} />

	<button disabled={!answer} type="submit">
		Submit
	</button>
</form>

<p>
	selected question {selected
		? selected.id
		: '[waiting...]'}
</p>

<br>


<h2>Size</h2>

{#each [1, 2, 3] as number}
	<label>
		<input
			type="radio"
			name="scoops"
			value={number}
			bind:group={scoops}
		/>

		{number} {number === 1 ? 'scoop' : 'scoops'}
	</label>
{/each}

<h2>Flavours</h2>

{#each ['cookies and cream', 'mint choc chip', 'raspberry ripple'] as flavour}
	<label>
		<input
			type="checkbox"
			name="flavours"
			value={flavour}
			bind:group={flavours}
		/>

		{flavour}
	</label>
{/each}

{#if flavours.length === 0}
	<p>Please select at least one flavour</p>
{:else if flavours.length > scoops}
	<p>Can't order more flavours than scoops!</p>
{:else}
	<p>
		You ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'}
		of {formatter.format(flavours)}
	</p>
{/if}


<h2>multiple selection</h2>
<h2>Size</h2>

{#each [1, 2, 3] as number}
	<label>
		<input
			type="radio"
			name="scoops"
			value={number}
			bind:group={scoops}
		/>

		{number} {number === 1 ? 'scoop' : 'scoops'}
	</label>
{/each}

<h2>Flavours</h2>

<select multiple bind:value={flavours}>
{#each ['cookies and cream', 'mint choc chip', 'raspberry ripple'] as flavour}
	<option>{flavour}</option>
{/each}
</select>

{#if flavours.length === 0}
	<p>Please select at least one flavour</p>
{:else if flavours.length > scoops}
	<p>Can't order more flavours than scoops!</p>
{:else}
	<p>
		You ordered {scoops} {scoops === 1 ? 'scoop' : 'scoops'}
		of {formatter.format(flavours)}
	</p>
{/if}

<h3>textarea</h3>
<!-- 
<div >
	input
	<textarea bind:value={value}></textarea>

	output
	<div>{@html marked(value)}</div>
</div> -->
<div class="container mt-4">
	<div class="mb-3">
		<label for="markdown-input" class="form-label fw-bold">Input (Markdown)</label>
		<!-- Added form-control for styling and rows for initial height -->
		<textarea 
			id="markdown-input"
			class="form-control" 
			rows="5" 
			bind:value={value} 
			placeholder="Type some markdown here..."
		></textarea>
	</div>

	<div class="mb-3">
		<span>Output (Preview)</span>
		<!-- Added card for a clean boxed look and p-3 for internal spacing -->
		<div class="card bg-light">
			<div class="card-body border-start border-primary border-4 py-2">
				<div class="prose">
					{@html marked(value)}
				</div>
			</div>
		</div>
	</div>
</div>
