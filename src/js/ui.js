export function openAuthModal() {
  document.getElementById("auth-dialog")?.showModal();
}

export function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function initTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById(target)?.classList.add("is-active");
    });
  });
}

export function initInnerTabs() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-inner-tab]");
    if (!btn) return;
    const parent = btn.closest(".unlocked-block");
    if (!parent) return;
    const targetId = btn.getAttribute("data-inner-tab");
    parent.querySelectorAll("[data-inner-tab]").forEach((b) => b.classList.remove("is-active"));
    parent.querySelectorAll(".inner-panel").forEach((p) => p.classList.remove("is-active"));
    btn.classList.add("is-active");
    parent.querySelector(`#${targetId}`)?.classList.add("is-active");
  });
}

export function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

export function initSiteSearch() {
  const input = document.getElementById("site-search");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  const index = [
    ...Array.from(document.querySelectorAll("h2, h3, h4")).map((el) => ({
      label: el.textContent.trim(),
      href: el.closest("section")?.id ? `#${el.closest("section").id}` : "#domains"
    })),
    { label: "Application tracker", href: "#tracker" },
    { label: "Resume reviewer", href: "#projects" },
    { label: "Company programs", href: "#company-offers" },
    { label: "Daily drill", href: "#drill" }
  ].filter((item) => item.label);

  const render = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      results.classList.add("is-hidden");
      results.innerHTML = "";
      return;
    }
    const matches = index.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) {
      results.innerHTML = `<p class="search-empty">No matches for “${query}”.</p>`;
      results.classList.remove("is-hidden");
      return;
    }
    results.innerHTML = matches
      .map((item) => `<a class="search-hit" href="${item.href}">${item.label}</a>`)
      .join("");
    results.classList.remove("is-hidden");
  };

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("focus", () => {
    if (input.value.trim()) render(input.value);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      results.classList.add("is-hidden");
    }
  });
  results.addEventListener("click", () => {
    results.classList.add("is-hidden");
    input.value = "";
  });
}
