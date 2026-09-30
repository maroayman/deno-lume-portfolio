// Blog list head helpers — runs synchronously before cards paint.
// Extracted from inline <script> blocks in src/blog.vto for CSP compliance
// (script-src 'self' blocks inline execution). Loaded via <script src> without
// defer at the same position the inline blocks used to occupy.

// Instant read indicator - injects CSS into head synchronously
(function () {
  try {
    const t = JSON.parse(localStorage.getItem("blog_reading_history") || "[]")
      .map((e) => {
        const u = typeof e == "string" ? e : e.url;
        return u.replace(/\/$/, "");
      });
    if (t.length > 0) {
      globalThis.__readUrls = new Set(t);
      const e = document.createElement("style");
      e.id = "read-indicator-styles",
        e.textContent = t.map((r) =>
          `.blog-card[data-url="${r}"] .read-inline,.blog-card[data-url="${r}/"] .read-inline{display:inline}`
        ).join(""),
        document.head.insertBefore(e, document.head.firstChild);
    }
  } catch {
    // localStorage unavailable (private mode) — read indicators stay hidden.
  }
})();

document.documentElement.classList.add("js");

requestAnimationFrame(() => {
  const e = document.createElement("style");
  e.textContent =
    ".js .blog-card { opacity: 1; transition: opacity 0.15s ease, background-color var(--t-base); }",
    document.head.appendChild(e);
});
