<script lang="ts">
    import { onMount } from 'svelte';

    // 採用 Svelte 5 符文管理狀態
    let captchaImg = $state('');
    let userInput = $state('');
    let isFetching = $state(false);

    // 獲取圖形驗證碼
    async function fetchCaptcha() {
        if (isFetching) return;
        isFetching = true;
        try {
            const res = await fetch('/api/captcha');
            const data = await res.json();
            if (res.ok) {
                captchaImg = data.base64_img;
            }
        } catch (err) {
            console.error('獲取驗證碼失敗', err);
        } finally {
            isFetching = false;
        }
    }

    onMount(() => {
        fetchCaptcha();
    });
</script>

<!-- 
  使用 Bootstrap 的卡片與佈局類別替代自訂樣式：
  container, my-5, mx-auto, p-4, border, rounded, bg-white, shadow-sm 
-->
<main class="container my-5 mx-auto p-4 border rounded bg-white shadow-sm" style="max-width: 400px;">
    <div class="mb-3">
        <label for="captcha-input" class="form-label small fw-medium text-secondary">圖形驗證碼</label>
        
        <!-- 
          【100% 絕對等高秘密：Bootstrap input-group】
          這個官方組件會強制內部所有子元素（input 與被包裝的 img）的實體高度完全對齊。
          不論 input 狀態如何切換、陰影如何擴展，右側高度都絕不脫靶。
        -->
        <div class="input-group">
            <input
                id="captcha-input"
                type="text"
                class="form-control font-monospace text-uppercase"
                placeholder="請輸入四位驗證碼"
                maxlength="4"
                bind:value={userInput}
            />
            
            <!-- 
              將外層包裝為 d-flex 保持彈性。
              固定寬度設為 120px，透過 w-100 h-100 與 object-fit-fill
              讓 SVG 圖片完美填滿 Bootstrap 自動計算出的等高容器內部。
            -->
            <div class="d-flex border rounded-end bg-light overflow-hidden" style="width: 120px;">
                {#if captchaImg}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                    <img 
                        src={captchaImg} 
                        alt="驗證碼" 
                        class="w-100 h-100 user-select-none"
                        style="object-fit: fill; cursor: pointer; opacity: {isFetching ? 0.5 : 1}; transition: opacity 0.15s;"
                        onclick={fetchCaptcha}
                        title="點擊刷新驗證碼"
                    />
                {:else}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                    <div 
                        class="w-100 h-100 d-flex align-items-center justify-content-center text-muted small user-select-none" 
                        style="cursor: pointer;"
                        onclick={fetchCaptcha}
                    >
                        載入中...
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>
