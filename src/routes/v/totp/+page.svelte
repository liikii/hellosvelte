<script>
    import { onMount } from 'svelte';

    let username = 'test_user@domain.com';
    
    // --- 1. 首次绑定相关的状态 ---
    let qrCodeBase64 = $state(''); 
    let userInputToken = $state('');
    let statusMessage = $state('');
    let isSuccess = $state(false);
    let isLoading = $state(false);

    // --- 2. 日常验证相关的状态 ---
    let loginToken = $state('');
    let loginStatusMessage = $state('');
    let isLoginSuccess = $state(false);
    let isLoginLoading = $state(false);

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

    // 激活绑定逻辑
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

    // 日常二次身份验证登录逻辑（已修改以支持连续测试）
    async function verifyLogin() {
        if (loginToken.length !== 6) {
            loginStatusMessage = '请输入 6 位数字验证码';
            return;
        }
        isLoginLoading = true;
        loginStatusMessage = '';
        try {
            const res = await fetch('/api/checktotp', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, token: loginToken })
            });
            const result = await res.json();
            if (res.ok && result.success) {
                isLoginSuccess = true;
                loginStatusMessage = result.message;
                loginToken = ''; // 【核心修改点】验证成功后清空输入框，方便下一次测试
            } else {
                isLoginSuccess = false;
                loginStatusMessage = result.message || '验证失败';
            }
        } catch (err) {
            isLoginSuccess = false;
            loginStatusMessage = '请求失败，请检查后端服务';
        } finally {
            isLoginLoading = false;
        }
    }

    onMount(() => {
        initTotp();
    });
</script>

<div class="demo-wrapper">
    <!-- 左侧区域：首次启用与绑定 -->
    <main class="totp-container">
        <h2>1. 启用双重身份验证 (2FA)</h2>
        <p class="desc">请使用 Microsoft Authenticator 扫描下方二维码</p>

        <div class="qr-box">
            {#if qrCodeBase64}
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

    <!-- 右侧区域：日常登录验证窗口（已移除锁定限制，方便 Demo 连续测试） -->
    <section class="totp-container login-window">
        <h2>2. 安全登录验证窗口</h2>
        <p class="desc">检测到您的账户已开启二次加密，请输入验证码以完成登录。</p>
        
        <div class="shield-icon">🔐</div>

        <div class="verify-section">
            <label for="login-token">请输入验证器上实时的 6 位数：</label>
            <input 
                id="login-token"
                type="text" 
                maxlength="6" 
                placeholder="000000" 
                bind:value={loginToken}
                disabled={isLoginLoading} 
            />
            <!-- ↑ 【核心修改点】移除了 disabled 中的 isLoginSuccess 条件，使输入框永不锁定 -->
            
            <button onclick={verifyLogin} disabled={isLoginLoading} class="btn-success">
                {isLoginLoading ? '正在校验...' : '确认安全登录'}
            </button>
            <!-- ↑ 【核心修改点】移除了按钮的锁定条件，只在加载中禁用，可无限重复点击测试 -->
        </div>

        {#if loginStatusMessage}
            <p class="status-msg" class:success={isLoginSuccess} class:error={!isLoginSuccess}>
                {loginStatusMessage}
            </p>
        {/if}
    </section>
</div>

<style>
    .demo-wrapper {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
        margin-top: 40px;
    }
    .totp-container {
        width: 380px;
        padding: 30px;
        border: 1px solid #eaeaea;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        text-align: center;
        background: #fff;
    }
    .login-window {
        border-top: 4px solid #28a745;
    }
    .shield-icon {
        font-size: 48px;
        margin: 40px 0;
    }
    .desc { color: #666; font-size: 14px; margin-bottom: 20px; min-height: 40px;}
    .qr-box { min-height: 210px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .qr-box img { border: 1px solid #eee; padding: 6px; border-radius: 4px; }
    .verify-section { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    input { width: 160px; padding: 10px; font-size: 20px; text-align: center; letter-spacing: 4px; border: 1px solid #ccc; border-radius: 6px; }
    button { padding: 12px 24px; font-size: 14px; background-color: #0067b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; width: 160px;}
    .btn-success { background-color: #28a745; }
    button:disabled { background-color: #cccccc; cursor: not-allowed; }
    .status-msg { margin-top: 15px; font-size: 14px; font-weight: bold; }
    .success { color: #28a745; }
    .error { color: #dc3545; }
</style>
