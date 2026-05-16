<script lang="ts">
    import "bootstrap/dist/css/bootstrap.min.css";
    import { goto } from "$app/navigation";
    import { encryptWithRsa } from "$lib/utils";
    import { onMount } from 'svelte';

    // ========== Svelte5 状态定义 ==========
    let form = $state({
        username: "",
        password: "",
        captcha: "",
    });

    let loading = $state(false);
    let errorMsg = $state("");

    // 【修改點】改為請求本地 /api/captcha 接口
    let captchaUrl = $state("");
    let isFetchingCaptcha = $state(false);

    // 最新 $derived 计算属性
    let formValid = $derived(
        form.username?.trim() !== "" &&
            form.password?.trim() !== "" &&
            form.captcha?.trim() !== "",
    );

    // 【修改點】標準的驗證碼刷新邏輯（加上時間戳防止緩存）
    async function refreshCaptcha() {
        if (isFetchingCaptcha) return;
        isFetchingCaptcha = true;
        try {
            const res = await fetch(`/api/captcha?t=${Date.now()}`);
            const data = await res.json();
            if (res.ok && data.base64_img) {
                captchaUrl = data.base64_img;
            }
        } catch (err) {
            console.error('刷新验证码失败', err);
        } finally {
            isFetchingCaptcha = false;
        }
    }

    async function handleLogin(e: SubmitEvent) {
        e.preventDefault();
        if (!formValid) return;

        loading = true;
        errorMsg = "";

        try {
            // 1. 异步计算出加密后的密文
            const encryptedData = await encryptWithRsa(form.password);

            // 2. 核心修改：利用扩展运算符 (...) 直接追加字段，原原本本保留原 form 的所有内容
            const submitBody = {
                ...form, // 保留原始的 username, password, captcha
                password: encryptedData, 
            };

            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitBody),
            });

            const data = await res.json();

            if (data.code === 0) {
                await goto("/v/user");
            } else {
                errorMsg = data.msg || "登录失败，请检查账号密码验证码";
                refreshCaptcha(); // 登录失败时，自动刷新验证码
            }
        } catch (err) {
            errorMsg = "网络请求异常，请稍后重试";
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        refreshCaptcha(); // 页面加载时首发获取验证码
    });
</script>

<!-- 亮色系极简容器 (使用全 Bootstrap 5 原子化样式控制宽度，无需自定义样式类) -->
<div class="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
    <div class="w-100 px-3" style="max-width: 550px;">
        <!-- 顶层精致卡片 -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4 p-md-5">
                <!-- 头部区域：对齐内页列表的简约感 -->
                <div class="text-center mb-4">
                    <div class="mb-2">
                        <svg
                            xmlns="http://w3.org"
                            width="32"
                            height="32"
                            fill="currentColor"
                            class="text-primary"
                            viewBox="0 0 16 16"
                        >
                            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                            <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </div>
                    <h4 class="fw-bold text-dark mb-1">自动化测试套平台</h4>
                    <p class="text-muted small mb-0">Automated Test Suite Control Center</p>
                </div>

                <!-- 异常提醒：对齐内页警告样式 -->
                {#if errorMsg}
                    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-4 fade show py-2 px-3 small rounded-2" role="alert">
                        <span class="d-flex align-items-center gap-2">⚠️ {errorMsg}</span>
                        <button
                            type="button"
                            class="btn-close small"
                            onclick={() => (errorMsg = "")}
                            aria-label="Close"
                        ></button>
                    </div>
                {/if}

                <!-- 登录表单 -->
                <form onsubmit={handleLogin}>
                    <!-- 操作员账号 -->
                    <div class="mb-3">
                        <label for="username" class="form-label small fw-medium text-secondary">操作员账号</label>
                        <input
                            id="username"
                            type="text"
                            class="form-control"
                            bind:value={form.username}
                            placeholder="请输入用户名或邮箱"
                            autocomplete="username"
                        />
                    </div>

                    <!-- 安全密码 -->
                    <div class="mb-3">
                        <label for="password" class="form-label small fw-medium text-secondary">安全密码</label>
                        <input
                            id="password"
                            type="password"
                            class="form-control"
                            bind:value={form.password}
                            placeholder="请输入登录密码"
                            autocomplete="current-password"
                        />
                    </div>

                    <!-- 【重点修改】验证码结构：采用 input-group 强制使图片与输入框对齐 -->
                    <div class="mb-4">
                        <label for="captcha" class="form-label small fw-medium text-secondary">图形验证码</label>
                        <div class="input-group">
                            <input
                                id="captcha"
                                type="text"
                                class="form-control font-monospace text-uppercase"
                                bind:value={form.captcha}
                                placeholder="请输入四位验证码"
                                maxlength="4"
                            />
                            <!-- 右侧图片包装容器，设置固定宽度，其余全靠 Bootstrap 自动弹性拉平 -->
                            <div class="d-flex border border-start-0 rounded-end bg-white overflow-hidden" style="width: 120px;">
                                {#if captchaUrl}
                                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                    <img
                                        src={captchaUrl}
                                        alt="Captcha"
                                        class="w-100 h-100 user-select-none"
                                        style="object-fit: fill; cursor: pointer; opacity: {isFetchingCaptcha ? 0.5 : 1}; transition: opacity 0.15s;"
                                        onclick={refreshCaptcha}
                                        title="点击刷新验证码"
                                    />
                                {:else}
                                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                    <div 
                                        class="w-100 h-100 d-flex align-items-center justify-content-center text-muted small user-select-none" 
                                        style="cursor: pointer; font-size: 12px;"
                                        onclick={refreshCaptcha}
                                    >
                                        加载中...
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- 提交登录按钮：【已修复原本结尾截断产生的错误标签】 -->
                    <button
                        type="submit"
                        class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-medium shadow-sm"
                        disabled={!formValid || loading}
                    >
                        {#if loading}
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>安全登录中...</span>
                        {:else}
                            <span>确认登录</span>
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
