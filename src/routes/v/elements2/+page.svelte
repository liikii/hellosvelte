<script>
  let w = $state(0);
  let h = $state(0);
  let oW = $state(0);
  let oH = $state(0);
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} bind:outerWidth={oW} bind:outerHeight={oH} />

<pre>The list of properties you can bind to is as follows:

innerWidth
innerHeight
outerWidth
outerHeight
scrollX
scrollY
online — an alias for window.navigator.onLine
</pre>

<div>
  <h1>窗口大小：</h1>
  <p>宽度: <strong>{w}</strong> px</p>
  <p>高度: <strong>{h}</strong> px</p>
  <p>外部宽度: <strong>{oW}</strong> px</p>
  <p>外部高度: <strong>{oH}</strong> px</p>
</div>
