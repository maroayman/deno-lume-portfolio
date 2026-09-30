// Tag page filter + pagination.
// Extracted from the inline <script> in layouts/tag.vto for CSP compliance
// (script-src 'self' blocks inline execution). Loaded with defer.
(function () {
  const PER_PAGE = 6;
  const input = document.getElementById("tagSearch");
  const grid = document.getElementById("tagGrid");
  const noResults = document.getElementById("tagNoResults");
  const countEl = document.getElementById("tagResultCount");
  const pagination = document.getElementById("tagPagination");
  if (!input || !grid || !noResults || !countEl || !pagination) return;
  const allCards = Array.from(grid.querySelectorAll(".blog-card"));

  let filtered = allCards.slice();
  let currentPage = 1;

  function render() {
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    allCards.forEach((c) => c.style.display = "none");
    filtered.forEach((c, i) => {
      c.style.display = (i >= start && i < end) ? "" : "none";
    });

    countEl.textContent = String(filtered.length);
    noResults.style.display = filtered.length === 0 ? "" : "none";

    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    const prefersReducedMotion =
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mkBtn = (label, page, active, disabled) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className = "pagination-btn tech-tag" +
        (active ? " pagination-active" : "");
      btn.disabled = disabled;
      if (label === "←") btn.setAttribute("aria-label", "Previous page");
      else if (label === "→") btn.setAttribute("aria-label", "Next page");
      else btn.setAttribute("aria-label", "Page " + label);
      if (active) btn.setAttribute("aria-current", "page");
      if (!disabled) {
        btn.addEventListener("click", () => {
          currentPage = page;
          render();
          globalThis.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "instant" : "smooth",
          });
        });
      }
      return btn;
    };

    pagination.appendChild(
      mkBtn("←", currentPage - 1, false, currentPage === 1),
    );
    for (let p = 1; p <= totalPages; p++) {
      pagination.appendChild(mkBtn(String(p), p, p === currentPage, false));
    }
    pagination.appendChild(
      mkBtn("→", currentPage + 1, false, currentPage === totalPages),
    );
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    filtered = allCards.filter((card) => {
      if (!q) return true;
      const title = (card.querySelector(".blog-card-title")?.textContent || "")
        .toLowerCase();
      const tags = (card.dataset.tags || "").toLowerCase();
      return title.includes(q) || tags.includes(q);
    });
    currentPage = 1;
    render();
  });

  render();
})();
