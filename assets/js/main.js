/* ============================================================
   main.js — Weitao HU Academic Homepage
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ── Year ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Nav toggle (mobile) ── */
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("open");
    });
  }

  /* ── Nav scroll shrink ── */
  const topnav = document.getElementById("topnav");
  if (topnav) {
    window.addEventListener("scroll", () => {
      topnav.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  /* ── Search overlay ── */
  const searchToggle  = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose   = document.getElementById("searchClose");
  const searchInput   = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("active");
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("active");
    if (searchInput)   searchInput.value = "";
    if (searchResults) searchResults.innerHTML = "";
  }
  if (searchToggle) searchToggle.addEventListener("click", openSearch);
  if (searchClose)  searchClose.addEventListener("click", closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener("click", e => {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });

  /* Search using POSTS injected by Jekyll blog layout */
  if (searchInput && typeof POSTS !== "undefined") {
    searchInput.addEventListener("input", function () {
      const q = this.value.trim().toLowerCase();
      if (!q) { searchResults.innerHTML = ""; return; }
      const hits = POSTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
        p.excerpt.toLowerCase().includes(q)
      );
      if (!hits.length) {
        searchResults.innerHTML = `<p class="search-empty">No results for "<em>${q}</em>"</p>`;
        return;
      }
      searchResults.innerHTML = hits.map(p => `
        <a class="search-result-item" href="${p.url}">
          <span class="sr-title">${p.title}</span>
          <span class="sr-meta">${formatDate(p.date)} · ${(p.tags || []).join(", ")}</span>
        </a>
      `).join("");
    });
  }

  /* ── Fade-in on scroll ── */
  const fadeEls = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add("visible"));
  }

  /* ── Language switch (biography section) ── */
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      document.querySelectorAll(".lang-content").forEach(c => c.classList.remove("active"));
      const target = document.getElementById("content-" + this.dataset.lang);
      if (target) target.classList.add("active");
    });
  });

  /* ── Post page: auto-build TOC ── */
  const postContent = document.querySelector(".post-content");
  const tocAside    = document.getElementById("tocAside");
  if (postContent && tocAside) {
    const headings = postContent.querySelectorAll("h2, h3");
    if (headings.length >= 2) {
      const items = Array.from(headings).map((h, i) => {
        if (!h.id) h.id = "heading-" + i;
        const cls = h.tagName === "H3" ? " toc-sub" : "";
        return `<li class="toc-item${cls}"><a href="#${h.id}">${h.textContent}</a></li>`;
      });
      tocAside.innerHTML = `<h4 class="toc-title">Contents</h4><ul class="toc-list">${items.join("")}</ul>`;
    }
  }

  /* ── Blog page: tag filter + post list ── */
  const blogPostsListEl = document.getElementById("blogPostsList");
  const blogTagFilterEl = document.getElementById("blogTagFilter");
  const POSTS_PER_PAGE  = 5;

  if (blogPostsListEl && typeof POSTS !== "undefined") {
    const params    = new URLSearchParams(window.location.search);
    let activeTag   = params.get("tag") || null;
    let currentPage = 1;

    function getAllTags() {
      const s = new Set();
      POSTS.forEach(p => (p.tags || []).forEach(t => s.add(t)));
      return Array.from(s).sort();
    }

    function renderTagFilter(active) {
      if (!blogTagFilterEl) return;
      blogTagFilterEl.innerHTML =
        `<button class="tag-filter-btn${!active ? " active" : ""}" data-tag="">All</button>` +
        getAllTags().map(t =>
          `<button class="tag-filter-btn${t === active ? " active" : ""}" data-tag="${t}">${t}</button>`
        ).join("");
      blogTagFilterEl.querySelectorAll(".tag-filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          activeTag = this.dataset.tag || null;
          currentPage = 1;
          renderTagFilter(activeTag);
          renderBlogList(activeTag, currentPage);
        });
      });
    }

    function renderBlogList(tag, page) {
      const filtered = tag ? POSTS.filter(p => (p.tags || []).includes(tag)) : POSTS;
      const pEl = document.getElementById("pagination");

      if (tag) {
        // Year-grouped view when filtering by tag
        const byYear = {};
        filtered.forEach(p => {
          const yr = p.date.slice(0, 4);
          if (!byYear[yr]) byYear[yr] = [];
          byYear[yr].push(p);
        });
        blogPostsListEl.innerHTML = Object.keys(byYear).sort((a, b) => b - a).map(yr => `
          <div class="blog-year-group fade-in">
            <h3 class="blog-year-label">${yr}</h3>
            ${byYear[yr].map(p => renderListItem(p)).join("")}
          </div>
        `).join("");
        if (pEl) pEl.innerHTML = "";
      } else {
        // Flat paginated list
        const start = (page - 1) * POSTS_PER_PAGE;
        const slice = filtered.slice(start, start + POSTS_PER_PAGE);
        blogPostsListEl.innerHTML = slice.map(p => renderListItem(p)).join("");
        renderPagination(filtered.length, page);
      }

      // Wire inline tag buttons
      blogPostsListEl.querySelectorAll(".tag-filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          activeTag = this.dataset.tag || null;
          currentPage = 1;
          renderTagFilter(activeTag);
          renderBlogList(activeTag, currentPage);
        });
      });
      blogPostsListEl.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
    }

    function renderListItem(p) {
      return `
        <article class="blog-list-item fade-in">
          <div class="bli-meta">
            <span class="bli-date">${formatDate(p.date)}</span>
            ${(p.tags || []).map(t =>
              `<button class="blog-tag tag-filter-btn" data-tag="${t}">${t}</button>`
            ).join("")}
          </div>
          <h2 class="bli-title"><a href="${p.url}">${p.title}</a></h2>
          <p class="bli-excerpt">${p.excerpt}</p>
          <a class="blog-read-more" href="${p.url}">Read more →</a>
          <hr class="bli-divider">
        </article>`;
    }

    function renderPagination(total, page) {
      const pages = Math.ceil(total / POSTS_PER_PAGE);
      const el = document.getElementById("pagination");
      if (!el || pages <= 1) { if (el) el.innerHTML = ""; return; }
      let html = "";
      if (page > 1) html += `<button class="page-btn" data-page="${page - 1}">← Prev</button>`;
      for (let i = 1; i <= pages; i++) {
        html += `<button class="page-btn${i === page ? " active" : ""}" data-page="${i}">${i}</button>`;
      }
      if (page < pages) html += `<button class="page-btn" data-page="${page + 1}">Next →</button>`;
      el.innerHTML = html;
      el.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          currentPage = parseInt(btn.dataset.page);
          renderBlogList(activeTag, currentPage);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    }

    /* Sidebar */
    const sbTagCloud = document.getElementById("sidebarTagCloud");
    if (sbTagCloud) {
      sbTagCloud.innerHTML = getAllTags().map(t =>
        `<button class="tag-pill tag-filter-btn" data-tag="${t}">${t}</button>`
      ).join("");
      sbTagCloud.querySelectorAll(".tag-filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          activeTag = this.dataset.tag || null;
          currentPage = 1;
          renderTagFilter(activeTag);
          renderBlogList(activeTag, currentPage);
          window.scrollTo({ top: 120, behavior: "smooth" });
        });
      });
    }
    const sbRecent = document.getElementById("sidebarRecent");
    if (sbRecent) {
      sbRecent.innerHTML = POSTS.slice(0, 5).map(p =>
        `<li><a href="${p.url}">${p.title}</a><span class="sr-date">${formatDate(p.date)}</span></li>`
      ).join("");
    }

    renderTagFilter(activeTag);
    renderBlogList(activeTag, currentPage);
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", function (e) {
      const t = document.querySelector(this.getAttribute("href"));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
    });
  });

});

/* ── Helpers (global so search overlay can use them) ── */
function formatDate(str) {
  return new Date(str + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
}
