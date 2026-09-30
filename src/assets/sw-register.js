// Register Service Worker with update handling (only in production)
// CSP-compliant: external file, no inline script.
if (
  "serviceWorker" in navigator &&
  !globalThis.location.hostname.match(/^(localhost|127\.0\.0\.1)$/)
) {
  globalThis.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("ServiceWorker registered:", registration.scope);

      const toast = document.getElementById("sw-toast");
      const reloadBtn = document.getElementById("sw-toast-reload");
      const dismissBtn = document.getElementById("sw-toast-dismiss");
      let newWorker = null;
      // Reload only after the new worker actually takes control — reloading
      // immediately after postMessage races activation and can serve the old worker.
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        globalThis.location.reload();
      });
      const showToast = (worker) => {
        newWorker = worker;
        if (toast) toast.style.display = "flex";
      };
      dismissBtn?.addEventListener("click", () => {
        if (toast) toast.style.display = "none";
      });
      reloadBtn?.addEventListener("click", () => {
        if (newWorker) newWorker.postMessage({ type: "SKIP_WAITING" });
        else globalThis.location.reload();
      });
      // Check for updates
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (worker) {
          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" && navigator.serviceWorker.controller
            ) {
              showToast(worker);
            }
          });
        }
      });
      // If an update is already waiting (e.g. installed while page was open)
      if (registration.waiting && navigator.serviceWorker.controller) {
        showToast(registration.waiting);
      }
    } catch (error) {
      console.log("ServiceWorker registration failed:", error);
    }
  });
}
