<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { goto } from '$app/navigation';

  // ========== Svelte5 状态定义 ==========
  let form = $state({
    username: '',
    password: '',
    captcha: ''
  });

  let loading = $state(false);
  let errorMsg = $state('');
  
  // 验证码 Mock 接口，完美贴合内页白底
  let captchaUrl = $state('dicebear.com'); 

  // 最新 $derived 计算属性
  let formValid = $derived(
    form.username?.trim() !== '' &&
    form.password?.trim() !== '' &&
    form.captcha?.trim() !== ''
  );

  function refreshCaptcha() {
    captchaUrl = `dicebear.com{Math.random()}`;
  }

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    if (!formValid) return;

    loading = true;
    errorMsg = '';

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.code === 0) {
        await goto('/v/user');
      } else {
        errorMsg = data.msg || '登录失败，请检查账号密码验证码';
      }
    } catch (err) {
      errorMsg = '网络请求异常，请稍后重试';
    } finally {
      loading = false;
    }
  }
</script>

<!-- 亮色系极简容器 -->
<div class="login-wrapper min-vh-100 d-flex align-items-center justify-content-center py-5">
  <div class="login-container w-100 px-3">
    
    <!-- 顶层精致卡片 -->
    <div class="card login-card border-0 shadow-sm mx-auto">
      <div class="card-body p-4 p-md-5">
        
        <!-- 头部区域：对齐内页列表的简约感 -->
        <div class="text-center mb-4">
          <div class="platform-logo mb-2">
            <svg xmlns="w3.org" width="28" height="28" fill="currentColor" class="text-primary" viewBox="0 0 16 16">
              <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
              <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </div>
          <h3 class="fw-bold text-dark mb-1">自动化测试套平台</h3>
          <p class="text-muted small">Automated Test Suite Control Center</p>
        </div>

        <!-- 异常提醒：对齐内页警告样式 -->
        {#if errorMsg}
          <div class="alert alert-danger custom-alert d-flex align-items-center justify-content-between mb-4 fade show" role="alert">
            <span class="small d-flex align-items-center gap-2">⚠️ {errorMsg}</span>
            <button type="button" class="btn-close small" onclick={() => errorMsg = ''} aria-label="Close"></button>
          </div>
        {/if}

        <!-- 登录表单 -->
        <form onsubmit={handleLogin}>
          
          <!-- 操作员账号 -->
          <div class="mb-3">
            <label for="username" class="form-label custom-label">操作员账号</label>
            <input
              id="username"
              type="text"
              class="form-control custom-input"
              bind:value={form.username}
              placeholder="请输入用户名或邮箱"
              autocomplete="username"
            />
          </div>

          <!-- 安全密码 -->
          <div class="mb-3">
            <label for="password" class="form-label custom-label">安全密码</label>
            <input
              id="password"
              type="password"
              class="form-control custom-input"
              bind:value={form.password}
              placeholder="请输入登录密码"
              autocomplete="current-password"
            />
          </div>

          <!-- 验证码：结构和色调与内页右上角筛选栏完全看齐 -->
          <div class="mb-4">
            <label for="captcha" class="form-label custom-label">图形验证码</label>
            <div class="row g-2">
              <div class="col-8">
                <input
                  id="captcha"
                  type="text"
                  class="form-control custom-input font-monospace text-uppercase"
                  bind:value={form.captcha}
                  placeholder="请输入四位验证码"
                  maxlength="6"
                />
              </div>
              <div class="col-4">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <img 
                  src={captchaUrl} 
                  alt="Captcha" 
                  class="captcha-img img-fluid w-100"
                  onclick={refreshCaptcha}
                  title="点击刷新验证码"
                />
              </div>
            </div>
          </div>

          <!-- 提交登录按钮：采用与内页“+ 常见任务”一模一样的商务正蓝色 -->
          <button
            type="submit"
            class="btn btn-primary btn-submit w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            disabled={!formValid || loading}
          >
            {#if loading}
              <span class="spinner-border spinner-border-sm" role="status"></span>
              <span>正在验证凭证...</span>
            {:else}
              <span class="fw-bold">登 录</span>
            {/if}
          </button>
        </form>

      </div>
    </div>
    
    <!-- 底部版权：和内页底部的分页行保持相同灰度 -->
    <div class="text-center mt-4 font-monospace text-muted text-xs">
      SYSTEM STATUS: <span class="text-success fw-bold">ONLINE</span> &nbsp;|&nbsp; POWERED BY SVELTE 5
    </div>
  </div>
</div>

<style>
  /* 【彻底重置底色】全面对齐内页背景的浅灰白（干净纯洁） */
  :global(body) {
    background-color: #f4f6f9 !important; /* 经典商务内页底色 */
    color: #333333 !important;
  }

  .login-wrapper {
    background-color: #f4f6f9;
  }

  .login-container {
    max-width: 450px;
  }

  /* 登录卡片美化：移除黑客暗色，转为高质感白底高光 */
  .login-card {
    background: #ffffff;
    border: 1px solid #e2e8f0 !important; /* 细腻的灰边，与表格边框一致 */
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
  }

  .platform-logo {
    display: inline-block;
    padding: 10px;
    background: #eef2ff;
    border-radius: 50%;
    color: #0d6efd;
  }

  /* 表单文字对齐内页表头大小 */
  .custom-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 5px;
  }

  /* 输入框美化：白底、细腻灰边，聚焦时内页经典的蓝色高光 */
  .custom-input {
    background-color: #ffffff !important;
    border: 1px solid #ced4da !important;
    color: #212529 !important;
    padding: 10px 14px;
    font-size: 0.9rem;
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
  }

  .custom-input:focus {
    border-color: #86b7fe !important;
    box-sizing: border-box;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
  }

  .custom-input::placeholder {
    color: #adb5bd !important;
    font-size: 0.85rem;
  }

  /* 验证码框完美融合 */
  .captcha-img {
    height: 38px;
    border-radius: 4px;
    border: 1px solid #ced4da !important;
    cursor: pointer;
    background-color: #f8f9fa;
    transition: opacity 0.2s;
  }
  .captcha-img:hover {
    opacity: 0.8;
  }

  /* 按钮使用内页“+ 创建任务”一模一样的纯正 Bootstrap 蓝 */
  .btn-primary {
    background-color: #0d6efd !important;
    border-color: #0d6efd !important;
    font-size: 0.95rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  .btn-primary:hover:not(:disabled) {
    background-color: #0b5ed7 !important;
    border-color: #0a58ca !important;
  }
  .btn-primary:disabled {
    background-color: #9ec5fe !important;
    border-color: #9ec5fe !important;
    color: #ffffff;
  }

  /* 错误弹窗同步 */
  .custom-alert {
    padding: 8px 12px;
    border-radius: 4px;
  }

  .text-xs {
    font-size: 0.75rem;
  }
</style>
