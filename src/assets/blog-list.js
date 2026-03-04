(function () {
  const _ = "blog_pagination_state",
    c = document.getElementById("blogSearch"),
    $ = document.getElementById("searchClear"),
    R = document.querySelectorAll(".quick-tags .filter-tag"),
    E = document.querySelectorAll(".view-tab"),
    L = document.getElementById("tagFiltersContainer"),
    j = document.getElementById("bookmarkCount"),
    b = [...document.querySelectorAll(".blog-card")],
    k = document.getElementById("noResults"),
    N = document.getElementById("pagination-container"),
    w = document.getElementById("pagination-controls"),
    m = document.getElementById("tagDropdown"),
    h = document.getElementById("tagDropdownTrigger"),
    rt = document.getElementById("tagDropdownPanel"),
    y = document.getElementById("tagDropdownSearch"),
    ct = document.getElementById("tagDropdownList"),
    x = document.getElementById("tagDropdownEmpty"),
    S = document.querySelectorAll(".tag-dropdown-item"),
    B = document.getElementById("activeFilters"),
    D = document.getElementById("activeFiltersTags"),
    q = document.getElementById("clearFilters");
  if (!c || !N) return;
  let s = [], i = "all", r = 1, T = b, d = -1;
  function P() {
    return [...S].filter((t) => t.style.display !== "none");
  }
  function F(t) {
    var a;
    const e = P();
    e.length !== 0 &&
      (d = Math.max(0, Math.min(t, e.length - 1)),
        e.forEach((l, o) => {
          l.classList.toggle("focused", o === d);
        }),
        (a = e[d]) == null || a.scrollIntoView({ block: "nearest" }));
  }
  h && m && (h.addEventListener("click", (t) => {
    t.stopPropagation();
    const e = m.classList.toggle("open");
    h.setAttribute("aria-expanded", e),
      e && y && (d = -1, setTimeout(() => y.focus(), 50));
  }),
    document.addEventListener("click", (t) => {
      m.contains(t.target) ||
        (m.classList.remove("open"),
          h.setAttribute("aria-expanded", "false"),
          d = -1);
    }),
    m.addEventListener("keydown", (t) => {
      var a;
      const e = P();
      t.key === "ArrowDown"
        ? (t.preventDefault(), F(d + 1))
        : t.key === "ArrowUp"
        ? (t.preventDefault(), F(d - 1))
        : t.key === "Enter" && d >= 0
        ? (t.preventDefault(), (a = e[d]) == null || a.click())
        : t.key === "Escape" &&
          (m.classList.remove("open"),
            h.setAttribute("aria-expanded", "false"),
            h.focus(),
            d = -1);
    }),
    y && y.addEventListener("input", () => {
      const t = y.value.toLowerCase().trim();
      let e = 0;
      S.forEach((a) => {
        const o = a.dataset.tag.toLowerCase().includes(t);
        a.style.display = o ? "" : "none",
          a.classList.remove("focused"),
          o && e++;
      }),
        d = -1,
        x && (x.style.display = e === 0 ? "block" : "none");
    }),
    S.forEach((t) => {
      t.addEventListener("click", () => {
        const e = t.dataset.tag;
        Q(e),
          m.classList.remove("open"),
          h.setAttribute("aria-expanded", "false"),
          y && (y.value = ""),
          S.forEach((a) => {
            a.style.display = "", a.classList.remove("focused");
          }),
          d = -1,
          x && (x.style.display = "none");
      }),
        t.addEventListener("mouseenter", () => {
          const e = P();
          d = e.indexOf(t),
            e.forEach((a, l) => a.classList.toggle("focused", l === d));
        });
    }));
  function Q(t) {
    if (t === "all") s = [];
    else {
      const e = s.indexOf(t);
      e > -1 ? s.splice(e, 1) : s.push(t);
    }
    f(), g();
  }
  function f() {
    z(), W(), X(), A();
  }
  function z() {
    R.forEach((t) => {
      const e = t.dataset.tag,
        a = e === "all" && s.length === 0 || s.includes(e);
      t.classList.toggle("active", a), t.setAttribute("aria-selected", a);
    });
  }
  function W() {
    S.forEach((t) => {
      const e = t.dataset.tag;
      t.classList.toggle("selected", s.includes(e));
    });
  }
  function X() {
    if (!(!B || !D)) {
      if (s.length === 0) {
        B.style.display = "none";
        return;
      }
      B.style.display = "flex",
        D.innerHTML = s.map((t) => `
      <span class="active-filter-tag">
        ${t}
        <button data-remove-tag="${t}" aria-label="Remove ${t} filter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </span>
    `).join(""),
        D.querySelectorAll("[data-remove-tag]").forEach((t) => {
          t.addEventListener("click", () => {
            const e = t.dataset.removeTag, a = s.indexOf(e);
            a > -1 && s.splice(a, 1), f(), g();
          });
        });
    }
  }
  q && q.addEventListener("click", () => {
    s = [], f(), g();
  });
  function A() {
    const t = new URLSearchParams();
    s.length > 0 && t.set("tags", s.join(",")), i !== "all" && t.set("view", i);
    const e = t.toString(),
      a = e ? `${window.location.pathname}#${e}` : window.location.pathname;
    history.replaceState(null, "", a);
  }
  function H() {
    const t = window.location.hash.slice(1);
    if (!t) return { tags: [], view: "all" };
    const e = new URLSearchParams(t), a = e.get("tags"), l = e.get("view");
    return {
      tags: a ? a.split(",").map((o) => o.trim().toLowerCase()) : [],
      view: l || "all",
    };
  }
  function Z() {
    const t = {
      page: r,
      view: i,
      tags: s,
      search: c.value,
      scrollY: window.scrollY,
    };
    sessionStorage.setItem(_, JSON.stringify(t));
  }
  function tt() {
    const t = H();
    if (t.tags.length > 0 || t.view !== "all") {
      return s = t.tags,
        i = t.view,
        f(),
        E.forEach((e) => e.classList.toggle("active", e.dataset.view === i)),
        L.style.display = i === "all" ? "" : "none",
        !0;
    }
    try {
      const e = JSON.parse(sessionStorage.getItem(_));
      return e
        ? (r = e.page || 1,
          i = e.view || "all",
          s = e.tags || [],
          c.value = e.search || "",
          E.forEach((a) => a.classList.toggle("active", a.dataset.view === i)),
          f(),
          L.style.display = i === "all" ? "" : "none",
          e.scrollY > 0 && setTimeout(() => window.scrollTo(0, e.scrollY), 50),
          !0)
        : !1;
    } catch (e) {
      return !1;
    }
  }
  b.forEach((t) => {
    const e = t.querySelector("a");
    e && e.addEventListener("click", Z);
  });
  const U = "blog_bookmarks";
  function C() {
    try {
      return JSON.parse(localStorage.getItem(U)) || [];
    } catch (t) {
      return [];
    }
  }
  function et(t) {
    const e = C(), a = e.indexOf(t);
    a > -1 ? e.splice(a, 1) : e.push(t),
      localStorage.setItem(U, JSON.stringify(e)),
      K(),
      Y(),
      i === "bookmarks" && g();
  }
  function K() {
    const t = C();
    document.querySelectorAll(".bookmark-btn").forEach((e) => {
      const a = e.dataset.url, l = t.includes(a);
      e.classList.toggle("bookmarked", l),
        e.title = l ? "Remove bookmark" : "Bookmark";
    });
  }
  function Y() {
    const t = C().length;
    j.textContent = t > 0 ? `(${t})` : "";
  }
  document.querySelectorAll(".bookmark-btn").forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault(), e.stopPropagation(), et(t.dataset.url);
    });
  }),
    K(),
    Y();
  const at = "blog_reading_history";
  function G() {
    try {
      return JSON.parse(localStorage.getItem(at)) || [];
    } catch (t) {
      return [];
    }
  }
  function ot() {
    const t = G().map((e) => typeof e == "string" ? e : e.url);
    b.forEach((e) => {
      const a = e.dataset.url;
      t.includes(a) && e.classList.add("read");
    });
  }
  ot();
  function J(t) {
    const e = t.indexOf(":");
    if (e > 0) {
      const a = t.substring(0, e).trim().toLowerCase(),
        l = t.substring(e + 1).trim().toLowerCase();
      return {
        tags: a.split(",").map((n) => n.trim()).filter((n) => n),
        term: l,
      };
    }
    return { tags: [], term: t.toLowerCase() };
  }
  function nt() {
    const t = c.value.trim(),
      { tags: e, term: a } = J(t),
      l = C(),
      o = G().map((n) => typeof n == "string" ? n : n.url);
    return b.filter((n) => {
      const p = n.dataset.url,
        u = (n.dataset.title || "").toLowerCase(),
        M = (n.dataset.tags || "").toLowerCase().split(",").filter((v) => v);
      if (
        i === "bookmarks" && !l.includes(p) || i === "history" && !o.includes(p)
      ) return !1;
      let O = !0;
      e.length > 0
        ? O = e.every((v) => M.includes(v))
        : s.length > 0 && !s.includes("all") &&
          (O = s.every((v) => M.includes(v.toLowerCase())));
      const lt = !a || u.includes(a) || M.some((v) => v.includes(a));
      return O && lt;
    });
  }
  function st() {
    const t = Math.ceil(T.length / 6);
    if (w.innerHTML = "", t <= 1) {
      w.style.display = "none";
      return;
    }
    if (w.style.display = "flex", r > 1) {
      const o = document.createElement("a");
      o.className = "tech-tag pagination-btn",
        o.textContent = "\u2190 Back",
        o.href = "#",
        o.onclick = (n) => {
          n.preventDefault(),
            r--,
            I(),
            scrollTo({ top: 0, behavior: "smooth" });
        },
        w.appendChild(o);
    }
    const e = 10;
    let a = Math.max(1, Math.min(r - Math.floor(e / 2), t - e + 1)),
      l = Math.min(t, a + e - 1);
    for (let o = a; o <= l; o++) {
      const n = document.createElement(o === r ? "span" : "a");
      n.className = `tech-tag pagination-btn${
        o === r ? " pagination-active" : ""
      }`,
        n.textContent = o,
        o !== r && (n.href = "#",
          n.onclick = (p) => {
            p.preventDefault(),
              r = o,
              I(),
              scrollTo({ top: 0, behavior: "smooth" });
          }),
        w.appendChild(n);
    }
    if (r < t) {
      const o = document.createElement("a");
      o.className = "tech-tag pagination-btn",
        o.textContent = "Next \u2192",
        o.href = "#",
        o.onclick = (n) => {
          n.preventDefault(),
            r++,
            I(),
            scrollTo({ top: 0, behavior: "smooth" });
        },
        w.appendChild(o);
    }
  }
  function V(t, e) {
    const a = t.querySelector(".blog-card-title a");
    if (!a) return;
    const l = t.dataset.title;
    if (!e) {
      a.innerHTML = l;
      return;
    }
    const o = new RegExp(`(${e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    a.innerHTML = l.replace(o, "<mark>$1</mark>");
  }
  function I() {
    T = nt();
    const t = Math.ceil(T.length / 6), e = J(c.value.trim()).term;
    r > t && (r = Math.max(1, t)),
      b.forEach((n) => {
        n.style.display = "none",
          n.style.opacity = "0",
          n.style.animationDelay = "",
          V(n, "");
      });
    const a = (r - 1) * 6, l = a + 6;
    T.slice(a, l).forEach((n, p) => {
      n.style.display = "",
        n.style.animationDelay = `${p * 50}ms`,
        n.offsetWidth,
        n.style.opacity = "1",
        e && V(n, e);
    });
    const o = T.length === 0;
    if (
      k.style.display = o ? "block" : "none",
        N.style.display = o ? "none" : "",
        $.style.display = c.value.trim() ? "flex" : "none",
        o
    ) {
      if (i === "bookmarks") {
        k.innerHTML =
          "<p>No bookmarked articles yet. Click the bookmark icon on any article to save it.</p>";
      } else if (i === "history") {
        k.innerHTML =
          "<p>No reading history yet. Start reading articles to build your history.</p>";
      } else if (s.length > 0) {
        const n = [
            ...document.querySelectorAll(
              '.quick-tags .filter-tag:not([data-tag="all"])',
            ),
          ].map((u) => u.dataset.tag).filter((u) => !s.includes(u)).slice(0, 3),
          p = n.length > 0
            ? `<p style="margin-top: 0.5rem; font-size: 0.9rem;">Try: ${
              n.map((u) =>
                `<button class="suggest-tag" data-tag="${u}">${u}</button>`
              ).join(" ")
            }</p>`
            : "";
        k.innerHTML = `<p>No posts found with ${
          s.length > 1 ? "all these tags" : "this tag"
        }.</p>${p}`,
          k.querySelectorAll(".suggest-tag").forEach((u) => {
            u.addEventListener("click", () => {
              s = [u.dataset.tag], f(), g();
            });
          });
      } else k.innerHTML = "<p>No posts found matching your search.</p>";
    }
    st(), A();
  }
  function g() {
    r = 1, I();
  }
  c.addEventListener("input", g),
    c.addEventListener("search", g),
    $.addEventListener("click", () => {
      c.value = "", s = [], f(), g(), c.focus();
    }),
    E.forEach((t) => {
      t.addEventListener("click", () => {
        i = t.dataset.view,
          E.forEach((e) => e.classList.remove("active")),
          t.classList.add("active"),
          L.style.display = i === "all" ? "" : "none",
          A(),
          g();
      });
    }),
    R.forEach((t) => {
      t.addEventListener("click", (e) => {
        const a = t.dataset.tag;
        if (a === "all") s = [];
        else if (e.ctrlKey || e.metaKey) {
          const l = s.indexOf(a);
          l > -1 ? s.splice(l, 1) : s.push(a);
        } else s = [a];
        f(), g();
      });
    }),
    document.querySelectorAll(".blog-card .tech-tag").forEach((t) => {
      t.style.cursor = "pointer",
        t.addEventListener("click", (e) => {
          e.preventDefault(), e.stopPropagation();
          const a = t.dataset.tag.toLowerCase();
          i = "all",
            E.forEach((l) =>
              l.classList.toggle("active", l.dataset.view === "all")
            ),
            L.style.display = "",
            e.ctrlKey || e.metaKey ? s.includes(a) || s.push(a) : s = [a],
            f(),
            g(),
            document.querySelector(".blog-search-container").scrollIntoView({
              behavior: "smooth",
            });
        });
    }),
    window.addEventListener("hashchange", () => {
      const t = H();
      s = t.tags,
        i = t.view,
        f(),
        E.forEach((e) => e.classList.toggle("active", e.dataset.view === i)),
        L.style.display = i === "all" ? "" : "none",
        g();
    }),
    document.addEventListener("keydown", (t) => {
      t.key === "/" && document.activeElement !== c &&
      (t.preventDefault(), c.focus()),
        t.key === "Escape" && document.activeElement === c && c.blur();
    }),
    tt(),
    I();
})();
