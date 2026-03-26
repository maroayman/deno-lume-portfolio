(function () {
  // ========== READING PROGRESS BAR ==========
  if (!CSS.supports("animation-timeline", "scroll()")) {
    const progressBar = document.getElementById("readingProgress");
    const article = document.querySelector(".blog-content");
    if (progressBar && article) {
      function updateProgress() {
        const articleRect = article.getBoundingClientRect();
        const articleTop = window.scrollY + articleRect.top;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY - articleTop + windowHeight * 0.3;
        const progress = Math.min(
          100,
          Math.max(0, (scrolled / articleHeight) * 100)
        );
        progressBar.style.width = progress + "%";
      }
      window.addEventListener("scroll", updateProgress, { passive: true });
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
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const checkIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>';

  document.querySelectorAll(".blog-content pre").forEach((pre) => {
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-code-btn";
    copyBtn.innerHTML = copyIcon + "<span>Copy</span>";
    copyBtn.setAttribute("aria-label", "Copy code");
    wrapper.appendChild(copyBtn);
    copyBtn.addEventListener("click", async () => {
      const code = pre.querySelector("code") || pre;
      try {
        await navigator.clipboard.writeText(code.innerText);
        copyBtn.innerHTML = checkIcon + "<span>Copied!</span>";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = copyIcon + "<span>Copy</span>";
          copyBtn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });
  });

  // ========== SOCIAL SHARE BUTTONS ==========
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
      "_blank",
      "width=550,height=420"
    );
  }
  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      "_blank",
      "width=550,height=420"
    );
  }
  async function shareNative(btn) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text:
            document.querySelector('meta[name="description"]')?.content || "",
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const orig = btn.innerHTML;
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove("copied");
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
      document.querySelectorAll(".blog-content img, .blog-cover img")
    );
    let currentImageIndex = 0;

    imageList.forEach((img, i) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => openLightbox(i));
    });

    function openLightbox(index) {
      currentImageIndex = index;
      lightboxImage.src = imageList[index].src;
      lightboxCaption.textContent = imageList[index].alt || "";
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      updateNavButtons();
    }
    function closeLightbox() {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    function updateNavButtons() {
      lightboxPrev.style.display = currentImageIndex > 0 ? "flex" : "none";
      lightboxNext.style.display =
        currentImageIndex < imageList.length - 1 ? "flex" : "none";
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => {
      if (currentImageIndex > 0) openLightbox(currentImageIndex - 1);
    });
    lightboxNext.addEventListener("click", () => {
      if (currentImageIndex < imageList.length - 1)
        openLightbox(currentImageIndex + 1);
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && currentImageIndex > 0)
        openLightbox(currentImageIndex - 1);
      if (
        e.key === "ArrowRight" &&
        currentImageIndex < imageList.length - 1
      )
        openLightbox(currentImageIndex + 1);
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
          h.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", "#" + h.id);
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
      function onScroll() {
        let current = headings[0];
        for (const h of headings) {
          if (h.getBoundingClientRect().top <= 120) current = h;
          else break;
        }
        links.forEach((a) => {
          a.classList.toggle(
            "toc-active",
            a.getAttribute("href") === "#" + current.id
          );
        });
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  // ========== CODE TABS ==========
  document.querySelectorAll(".code-tabs").forEach((tabs) => {
    const buttons = tabs.querySelectorAll(".code-tab-btn");
    const panes = tabs.querySelectorAll(".code-tab-pane");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) =>
          b.classList.toggle("active", b.dataset.tab === target)
        );
        panes.forEach((p) =>
          p.classList.toggle("active", p.dataset.tab === target)
        );
      });
    });
  });

  // ========== READING HISTORY ==========
  const blogTitle = document.querySelector(".blog-title")?.textContent?.trim() || document.title;
  try {
    const pageHref = window.location.pathname;
    const readingHistory = JSON.parse(
      localStorage.getItem("blog_reading_history") || "[]"
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
      JSON.stringify(readingHistory)
    );
  } catch (e) {
    console.warn("Could not save reading history:", e);
  }
})();
