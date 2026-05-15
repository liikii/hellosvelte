<script>
    import { onMount } from 'svelte';

    let username = 'test_user@domain.com';
    let qrCodeBase64 = ''; // 存储后端传来的 Base64 图片
    let userInputToken = '';
    let statusMessage = '';
    let isSuccess = false;
    let isLoading = false;

    // 获取后端生成的 Base64 二维码
    async function initTotp() {
        try {
            const res = await fetch(`/api/totp?username=${encodeURIComponent(username)}`);
            const data = await res.json();
            
            if (res.ok) {
                qrCodeBase64 = data.qrCodeBase64;
            } else {
                statusMessage = data.message || '加载失败';
            }
        } catch (err) {
            statusMessage = '无法连接到服务器';
        }
    }

    // 激活绑定
    async function verifyAndBind() {
        if (userInputToken.length !== 6) {
            statusMessage = '请输入 6 位数字验证码';
            return;
        }

        isLoading = true;
        statusMessage = '';

        try {
            const res = await fetch('/api/totp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, token: userInputToken })
            });

            const result = await res.json();

            if (res.ok && result.success) {
                isSuccess = true;
                statusMessage = result.message;
            } else {
                isSuccess = false;
                statusMessage = result.message || '验证失败';
            }
        } catch (err) {
            isSuccess = false;
            statusMessage = '网络请求失败';
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        initTotp();
    });
</script>

<main class="totp-container">
    <h2>启用双重身份验证 (2FA)</h2>
    <p class="desc">请使用 Microsoft Authenticator 扫描下方二维码</p>

    <div class="qr-box">
        {#if qrCodeBase64}
            <!-- 直接将 Base64 字符串作为 src 渲染 -->
            <img src={qrCodeBase64} alt="TOTP 安全二维码" />
        {:else if statusMessage && !isSuccess}
            <p class="error">{statusMessage}</p>
        {:else}
            <p>正在生成安全二维码...</p>
        {/if}
    </div>

    <div class="verify-section">
        <label for="token">输入手机上显示的 6 位数验证码：</label>
        <input 
            id="token"
            type="text" 
            maxlength="6" 
            placeholder="000000" 
            bind:value={userInputToken}
            disabled={isSuccess || isLoading}
        />
        
        <button onclick={verifyAndBind} disabled={isSuccess || isLoading}>
            {isLoading ? '验证中...' : '立即激活绑定'}
        </button>
    </div>

    {#if statusMessage && qrCodeBase64}
        <p class="status-msg" class:success={isSuccess} class:error={!isSuccess}>
            {statusMessage}
        </p>
    {/if}
</main>

<style>
    .totp-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 30px;
        border: 1px solid #eaeaea;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        text-align: center;
    }
    .desc { color: #666; font-size: 14px; margin-bottom: 20px; }
    .qr-box { min-height: 210px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .qr-box img { border: 1px solid #eee; padding: 6px; border-radius: 4px; }
    .verify-section { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    input { width: 160px; padding: 10px; font-size: 20px; text-align: center; letter-spacing: 4px; border: 1px solid #ccc; border-radius: 6px; }
    button { padding: 12px 24px; font-size: 14px; background-color: #0067b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; width: 160px;}
    button:disabled { background-color: #cccccc; cursor: not-allowed; }
    .status-msg { margin-top: 15px; font-size: 14px; font-weight: bold; }
    .success { color: #28a745; }
    .error { color: #dc3545; }
</style>
