// Apply theme immediately to prevent flash of unstyled content.
// Priority: 1) explicit localStorage value, 2) OS prefers-color-scheme.
// Loaded synchronously in <head> (no defer) so it runs before first paint.
// Inlined at build time (see head-theme-flash.vto) — CSP allows it via the
// sha256 hash in vercel.json. The hash covers the INLINED bytes (source
// minus trailing newline); the pre-commit hook re-syncs it automatically.
(function () {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {
    // Private mode: localStorage throws — fall back to OS preference.
  }
  const mq = globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-color-scheme: dark)");
  const dark = saved ? saved === "dark" : !!(mq && mq.matches);
  if (dark) {
    document.documentElement.classList.add("dark-mode");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#141021");
  }
})();
