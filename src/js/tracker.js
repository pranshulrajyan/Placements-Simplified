import { readJson, writeJson } from "./storage.js";

const KEY = "application_tracker";

export function initTracker() {
  const form = document.getElementById("tracker-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const company = document.getElementById("tracker-company").value.trim();
    const role = document.getElementById("tracker-role").value.trim();
    const status = document.getElementById("tracker-status").value;
    const date = document.getElementById("tracker-date").value;
    if (!company || !role) return;

    const rows = readJson(KEY, []);
    rows.unshift({
      id: Date.now(),
      company,
      role,
      status,
      date: date || new Date().toISOString().slice(0, 10)
    });
    writeJson(KEY, rows);
    form.reset();
    render();
  });

  document.getElementById("tracker-table-body")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    const id = Number(btn.getAttribute("data-remove"));
    writeJson(
      KEY,
      readJson(KEY, []).filter((row) => row.id !== id)
    );
    render();
  });

  render();
}

function render() {
  const body = document.getElementById("tracker-table-body");
  const summary = document.getElementById("tracker-summary");
  if (!body) return;
  const rows = readJson(KEY, []);

  if (summary) {
    const offers = rows.filter((r) => r.status === "Offer").length;
    summary.textContent = rows.length
      ? `${rows.length} applications · ${offers} offer${offers === 1 ? "" : "s"}`
      : "No applications logged yet.";
  }

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty-note">Add a company to start tracking campus and off-campus drives.</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.company)}</td>
        <td>${escapeHtml(row.role)}</td>
        <td><span class="status-mark status-${row.status.toLowerCase()}">${row.status}</span></td>
        <td>${row.date}</td>
        <td><button type="button" class="text-btn" data-remove="${row.id}">Remove</button></td>
      </tr>`
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
