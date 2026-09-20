import "./css/admin.css";

const ADMIN_EMAIL = "rajyanpranshul@gmail.com";

const defaultMockUsers = [
  {
    name: "Pranshul Rajyan",
    email: "rajyanpranshul@gmail.com",
    createdDate: "2026-07-10 10:15:30",
    lastLogin: new Date().toISOString().slice(0, 19).replace("T", " "),
    isOnline: false
  }
];

function getDatabase() {
  const db = localStorage.getItem("users_database");
  if (!db) {
    localStorage.setItem("users_database", JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  }
  try {
    const parsed = JSON.parse(db);
    if (Array.isArray(parsed)) return parsed;
    localStorage.setItem("users_database", JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  } catch {
    localStorage.setItem("users_database", JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const isUserLoggedIn = localStorage.getItem("user_logged_in") === "true";
  const currentUserEmail = localStorage.getItem("user_email") || "";
  const deniedPanel = document.getElementById("denied-panel");
  const dashboardPanel = document.getElementById("dashboard-panel");

  if (!isUserLoggedIn || currentUserEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    deniedPanel?.classList.remove("hidden");
    dashboardPanel?.classList.add("hidden");
    return;
  }

  deniedPanel?.classList.add("hidden");
  dashboardPanel?.classList.remove("hidden");

  let db = getDatabase();
  renderDashboard(db);
  window.lastDbSerialized = JSON.stringify(db);

  setInterval(() => {
    const freshDb = getDatabase();
    const currentSerialized = JSON.stringify(freshDb);
    if (window.lastDbSerialized !== currentSerialized) {
      window.lastDbSerialized = currentSerialized;
      db = freshDb;
      renderDashboard(db);
      const searchInput = document.getElementById("user-search");
      if (searchInput?.value) searchInput.dispatchEvent(new Event("input"));
    }
  }, 1500);

  const searchInput = document.getElementById("user-search");
  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = db.filter((user) => {
      return (user.name || "").toLowerCase().includes(query) || (user.email || "").toLowerCase().includes(query);
    });
    renderTableOnly(filtered);
  });

  document.getElementById("clear-db-btn")?.addEventListener("click", () => {
    if (confirm("Reset the local user database? Registered accounts will be cleared.")) {
      localStorage.removeItem("users_database");
      db = getDatabase();
      renderDashboard(db);
      if (searchInput) searchInput.value = "";
    }
  });
});

function renderDashboard(db) {
  const countEl = document.getElementById("stat-total-users");
  if (countEl) countEl.textContent = String(db.length);
  const liveCountEl = document.getElementById("live-user-count");
  if (liveCountEl) liveCountEl.textContent = String(db.filter((u) => u.isOnline === true).length);
  renderTableOnly(db);
}

function renderTableOnly(usersArray) {
  const tableBody = document.getElementById("user-table-body");
  const countDisplay = document.getElementById("user-count-display");
  if (!tableBody) return;
  if (countDisplay) countDisplay.textContent = `Showing ${usersArray.length} users`;

  if (!usersArray.length) {
    tableBody.innerHTML = `<tr><td colspan="4">No matching records.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  usersArray.forEach((user) => {
    if (!user?.email) return;
    const tr = document.createElement("tr");
    const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const adminTag = isAdmin ? `<span class="badge-admin">Admin</span>` : "";
    tr.innerHTML = `
      <td>${user.name || "Anonymous"}</td>
      <td class="email-cell">${user.email}${adminTag}</td>
      <td class="date-cell">${user.createdDate || "—"}</td>
      <td class="date-cell">${user.lastLogin || "—"}</td>
    `;
    tableBody.appendChild(tr);
  });
}
