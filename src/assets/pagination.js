/**
 * Client-side pagination component.
 *
 * Reads elements with [data-pagination-item] inside #pagination-container,
 * shows ITEMS_PER_PAGE items at a time, renders up to MAX_PAGE_BUTTONS page
 * buttons, and syncs the current page to the URL via ?page=N /
 * history.pushState so the browser back/forward buttons work correctly.
 */
(function () {
  const ITEMS_PER_PAGE = 4;
  const MAX_PAGE_BUTTONS = 10;

  const container = document.getElementById("pagination-container");
  const controls = document.getElementById("pagination-controls");

  if (!container || !controls) return;

  const items = [...container.querySelectorAll("[data-pagination-item]")];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  // No pagination needed when everything fits on one page
  if (items.length <= ITEMS_PER_PAGE) return;

  let currentPage =
    parseInt(new URLSearchParams(location.search).get("page"), 10) || 1;

  /** Show only the items that belong to `currentPage` and update the URL. */
  function showPage() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = currentPage * ITEMS_PER_PAGE;

    items.forEach((el, i) => {
      el.style.display = i >= start && i < end ? "" : "none";
    });

    const url =
      currentPage === 1 ? location.pathname : `?page=${currentPage}`;
    history.pushState({ page: currentPage }, "", url);
  }

  /**
   * Create a single pagination button.
   * @param {string|number} label   - Visible text
   * @param {number}        page    - Target page number
   * @param {boolean}       active  - Whether this is the current page
   */
  function makeButton(label, page, active) {
    if (active) {
      const span = document.createElement("span");
      span.className = "tech-tag pagination-btn pagination-active";
      span.textContent = label;
      return span;
    }

    const a = document.createElement("a");
    a.className = "tech-tag pagination-btn";
    a.textContent = label;
    a.href = page === 1 ? location.pathname : `?page=${page}`;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = page;
      showPage();
      renderControls();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return a;
  }

  /** Re-render the page-number buttons. */
  function renderControls() {
    // Calculate the sliding window start so the active page stays centred
    const windowStart = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(MAX_PAGE_BUTTONS / 2),
        totalPages - MAX_PAGE_BUTTONS + 1
      )
    );
    const windowEnd = Math.min(
      windowStart + MAX_PAGE_BUTTONS - 1,
      totalPages
    );

    controls.innerHTML = "";

    if (currentPage > 1) {
      controls.append(makeButton("← Back", currentPage - 1, false));
    }

    for (let p = windowStart; p <= windowEnd; p++) {
      controls.append(makeButton(p, p, p === currentPage));
    }

    if (currentPage < totalPages) {
      controls.append(makeButton("Next →", currentPage + 1, false));
    }

    controls.style.display = "flex";
  }

  // Restore state on browser back/forward
  window.addEventListener("popstate", (e) => {
    currentPage = e.state?.page || 1;
    showPage();
    renderControls();
  });

  // Initial render
  showPage();
  renderControls();
})();
