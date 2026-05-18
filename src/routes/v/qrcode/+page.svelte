<script>
    import QrCode from "svelte-qrcode";

    // 使用 Svelte 5 的 $state 声明响应式变量
    let inputText = $state("");      // 绑定输入框的文本
    let qrValue = $state("");        // 实际生成二维码的文本

    // 提交处理逻辑
    function handleGenerate() {
        // 只有当文本不为空时才更新 qrValue
        qrValue = inputText.trim();
    }
</script>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">QR Code Generator</h4>
                </div>
                <div class="card-body text-center">
                    <!-- 输入表单 -->
                    <div class="mb-3">
                        <label for="textInput" class="form-label text-start d-block">输入文本或链接</label>
                        <textarea 
                            id="textInput"
                            class="form-control" 
                            rows="3" 
                            placeholder="在这里输入内容..."
                            bind:value={inputText}
                        ></textarea>
                    </div>

                    <button 
                        class="btn btn-primary w-100 mb-4" 
                        onclick={handleGenerate}
                        disabled={!inputText.trim()}
                    >
                        生成二维码
                    </button>

                    <!-- 二维码展示区域 -->
                    <div class="qr-container p-3 border rounded bg-light d-flex justify-content-center align-items-center" style="min-height: 200px;">
                        {#if qrValue}
                            <div class="text-center">
                                <QrCode value={qrValue} size="200" />
                                <p class="mt-2 text-muted small">内容: {qrValue}</p>
                            </div>
                        {:else}
                            <span class="text-muted italic">生成的二维码将显示在这里</span>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* 可以在这里添加额外的自定义样式 */
    .qr-container {
        transition: all 0.3s ease;
    }
</style>
