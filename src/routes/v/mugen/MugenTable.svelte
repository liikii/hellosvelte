<script lang="ts">
  let { suiteData } = $props();
</script>

<div class="accordion border-0" id="mugenAccordion">
  {#each suiteData as suite, i}
    <!-- 增加 mb-3 间距，去掉默认边框 -->
    <div class="accordion-item border-0 mb-3 shadow-sm rounded-3 overflow-hidden">
      <h2 class="accordion-header">
        <button
          class="accordion-button {i !== 0 ? 'collapsed' : ''} bg-white py-3 px-4"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse{i}"
        >
          <div class="d-flex w-100 justify-content-between align-items-center me-3">
            <span class="fs-5 fw-bold text-dark">
                <i class="bi bi-collection-play me-2 text-primary"></i>{suite.suite_name}
            </span>
            <div class="d-flex align-items-center gap-3">
                <span class="text-muted small font-monospace d-none d-md-inline">{suite.suite_id}</span>
                <span class="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3">
                  {suite.suite_cases.length} Cases
                </span>
            </div>
          </div>
        </button>
      </h2>
      <div
        id="collapse{i}"
        class="accordion-collapse collapse {i === 0 ? 'show' : ''}"
        data-bs-parent="#mugenAccordion"
      >
        <!-- 背景改为极浅灰，增加内边距 -->
        <div class="accordion-body bg-light bg-opacity-25 px-4 py-4 border-top">
          <div class="row g-3">
            {#each suite.suite_cases as test_case}
              <div class="col-auto">
                <div class="case-tile py-2 px-3 bg-white border rounded-2 shadow-sm" title={test_case.case_id}>
                  <div class="d-flex align-items-center">
                    <div class="case-num-badge me-2">{test_case.case_id.split('_').pop()}</div>
                    <span class="text-dark fw-medium">{test_case.case_name}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  /* 标题按钮激活状态美化 */
  .accordion-button:not(.collapsed) {
    background-color: #fff !important;
    color: var(--bs-primary) !important;
    box-shadow: none !important;
  }

  .accordion-button:focus {
    box-shadow: none !important;
    border-color: rgba(0,0,0,.1) !important;
  }

  /* Case 磁贴美化：向 Test Task 的风格靠拢 */
  .case-tile {
    transition: all 0.2s ease;
    min-width: 150px;
    border-color: #eee !important;
  }

  .case-tile:hover {
    border-color: var(--bs-primary) !important;
    background-color: #f0f7ff !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1) !important;
  }

  /* 用例编号小标签 */
  .case-num-badge {
    background: #f8f9fa;
    color: #6c757d;
    font-family: var(--bs-font-monospace);
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #eee;
  }
</style>
