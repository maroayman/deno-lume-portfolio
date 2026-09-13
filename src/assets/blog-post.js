// deno-lint-ignore-file no-window no-inner-declarations
(function () {
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ========== READING PROGRESS BAR ==========
  if (!CSS.supports("animation-timeline", "scroll()")) {
    const progressBar = document.getElementById("readingProgress");
    const article = document.querySelector(".blog-content");
    if (progressBar && article) {
      const updateProgress = () => {
        const articleRect = article.getBoundingClientRect();
        const articleTop = globalThis.scrollY + articleRect.top;
        const articleHeight = article.offsetHeight;
        const windowHeight = globalThis.innerHeight;
        const scrolled = globalThis.scrollY - articleTop + windowHeight * 0.3;
        const progress = Math.min(
          100,
          Math.max(0, (scrolled / articleHeight) * 100),
        );
        progressBar.style.width = progress + "%";
        progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));
      };
      globalThis.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    }
  }

  // ========== DYNAMIC WORD COUNT ==========
  const blogContent = document.querySelector(".blog-content");
  const wordCountEl = document.getElementById("wordCount");
  if (blogContent && wordCountEl) {
    const text = blogContent.innerText || blogContent.textContent || "";
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
    wordCountEl.textContent = words.toLocaleString() + " words";
  }

  // ========== COPY CODE BUTTON ==========
  const copyIcon =
    '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const checkIcon =
    '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>';

  document.querySelectorAll(".blog-content pre").forEach((pre) => {
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-code-btn";
    copyBtn.innerHTML = copyIcon + "<span>Copy</span>";
    copyBtn.setAttribute("aria-label", "Copy code");
    copyBtn.setAttribute("aria-live", "polite");
    wrapper.appendChild(copyBtn);
    copyBtn.addEventListener("click", async () => {
      const code = pre.querySelector("code") || pre;
      try {
        await navigator.clipboard.writeText(code.innerText);
        copyBtn.innerHTML = checkIcon + "<span>Copied!</span>";
        copyBtn.setAttribute("aria-label", "Copied!");
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = copyIcon + "<span>Copy</span>";
          copyBtn.setAttribute("aria-label", "Copy code");
          copyBtn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });
  });

  // ========== SOCIAL SHARE BUTTONS ==========
  const pageUrl = encodeURIComponent(globalThis.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const shareTwitter = () => {
    globalThis.open(
      `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
      "_blank",
      "width=550,height=420",
    );
  };
  const shareLinkedIn = () => {
    globalThis.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      "_blank",
      "width=550,height=420",
    );
  };
  async function shareNative(btn) {
    const statusEl = document.getElementById("shareStatus");
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.querySelector('meta[name="description"]')?.content ||
            "",
          url: globalThis.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(globalThis.location.href);
        const orig = btn.innerHTML;
        btn.innerHTML =
          '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.classList.add("copied");
        btn.setAttribute("aria-label", "Copied link!");
        if (statusEl) statusEl.textContent = "Link copied to clipboard";
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove("copied");
          btn.setAttribute("aria-label", "Share");
          if (statusEl) statusEl.textContent = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  }

  ["", "Bottom"].forEach((suffix) => {
    document
      .getElementById(`shareTwitter${suffix}`)
      ?.addEventListener("click", shareTwitter);
    document
      .getElementById(`shareLinkedIn${suffix}`)
      ?.addEventListener("click", shareLinkedIn);
    document
      .getElementById(`shareNative${suffix}`)
      ?.addEventListener("click", function () {
        shareNative(this);
      });
  });

  // ========== IMAGE LIGHTBOX ==========
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const imageList = Array.from(
      document.querySelectorAll(".blog-content img, .blog-cover img"),
    );
    let currentImageIndex = 0;
    let lastFocused = null;

    function getFocusable() {
      return Array.from(
        lightbox.querySelectorAll(
          'button:not([hidden]):not([style*="display: none"])',
        ),
      ).filter((el) => el.offsetParent !== null);
    }

    imageList.forEach((img, i) => {
      img.style.cursor = "pointer";
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.setAttribute(
        "aria-label",
        "View image: " + (img.alt || "image " + (i + 1)),
      );
      img.addEventListener("click", () => openLightbox(i));
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    const openLightbox = (index) => {
      lastFocused = document.activeElement;
      currentImageIndex = index;
      const srcImg = imageList[index];
      lightboxImage.src = srcImg.src;
      lightboxImage.alt = srcImg.alt || "";
      lightboxCaption.textContent = srcImg.alt || "";
      lightbox.classList.add("active");
      lightbox.removeAttribute("hidden");
      lightbox.removeAttribute("inert");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      updateNavButtons();
      lightboxClose.focus();
    };
    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.setAttribute("hidden", "");
      lightbox.setAttribute("inert", "");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };
    const updateNavButtons = () => {
      lightboxPrev.style.display = currentImageIndex > 0 ? "flex" : "none";
      lightboxNext.style.display = currentImageIndex < imageList.length - 1
        ? "flex"
        : "none";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => {
      if (currentImageIndex > 0) openLightbox(currentImageIndex - 1);
    });
    lightboxNext.addEventListener("click", () => {
      if (currentImageIndex < imageList.length - 1) {
        openLightbox(currentImageIndex + 1);
      }
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && currentImageIndex > 0) {
        openLightbox(currentImageIndex - 1);
      }
      if (
        e.key === "ArrowRight" &&
        currentImageIndex < imageList.length - 1
      ) {
        openLightbox(currentImageIndex + 1);
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ========== TABLE OF CONTENTS ==========
  const toc = document.getElementById("toc");
  const tocList = document.getElementById("tocList");
  const tocToggle = document.getElementById("tocToggle");
  const content = document.querySelector(".blog-content");
  if (toc && tocList && content) {
    const headings = Array.from(content.querySelectorAll("h2, h3"));
    if (headings.length >= 3) {
      headings.forEach((h) => {
        if (!h.id) {
          h.id = h.textContent
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        }
        h.setAttribute("tabindex", "-1");
      });

      headings.forEach((h) => {
        const li = document.createElement("li");
        li.className = h.tagName === "H3" ? "toc-h3" : "toc-h2";
        const a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const behavior = prefersReducedMotion() ? "instant" : "smooth";
          h.scrollIntoView({ behavior, block: "start" });
          history.pushState(null, "", "#" + h.id);
          h.focus({ preventScroll: true });
        });
        li.appendChild(a);
        tocList.appendChild(li);
      });

      toc.style.display = "";

      let isOpen = false;
      tocList.style.display = "none";
      tocToggle.setAttribute("aria-expanded", "false");
      tocToggle.addEventListener("click", () => {
        isOpen = !isOpen;
        tocList.style.display = isOpen ? "" : "none";
        tocToggle.setAttribute("aria-expanded", isOpen);
        toc.classList.toggle("open", isOpen);
      });

      const links = Array.from(tocList.querySelectorAll("a"));
      const onScroll = () => {
        let current = headings[0];
        for (const h of headings) {
          if (h.getBoundingClientRect().top <= 120) current = h;
          else break;
        }
        links.forEach((a) => {
          a.classList.toggle(
            "toc-active",
            a.getAttribute("href") === "#" + current.id,
          );
        });
      };
      globalThis.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  // ========== CODE TABS ==========
  document.querySelectorAll(".code-tabs").forEach((tabs, groupIdx) => {
    const buttons = tabs.querySelectorAll(".code-tab-btn");
    const panes = tabs.querySelectorAll(".code-tab-pane");
    const tablist = tabs.querySelector(".code-tab-buttons");
    if (tablist) tablist.setAttribute("role", "tablist");
    buttons.forEach((btn, idx) => {
      btn.setAttribute("role", "tab");
      btn.setAttribute(
        "aria-selected",
        btn.classList.contains("active") ? "true" : "false",
      );
      btn.setAttribute(
        "tabindex",
        btn.classList.contains("active") ? "0" : "-1",
      );
      if (!btn.id) btn.id = `code-tab-${groupIdx}-${idx}`;
      const pane = panes[idx];
      if (pane) {
        if (!pane.id) pane.id = btn.id + "-panel";
        pane.setAttribute("role", "tabpanel");
        pane.setAttribute("aria-labelledby", btn.id);
        btn.setAttribute("aria-controls", pane.id);
      }
    });
    panes.forEach((p) => {
      if (!p.classList.contains("active")) p.setAttribute("hidden", "");
    });
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) => {
          const isActive = b.dataset.tab === target;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-selected", String(isActive));
          b.setAttribute("tabindex", isActive ? "0" : "-1");
        });
        panes.forEach((p) => {
          const isActive = p.dataset.tab === target;
          p.classList.toggle("active", isActive);
          if (isActive) p.removeAttribute("hidden");
          else p.setAttribute("hidden", "");
        });
      });
      btn.addEventListener("keydown", (e) => {
        const idx = Array.from(buttons).indexOf(btn);
        if (e.key === "ArrowRight") {
          e.preventDefault();
          const next = buttons[(idx + 1) % buttons.length];
          next.focus();
          next.click();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          const prev = buttons[(idx - 1 + buttons.length) % buttons.length];
          prev.focus();
          prev.click();
        } else if (e.key === "Home") {
          e.preventDefault();
          buttons[0].focus();
          buttons[0].click();
        } else if (e.key === "End") {
          e.preventDefault();
          buttons[buttons.length - 1].focus();
          buttons[buttons.length - 1].click();
        }
      });
    });
  });

  // ========== READING HISTORY ==========
  const blogTitle =
    document.querySelector(".blog-title")?.textContent?.trim() ||
    document.title;
  try {
    const pageHref = globalThis.location.pathname;
    const readingHistory = JSON.parse(
      localStorage.getItem("blog_reading_history") || "[]",
    );
    const idx = readingHistory.findIndex((i) => i.url === pageHref);
    if (idx > -1) readingHistory.splice(idx, 1);
    readingHistory.unshift({
      url: pageHref,
      title: blogTitle,
      readAt: new Date().toISOString(),
    });
    if (readingHistory.length > 50) readingHistory.pop();
    localStorage.setItem(
      "blog_reading_history",
      JSON.stringify(readingHistory),
    );
  } catch (e) {
    console.warn("Could not save reading history:", e);
  }
})();
