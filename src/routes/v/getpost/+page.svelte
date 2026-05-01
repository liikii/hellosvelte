<script lang="ts">
    let apiData = $state("");

    async function fetchData() {
        const response = await fetch('/v/getpost');
        const res = await response.json();
        apiData = JSON.stringify(res);
    }

    let result = $state("");

    // 测试 POST
    async function sendPost() {
        const response = await fetch('/v/getpost', {
            method: 'POST',
            body: JSON.stringify({ name: "小明", age: 18 }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        result = JSON.stringify(data);
    }

</script>


<button onclick={fetchData}>调用 API</button>
<p>结果：{apiData}</p>
<br>
<button onclick={sendPost}>发送 POST 请求</button>
<pre>{result}</pre>
