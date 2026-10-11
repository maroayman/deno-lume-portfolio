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

  // Smooth scroll with reduced-motion support. No legacy polyfill:
  // browsers without smooth-scroll support (pre-2022) get an instant
  // jump — same destination, no animation frames to maintain.
  function smoothScrollTo(target) {
    // Feature detection for smooth scroll support
    const supportsSmooth = "scrollBehavior" in document.documentElement.style;

    if (getPrefersReducedMotion() || !supportsSmooth) {
      // Instant scroll for reduced motion or legacy browsers
      globalThis.scrollTo(0, target);
    } else {
      // Native smooth scroll
      globalThis.scrollTo({ top: target, behavior: "smooth" });
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
