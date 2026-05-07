<script lang="ts">
  let { suiteData } = $props();
</script>

<div class="accordion shadow-sm" id="mugenAccordion">
  {#each suiteData as suite, i}
    <div class="accordion-item border-0 mb-2 overflow-hidden rounded-3">
      <h2 class="accordion-header">
        <button
          class="accordion-button {i !== 0 ? 'collapsed' : ''} bg-white shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse{i}"
        >
          <div class="d-flex w-100 justify-content-between align-items-center me-3">
            <span class="fw-semibold text-dark">
              <i class="bi bi-folder2-open me-2 text-primary"></i>{suite.suite_name}
            </span>
            <span class="badge rounded-pill bg-blue-light text-primary border border-primary border-opacity-25">
              {suite.suite_cases.length} Cases
            </span>
          </div>
        </button>
      </h2>
      <div
        id="collapse{i}"
        class="accordion-collapse collapse {i === 0 ? 'show' : ''}"
        data-bs-parent="#mugenAccordion"
      >
        <div class="accordion-body bg-light bg-opacity-50">
          <div class="row g-2">
            {#each suite.suite_cases as test_case}
              <div class="col-auto">
                <div class="case-card py-1 px-3 bg-white border rounded-pill shadow-sm" title={test_case.case_id}>
                  <small class="text-secondary font-monospace" style="font-size: 0.75rem;">{test_case.case_id.split('_').pop()}</small>
                  <span class="ms-1 text-dark">{test_case.case_name}</span>
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
  /* 自定义样式美化 */
  .bg-blue-light {
    background-color: #e7f1ff;
  }

  .accordion-item {
    border: 1px solid rgba(0,0,0,0.05) !important;
  }

  .accordion-button:not(.collapsed) {
    color: var(--bs-primary);
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  .case-card {
    transition: all 0.2s ease;
    cursor: default;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }

  .case-card:hover {
    border-color: var(--bs-primary) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
  }

  /* 隐藏手风琴默认的蓝圈焦点 */
  .accordion-button:focus {
    box-shadow: none;
    border-color: rgba(0,0,0,0.125);
  }
</style>
