// Apply theme immediately to prevent flash of unstyled content.
// Priority: 1) explicit localStorage value, 2) OS prefers-color-scheme.
// Loaded synchronously in <head> (no defer) so it runs before first paint.
// CSP-compliant: external file, no inline script.
(function () {
  const saved = localStorage.getItem("theme");
  const prefersDark =
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
})();
