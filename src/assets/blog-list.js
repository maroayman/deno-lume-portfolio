(function () {
  const SESSION_KEY = "blog_pagination_state";
  const BOOKMARK_KEY = "blog_bookmarks";
  const HISTORY_KEY = "blog_reading_history";
  const PER_PAGE = 6;
  const MAX_PAGE_BUTTONS = 10;

  const searchInput = document.getElementById("blogSearch");
  const searchClearBtn = document.getElementById("searchClear");
  const quickTagButtons = document.querySelectorAll(".quick-tags .filter-tag");
  const viewTabs = document.querySelectorAll(".view-tab");
  const tagFiltersBox = document.getElementById("tagFiltersContainer");
  const bookmarkCountEl = document.getElementById("bookmarkCount");
  const allCards = [...document.querySelectorAll(".blog-card")];
  const noResultsEl = document.getElementById("noResults");
  const cardsContainer = document.getElementById("pagination-container");
  const paginationControls = document.getElementById("pagination-controls");
  const tagDropdown = document.getElementById("tagDropdown");
  const dropdownTrigger = document.getElementById("tagDropdownTrigger");
  const dropdownSearch = document.getElementById("tagDropdownSearch");
  const dropdownEmpty = document.getElementById("tagDropdownEmpty");
  const dropdownItems = document.querySelectorAll(".tag-dropdown-item");
  const activeFiltersBox = document.getElementById("activeFilters");
  const activeFiltersTags = document.getElementById("activeFiltersTags");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const resultCountEl = document.getElementById("resultCount");
  const resultCountText = document.getElementById("resultCountText");

  if (!searchInput || !cardsContainer) return;

  let selectedTags = [];
  let currentView = "all";
  let currentPage = 1;
  let filteredCards = allCards;
  let focusedItemIndex = -1;

  function getVisibleDropdownItems() {
    return [...dropdownItems].filter((item) => item.style.display !== "none");
  }

  function focusDropdownItem(index) {
    const visible = getVisibleDropdownItems();
    if (visible.length === 0) return;
    focusedItemIndex = Math.max(0, Math.min(index, visible.length - 1));
    visible.forEach((item, position) => {
      item.classList.toggle("focused", position === focusedItemIndex);
    });
    const focused = visible[focusedItemIndex];
    if (focused) focused.scrollIntoView({ block: "nearest" });
  }

  if (dropdownTrigger && tagDropdown) {
    dropdownTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = tagDropdown.classList.toggle("open");
      dropdownTrigger.setAttribute("aria-expanded", isOpen);
      if (isOpen && dropdownSearch) {
        focusedItemIndex = -1;
        setTimeout(() => dropdownSearch.focus(), 50);
      }
    });
    document.addEventListener("click", (event) => {
      if (!tagDropdown.contains(event.target)) {
        tagDropdown.classList.remove("open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
        focusedItemIndex = -1;
      }
    });
    tagDropdown.addEventListener("keydown", (event) => {
      const visible = getVisibleDropdownItems();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusDropdownItem(focusedItemIndex + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        focusDropdownItem(focusedItemIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        focusDropdownItem(0);
      } else if (event.key === "End") {
        event.preventDefault();
        focusDropdownItem(visible.length - 1);
      } else if (event.key === "Enter" && focusedItemIndex >= 0) {
        event.preventDefault();
        const focused = visible[focusedItemIndex];
        if (focused) focused.click();
      } else if (event.key === "Escape") {
        tagDropdown.classList.remove("open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
        dropdownTrigger.focus();
        focusedItemIndex = -1;
      }
    });
    if (dropdownSearch) {
      dropdownSearch.addEventListener("input", () => {
        const query = dropdownSearch.value.toLowerCase().trim();
        let matchCount = 0;
        dropdownItems.forEach((item) => {
          const matches = item.dataset.tag.toLowerCase().includes(query);
          item.style.display = matches ? "" : "none";
          item.classList.remove("focused");
          if (matches) matchCount++;
        });
        focusedItemIndex = -1;
        if (dropdownEmpty) {
          dropdownEmpty.style.display = matchCount === 0 ? "block" : "none";
        }
      });
    }
    dropdownItems.forEach((item) => {
      item.addEventListener("click", () => {
        toggleDropdownTag(item.dataset.tag);
        tagDropdown.classList.remove("open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
        if (dropdownSearch) dropdownSearch.value = "";
        dropdownItems.forEach((entry) => {
          entry.style.display = "";
          entry.classList.remove("focused");
        });
        focusedItemIndex = -1;
        if (dropdownEmpty) dropdownEmpty.style.display = "none";
      });
      item.addEventListener("mouseenter", () => {
        const visible = getVisibleDropdownItems();
        focusedItemIndex = visible.indexOf(item);
        visible.forEach((entry, position) => {
          entry.classList.toggle("focused", position === focusedItemIndex);
        });
      });
    });
  }

  function toggleDropdownTag(tag) {
    if (tag === "all") {
      selectedTags = [];
    } else {
      const index = selectedTags.indexOf(tag);
      if (index > -1) selectedTags.splice(index, 1);
      else selectedTags.push(tag);
    }
    refreshFilterUI();
    resetPageAndRender();
  }

  function refreshFilterUI() {
    paintQuickTags();
    paintDropdownItems();
    renderActiveFilters();
    syncHash();
  }

  function paintQuickTags() {
    quickTagButtons.forEach((button) => {
      const tag = button.dataset.tag;
      const isActive = (tag === "all" && selectedTags.length === 0) ||
        selectedTags.includes(tag);
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive);
    });
  }

  function paintDropdownItems() {
    dropdownItems.forEach((item) => {
      const isSelected = selectedTags.includes(item.dataset.tag);
      item.classList.toggle("selected", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });
  }

  function renderActiveFilters() {
    if (!activeFiltersBox || !activeFiltersTags) return;
    if (selectedTags.length === 0) {
      activeFiltersBox.style.display = "none";
      return;
    }
    activeFiltersBox.style.display = "flex";
    activeFiltersTags.innerHTML = selectedTags.map((tag) => `
      <button class="active-filter-tag" data-remove-tag="${tag}" aria-label="Remove ${tag} filter" title="Remove ${tag} filter">
        ${tag} <span class="active-filter-x" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6l12 12"/></svg></span>
      </button>
    `).join("");
    activeFiltersTags.querySelectorAll("[data-remove-tag]").forEach(
      (button) => {
        button.addEventListener("click", () => {
          const index = selectedTags.indexOf(button.dataset.removeTag);
          if (index > -1) selectedTags.splice(index, 1);
          refreshFilterUI();
          resetPageAndRender();
        });
      },
    );
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      selectedTags = [];
      refreshFilterUI();
      resetPageAndRender();
    });
  }

  function syncHash() {
    const params = new URLSearchParams();
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (currentView !== "all") params.set("view", currentView);
    const query = params.toString();
    const url = query
      ? `${globalThis.location.pathname}#${query}`
      : globalThis.location.pathname;
    history.replaceState(null, "", url);
  }

  function parseHash() {
    const hash = globalThis.location.hash.slice(1);
    if (!hash) return { tags: [], view: "all" };
    const params = new URLSearchParams(hash);
    const tags = params.get("tags");
    return {
      tags: tags ? tags.split(",").map((tag) => tag.trim().toLowerCase()) : [],
      view: params.get("view") || "all",
    };
  }

  function saveSession() {
    const state = {
      page: currentPage,
      view: currentView,
      tags: selectedTags,
      search: searchInput.value,
      scrollY: globalThis.scrollY,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }

  function restoreState() {
    const fromHash = parseHash();
    if (fromHash.tags.length > 0 || fromHash.view !== "all") {
      selectedTags = fromHash.tags;
      currentView = fromHash.view;
      refreshFilterUI();
      paintViewTabs();
      tagFiltersBox.style.display = currentView === "all" ? "" : "none";
      return true;
    }
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (!saved) return false;
      currentPage = saved.page || 1;
      currentView = saved.view || "all";
      selectedTags = saved.tags || [];
      searchInput.value = saved.search || "";
      paintViewTabs();
      refreshFilterUI();
      tagFiltersBox.style.display = currentView === "all" ? "" : "none";
      if (saved.scrollY > 0) {
        setTimeout(() => globalThis.scrollTo(0, saved.scrollY), 50);
      }
      return true;
    } catch {
      return false;
    }
  }

  function paintViewTabs() {
    viewTabs.forEach((tab) => {
      const isActive = tab.dataset.view === currentView;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });
  }

  allCards.forEach((card) => {
    const link = card.querySelector("a");
    if (link) link.addEventListener("click", saveSession);
  });

  function getBookmarks() {
    try {
      const stored = JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || [];
      return stored.map((entry) => entry.replace(/\/$/, ""));
    } catch {
      return [];
    }
  }

  function toggleBookmark(url) {
    const bookmarks = getBookmarks();
    const normalized = url.replace(/\/$/, "");
    const index = bookmarks.indexOf(normalized);
    if (index > -1) bookmarks.splice(index, 1);
    else bookmarks.push(normalized);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    paintBookmarks();
    paintBookmarkCount();
    if (currentView === "bookmarks") resetPageAndRender();
  }

  function paintBookmarks() {
    const bookmarks = getBookmarks();
    document.querySelectorAll(".bookmark-btn").forEach((button) => {
      const isSaved = bookmarks.includes(button.dataset.url.replace(/\/$/, ""));
      button.classList.toggle("bookmarked", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.setAttribute(
        "aria-label",
        isSaved ? "Remove bookmark" : "Bookmark article",
      );
      button.title = isSaved ? "Remove bookmark" : "Bookmark article";
    });
  }

  function paintBookmarkCount() {
    const count = getBookmarks().length;
    bookmarkCountEl.textContent = count > 0 ? `(${count})` : "";
  }

  document.querySelectorAll(".bookmark-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleBookmark(button.dataset.url);
    });
  });
  paintBookmarks();
  paintBookmarkCount();

  function getReadingHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  }

  function paintReadStates() {
    const readUrls = getReadingHistory().map((entry) => {
      const url = typeof entry == "string" ? entry : entry.url;
      return url.replace(/\/$/, "");
    });
    allCards.forEach((card) => {
      const url = card.dataset.url.replace(/\/$/, "");
      if (readUrls.includes(url)) card.classList.add("read");
    });
  }
  paintReadStates();

  function parseSearchQuery(raw) {
    const separator = raw.indexOf(":");
    if (separator > 0) {
      const tags = raw.substring(0, separator).trim().toLowerCase();
      return {
        tags: tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
        term: raw.substring(separator + 1).trim().toLowerCase(),
      };
    }
    return { tags: [], term: raw.toLowerCase() };
  }

  function computeFiltered() {
    const { tags: queryTags, term } = parseSearchQuery(
      searchInput.value.trim(),
    );
    const bookmarks = getBookmarks();
    const readUrls = getReadingHistory().map((entry) => {
      const url = typeof entry == "string" ? entry : entry.url;
      return url.replace(/\/$/, "");
    });
    return allCards.filter((card) => {
      const url = card.dataset.url.replace(/\/$/, "");
      const title = (card.dataset.title || "").toLowerCase();
      const tags = (card.dataset.tags || "").toLowerCase().split(",").filter(
        (tag) => tag,
      );
      if (currentView === "bookmarks" && !bookmarks.includes(url)) return false;
      if (currentView === "history" && !readUrls.includes(url)) return false;
      let tagMatch = true;
      if (queryTags.length > 0) {
        tagMatch = queryTags.every((tag) => tags.includes(tag));
      } else if (selectedTags.length > 0 && !selectedTags.includes("all")) {
        tagMatch = selectedTags.every((tag) =>
          tags.includes(tag.toLowerCase())
        );
      }
      const termMatch = !term ||
        title.includes(term) ||
        tags.some((tag) => tag.includes(term));
      return tagMatch && termMatch;
    });
  }

  function prefersReducedMotion() {
    return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function scrollToTop() {
    globalThis.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredCards.length / PER_PAGE);
    paginationControls.innerHTML = "";
    if (totalPages <= 1) {
      paginationControls.style.display = "none";
      return;
    }
    paginationControls.style.display = "flex";
    if (currentPage > 1) {
      const back = document.createElement("a");
      back.className = "tech-tag pagination-btn";
      back.textContent = "← Back";
      back.setAttribute("aria-label", "Previous page");
      back.href = "#";
      back.onclick = (event) => {
        event.preventDefault();
        currentPage--;
        renderCards();
        scrollToTop();
      };
      paginationControls.appendChild(back);
    }
    const firstPage = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(MAX_PAGE_BUTTONS / 2),
        totalPages - MAX_PAGE_BUTTONS + 1,
      ),
    );
    const lastPage = Math.min(totalPages, firstPage + MAX_PAGE_BUTTONS - 1);
    for (let page = firstPage; page <= lastPage; page++) {
      const isCurrent = page === currentPage;
      const button = document.createElement(isCurrent ? "span" : "a");
      button.className = `tech-tag pagination-btn${
        isCurrent ? " pagination-active" : ""
      }`;
      button.textContent = page;
      button.setAttribute("aria-label", "Page " + page);
      if (isCurrent) {
        button.setAttribute("aria-current", "page");
      } else {
        button.href = "#";
        button.onclick = (event) => {
          event.preventDefault();
          currentPage = page;
          renderCards();
          scrollToTop();
        };
      }
      paginationControls.appendChild(button);
    }
    if (currentPage < totalPages) {
      const next = document.createElement("a");
      next.className = "tech-tag pagination-btn";
      next.textContent = "Next →";
      next.setAttribute("aria-label", "Next page");
      next.href = "#";
      next.onclick = (event) => {
        event.preventDefault();
        currentPage++;
        renderCards();
        scrollToTop();
      };
      paginationControls.appendChild(next);
    }
  }

  function highlightMatch(card, term) {
    const link = card.querySelector(".blog-card-title a");
    if (!link) return;
    if (!term) {
      link.innerHTML = card.dataset.title;
      return;
    }
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    link.innerHTML = card.dataset.title.replace(
      new RegExp(`(${escaped})`, "gi"),
      "<mark>$1</mark>",
    );
  }

  function renderCards() {
    filteredCards = computeFiltered();
    const totalPages = Math.ceil(filteredCards.length / PER_PAGE);
    const { term } = parseSearchQuery(searchInput.value.trim());
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    allCards.forEach((card) => {
      card.style.display = "none";
      card.style.opacity = "0";
      card.style.animationDelay = "";
      highlightMatch(card, "");
    });
    const start = (currentPage - 1) * PER_PAGE;
    filteredCards.slice(start, start + PER_PAGE).forEach((card, position) => {
      card.style.display = "";
      card.style.animationDelay = `${position * 50}ms`;
      void card.offsetWidth;
      card.style.opacity = "1";
      if (term) highlightMatch(card, term);
    });
    const isEmpty = filteredCards.length === 0;
    noResultsEl.style.display = isEmpty ? "block" : "none";
    cardsContainer.style.display = isEmpty ? "none" : "";
    searchClearBtn.style.display = searchInput.value.trim() ? "flex" : "none";
    if (isEmpty) {
      if (resultCountEl) resultCountEl.style.display = "none";
      if (currentView === "bookmarks") {
        noResultsEl.innerHTML =
          "<p>No Bookmarks Yet</p><p style='font-size: 0.875rem; margin-top: 0.75rem;'>Click the bookmark icon on any article to save it for later.</p>";
      } else if (currentView === "history") {
        noResultsEl.innerHTML =
          "<p>No Reading History</p><p style='font-size: 0.875rem; margin-top: 0.75rem;'>Start reading articles to build your history.</p>";
      } else if (selectedTags.length > 0) {
        const suggestions = [
          ...document.querySelectorAll(
            '.quick-tags .filter-tag:not([data-tag="all"])',
          ),
        ].map((button) => button.dataset.tag)
          .filter((tag) => !selectedTags.includes(tag))
          .slice(0, 3);
        const suggestionHtml = suggestions.length > 0
          ? `<p style="margin-top: 1rem; font-size: 0.875rem;">Try these tags: ${
            suggestions.map((tag) =>
              `<button class="suggest-tag" data-tag="${tag}">${tag}</button>`
            ).join(" ")
          }</p>`
          : "";
        noResultsEl.innerHTML =
          `<p>No Posts Found</p><p style='font-size: 0.875rem; margin-top: 0.75rem;'>No posts match ${
            selectedTags.length > 1 ? "all these tags" : "this tag"
          }.</p>${suggestionHtml}`;
        noResultsEl.querySelectorAll(".suggest-tag").forEach((button) => {
          button.addEventListener("click", () => {
            selectedTags = [button.dataset.tag];
            refreshFilterUI();
            resetPageAndRender();
          });
        });
      } else {
        noResultsEl.innerHTML =
          "<p>No Posts Found</p><p style='font-size: 0.875rem; margin-top: 0.75rem;'>Try adjusting your search query.</p>";
      }
    } else {
      if (resultCountEl && resultCountText) {
        const totalPosts = allCards.length;
        if (
          selectedTags.length > 0 || searchInput.value.trim() ||
          currentView !== "all"
        ) {
          resultCountText.textContent =
            `Showing ${filteredCards.length} of ${totalPosts} post${
              totalPosts !== 1 ? "s" : ""
            }`;
          resultCountEl.style.display = "block";
        } else {
          resultCountEl.style.display = "none";
        }
      }
    }
    renderPagination();
    syncHash();
  }

  function resetPageAndRender() {
    currentPage = 1;
    renderCards();
  }

  searchInput.addEventListener("input", resetPageAndRender);
  searchInput.addEventListener("search", resetPageAndRender);
  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    selectedTags = [];
    refreshFilterUI();
    resetPageAndRender();
    searchInput.focus();
  });

  viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentView = tab.dataset.view;
      paintViewTabs();
      tagFiltersBox.style.display = currentView === "all" ? "" : "none";
      syncHash();
      resetPageAndRender();
    });
  });

  quickTagButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const tag = button.dataset.tag;
      if (tag === "all") {
        selectedTags = [];
      } else if (event.ctrlKey || event.metaKey) {
        const index = selectedTags.indexOf(tag);
        if (index > -1) selectedTags.splice(index, 1);
        else selectedTags.push(tag);
      } else {
        selectedTags = [tag];
      }
      refreshFilterUI();
      resetPageAndRender();
    });
  });

  document.querySelectorAll(".blog-card .tech-tag").forEach((tag) => {
    tag.style.cursor = "pointer";
    tag.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const tagName = tag.dataset.tag.toLowerCase();
      currentView = "all";
      paintViewTabs();
      tagFiltersBox.style.display = "";
      if (event.ctrlKey || event.metaKey) {
        if (!selectedTags.includes(tagName)) selectedTags.push(tagName);
      } else {
        selectedTags = [tagName];
      }
      refreshFilterUI();
      resetPageAndRender();
      document.querySelector(".blog-search-container").scrollIntoView({
        behavior: prefersReducedMotion() ? "instant" : "smooth",
      });
    });
  });

  globalThis.addEventListener("hashchange", () => {
    const parsed = parseHash();
    selectedTags = parsed.tags;
    currentView = parsed.view;
    refreshFilterUI();
    paintViewTabs();
    tagFiltersBox.style.display = currentView === "all" ? "" : "none";
    resetPageAndRender();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape" && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  restoreState();
  renderCards();
})();
