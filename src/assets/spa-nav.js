// SPA-style navigation: same-origin clicks fetch + swap instead of full reload.
// The shell (dock, styles host, footer) persists; only <main>, head styles,
// title/meta, and post-only fragments are replaced. Page scripts
// (blog-head/list/post, tag-filter) are IIFE-wrapped so re-execution is safe;
// site-common.js binds to persistent shell nodes and runs exactly once.
// Anything unexpected falls back to a full navigation.
(function () {
  const main = document.getElementById("main-content");
  if (!main || !("fetch" in globalThis && "DOMParser" in globalThis)) return;

  // Only these content scripts are ever (re-)executed after a swap.
  const PAGE_SCRIPTS = new Set([
    "/assets/blog-head.js",
    "/assets/blog-list.js",
    "/assets/blog-post.js",
    "/assets/tag-filter.js",
  ]);
  // Shell fragments that exist only on some page types (see base.vto).
  const TRANSPLANT_IDS = ["readingProgress", "lightbox"];

  let navigating = false;
  const reducedMotion = () =>
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function targetUrl(anchor) {
    if (anchor.target && anchor.target !== "_self") return null;
    if (anchor.hasAttribute("download")) return null;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return null;
    let url;
    try {
      url = new URL(href, globalThis.location.href);
    } catch {
      return null;
    }
    if (url.origin !== globalThis.location.origin) return null;
    if (url.href === globalThis.location.href) return null;
    // Same-page anchor jump — let the browser handle it.
    const cur = new URL(globalThis.location.href);
    if (
      url.pathname === cur.pathname && url.search === cur.search && url.hash
    ) {
      return null;
    }
    return url;
  }

  async function fetchDoc(url) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch(url.pathname + url.search, {
        signal: ctrl.signal,
        headers: { "X-SPA-Nav": "1" },
      });
      if (!res.ok) return null;
      return new DOMParser().parseFromString(await res.text(), "text/html");
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  function syncHead(doc) {
    document.title = doc.title;
    const desc = doc.querySelector('meta[name="description"]');
    const cur = document.querySelector('meta[name="description"]');
    if (desc && cur) {
      cur.setAttribute("content", desc.getAttribute("content") || "");
    }
    const canon = doc.querySelector('link[rel="canonical"]');
    const curCanon = document.querySelector('link[rel="canonical"]');
    if (canon && curCanon) {
      curCanon.setAttribute("href", canon.getAttribute("href") || "");
    }
    // Inlined CSS differs per page type (blog.css/pages.css only on
    // blog-ish pages) — replace wholesale so the new content is styled.
    document.head.querySelectorAll("style").forEach((s) => s.remove());
    doc.head.querySelectorAll("style").forEach((s) => {
      document.head.appendChild(document.importNode(s, true));
    });
    // Post-only shell fragments: transplant if the new page needs them,
    // remove when leaving (blog-post.js degrades without them otherwise).
    for (const id of TRANSPLANT_IDS) {
      document.getElementById(id)?.remove();
      const frag = doc.getElementById(id);
      if (frag) document.body.appendChild(document.importNode(frag, true));
    }
  }

  function paintActiveNav(path) {
    document.querySelectorAll(".dk a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const on = href === "/" ? path === "/" : path.startsWith(href);
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function runPageScripts(doc) {
    // blog-head.js re-injects this on every run — drop the stale copy first.
    document.getElementById("read-indicator-styles")?.remove();
    const srcs = [...doc.querySelectorAll("#main-content script[src]")]
      .map((s) =>
        new URL(s.getAttribute("src") || "", globalThis.location.origin)
          .pathname
      )
      .filter((p) => PAGE_SCRIPTS.has(p));
    for (const src of srcs) {
      const s = document.createElement("script");
      s.src = src;
      s.async = false; // preserve document order (blog-head before blog-list)
      document.head.appendChild(s);
    }
  }

  function jumpTop() {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    globalThis.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }

  function swap(doc, url) {
    syncHead(doc);
    const next = doc.getElementById("main-content");
    if (!next) throw new Error("no main");
    main.innerHTML = next.innerHTML;
    // The dock persists across swaps — sync the window title + nav.
    const nextTitle = doc.getElementById("winTitle");
    const curTitle = document.getElementById("winTitle");
    if (nextTitle && curTitle) curTitle.textContent = nextTitle.textContent;
    paintActiveNav(url.pathname);
    runPageScripts(doc);
    jumpTop();
    main.focus({ preventScroll: true });
  }

  async function navigate(url, { push = true, y = 0 } = {}) {
    if (navigating) {
      globalThis.location.href = url.href;
      return;
    }
    navigating = true;
    const doc = await fetchDoc(url);
    if (!doc || !doc.getElementById("main-content")) {
      globalThis.location.href = url.href;
      return;
    }
    try {
      if (push) {
        history.replaceState(
          { y: globalThis.scrollY },
          "",
          globalThis.location.pathname + globalThis.location.search,
        );
      }
      const apply = () => swap(doc, url);
      if (document.startViewTransition && !reducedMotion()) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
      if (push) {
        history.pushState({ y: 0 }, "", url.pathname + url.search + url.hash);
      } else {
        globalThis.scrollTo(0, y);
      }
    } catch {
      globalThis.location.href = url.href;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const anchor = event.target.closest("a");
    if (!anchor) return;
    const url = targetUrl(anchor);
    if (!url) return;
    event.preventDefault();
    navigate(url);
  });

  globalThis.addEventListener("popstate", (event) => {
    navigate(new URL(globalThis.location.href), {
      push: false,
      y: event.state?.y ?? 0,
    });
  });
})();
