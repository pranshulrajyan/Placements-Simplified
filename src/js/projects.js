import { finalYearProjects, projectCategories } from "../data/projects.js";
import { readJson, writeJson } from "./storage.js";

const BOOKMARK_KEY = "project_bookmarks";

export function initProjectsList() {
  const searchInput = document.getElementById("project-search-input");
  const filters = document.getElementById("project-filters");
  let activeCategory = "All";

  if (filters) {
    filters.innerHTML = projectCategories
      .map(
        (cat, i) =>
          `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-category="${cat}">${cat}</button>`
      )
      .join("");
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;
      activeCategory = btn.getAttribute("data-category");
      filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      apply();
    });
  }

  searchInput?.addEventListener("input", apply);
  document.getElementById("projects-scroll-list")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bookmark]");
    if (!btn) return;
    const id = Number(btn.getAttribute("data-bookmark"));
    toggleBookmark(id);
    apply();
  });

  function apply() {
    const query = (searchInput?.value || "").toLowerCase();
    const filtered = finalYearProjects.filter((p) => {
      const catOk = activeCategory === "All" || p.category === activeCategory;
      const qOk = p.title.toLowerCase().includes(query);
      return catOk && qOk;
    });
    renderProjects(filtered);
  }

  apply();
}

function getBookmarks() {
  return new Set(readJson(BOOKMARK_KEY, []));
}

function toggleBookmark(id) {
  const set = getBookmarks();
  if (set.has(id)) set.delete(id);
  else set.add(id);
  writeJson(BOOKMARK_KEY, [...set]);
}

function renderProjects(projectsArray) {
  const container = document.getElementById("projects-scroll-list");
  if (!container) return;
  const bookmarks = getBookmarks();

  if (!projectsArray.length) {
    container.innerHTML = `<p class="empty-note">No matching projects.</p>`;
    return;
  }

  container.innerHTML = projectsArray
    .map((p) => {
      const saved = bookmarks.has(p.id);
      return `
        <article class="project-row">
          <div class="project-row-main">
            <span class="mono-index">${String(p.id).padStart(2, "0")}</span>
            <div>
              <h4>${p.title}</h4>
              <p class="meta-line">${p.category}</p>
            </div>
          </div>
          <div class="project-row-actions">
            <button type="button" class="text-btn" data-bookmark="${p.id}">${saved ? "Saved" : "Save"}</button>
            <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="text-link">Walkthrough</a>
          </div>
        </article>`;
    })
    .join("");
}
