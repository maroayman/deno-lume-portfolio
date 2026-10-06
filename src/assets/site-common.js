// ========== THEME TOGGLE ==========
(function () {
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");
  const themeLabel = document.getElementById("themeLabel");

  if (!themeToggle || !sunIcon || !moonIcon) {
    console.warn("Theme toggle elements not found");
    return;
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    document.documentElement.classList.toggle("dark-mode", isDark);
    sunIcon.style.display = isDark ? "none" : "block";
    moonIcon.style.display = isDark ? "block" : "none";
    if (themeLabel) themeLabel.textContent = isDark ? "Day" : "Night";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    // WCAG 2.5.3 Label in Name: accessible name must contain the visible
    // label text ("Day" / "Night") so voice control and SRs agree.
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Day, switch to light mode" : "Night, switch to dark mode",
    );
  }

  // Resolve effective theme: explicit user preference > OS preference > light
  function resolveTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Apply on load to both <html> (set by theme-flash) and <body>.
  applyTheme(resolveTheme());

  // Toggle handler — once the user clicks, their choice is persisted
  themeToggle.addEventListener("click", function () {
    const newTheme = document.body.classList.contains("dark-mode")
      ? "light"
      : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  // Follow OS changes only when the user has NOT set an explicit preference
  const mq = globalThis.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", function (e) {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
})();

// ========== FOOTER YEAR ==========
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ========== SECURITY: noopener / noreferrer ==========
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  if (!link.rel.includes("noopener")) {
    link.rel += (link.rel ? " " : "") + "noopener";
  }
  if (!link.rel.includes("noreferrer")) {
    link.rel += (link.rel ? " " : "") + "noreferrer";
  }
});

// ========== BACK TO TOP ==========
(function () {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) {
    console.warn("Back-to-top button not found");
    return;
  }

  // Performance: requestAnimationFrame throttling
  let ticking = false;
  let lastScrollY = 0;

  // Accessibility: detect reduced motion preference (evaluated per interaction)
  const getPrefersReducedMotion = () =>
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // UX: viewport-relative threshold (show after scrolling 40% of viewport)
  const getThreshold = () => Math.max(globalThis.innerHeight * 0.4, 300);

  // Performance & UX: Show on scroll-up only
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = globalThis.scrollY;
        const threshold = getThreshold();
        const isScrollingUp = currentScrollY < lastScrollY;

        // Show if: scrolled past threshold AND scrolling up
        const shouldShow = currentScrollY > threshold &&
          (isScrollingUp || currentScrollY < threshold + 100);

        backToTop.classList.toggle("visible", shouldShow);
        backToTop.setAttribute("aria-hidden", String(!shouldShow));
        if (shouldShow) {
          backToTop.removeAttribute("hidden");
          backToTop.removeAttribute("tabindex");
        } else {
          backToTop.setAttribute("hidden", "");
          backToTop.setAttribute("tabindex", "-1");
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  // Performance: passive scroll listener
  globalThis.addEventListener("scroll", handleScroll, { passive: true });

  // Smooth scroll with Safari fallback and reduced motion support
  function smoothScrollTo(target) {
    // Feature detection for smooth scroll support
    const supportsSmooth = "scrollBehavior" in document.documentElement.style;

    if (getPrefersReducedMotion()) {
      // Instant scroll for reduced motion
      globalThis.scrollTo(0, target);
    } else if (supportsSmooth) {
      // Native smooth scroll
      globalThis.scrollTo({ top: target, behavior: "smooth" });
    } else {
      // Polyfill for Safari <15.4
      const start = globalThis.scrollY;
      const distance = target - start;
      const duration = 500;
      const startTime = performance.now();

      const animation = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for smooth deceleration
        const ease = 1 - Math.pow(1 - progress, 3);

        globalThis.scrollTo(0, start + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  }

  // Click handler with visual feedback
  backToTop.addEventListener("click", () => {
    backToTop.classList.add("scrolling");
    smoothScrollTo(0);

    // Remove feedback class after animation
    setTimeout(() => {
      backToTop.classList.remove("scrolling");
    }, 600);
  });
})();
