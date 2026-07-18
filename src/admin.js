// Placements Simplified Admin Console Script

const ADMIN_EMAIL = "rajyanpranshul@gmail.com";

// Only seed the real admin user account - no fake mock users
const defaultMockUsers = [
  {
    name: "Pranshul Rajyan",
    email: "rajyanpranshul@gmail.com",
    createdDate: "2026-07-10 10:15:30",
    lastLogin: new Date().toISOString().slice(0, 19).replace('T', ' '),
    isOnline: false
  }
];

function getDatabase() {
  const db = localStorage.getItem('users_database');
  if (!db) {
    localStorage.setItem('users_database', JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  }
  try {
    const parsed = JSON.parse(db);
    if (Array.isArray(parsed)) return parsed;
    localStorage.setItem('users_database', JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  } catch (e) {
    localStorage.setItem('users_database', JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  }
}

function saveDatabase(db) {
  localStorage.setItem('users_database', JSON.stringify(db));
}

document.addEventListener('DOMContentLoaded', () => {
  const isUserLoggedIn = localStorage.getItem('user_logged_in') === 'true';
  const currentUserEmail = localStorage.getItem('user_email') || '';

  const deniedPanel = document.getElementById('denied-panel');
  const dashboardPanel = document.getElementById('dashboard-panel');

  // Enforce access control
  if (!isUserLoggedIn || currentUserEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    if (deniedPanel) deniedPanel.classList.remove('hidden');
    if (dashboardPanel) dashboardPanel.classList.add('hidden');
    return;
  }

  // Access approved: load and render dashboard
  if (deniedPanel) deniedPanel.classList.add('hidden');
  if (dashboardPanel) dashboardPanel.classList.remove('hidden');

  let db = getDatabase();
  renderDashboard(db);

  // Set up live polling to automatically refresh registered list and live online count
  window.lastDbSerialized = JSON.stringify(db);
  setInterval(() => {
    const freshDb = getDatabase();
    const currentSerialized = JSON.stringify(freshDb);
    if (window.lastDbSerialized !== currentSerialized) {
      window.lastDbSerialized = currentSerialized;
      db = freshDb;
      renderDashboard(db);
      
      // Keep search state if any
      const searchInput = document.getElementById('user-search');
      if (searchInput && searchInput.value) {
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  }, 1500);

  // Search filter
  const searchInput = document.getElementById('user-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = db.filter(user => {
        const nameMatch = (user.name || '').toLowerCase().includes(query);
        const emailMatch = (user.email || '').toLowerCase().includes(query);
        return nameMatch || emailMatch;
      });
      renderTableOnly(filtered);
    });
  }

  // Clear Database trigger
  const clearBtn = document.getElementById('clear-db-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the user database back to defaults? All custom registrations will be cleared.')) {
        localStorage.removeItem('users_database');
        db = getDatabase();
        renderDashboard(db);
        if (searchInput) searchInput.value = '';
      }
    });
  }
});

function renderDashboard(db) {
  // Update Total registered users count
  const countEl = document.getElementById('stat-total-users');
  if (countEl) countEl.textContent = db.length.toString();

  // Update Live active students count based on actual logged in status (isOnline === true)
  const liveCountEl = document.getElementById('live-user-count');
  if (liveCountEl) {
    const onlineCount = db.filter(u => u.isOnline === true).length;
    liveCountEl.textContent = onlineCount.toString();
  }

  renderTableOnly(db);
}

function renderTableOnly(usersArray) {
  const tableBody = document.getElementById('user-table-body');
  const countDisplay = document.getElementById('user-count-display');

  if (!tableBody) return;

  if (countDisplay) {
    countDisplay.textContent = `Showing ${usersArray.length} users`;
  }

  if (usersArray.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 3rem;">
          No matching records found in the database.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = '';
  usersArray.forEach(user => {
    if (!user || !user.email) return;
    
    const tr = document.createElement('tr');
    const email = user.email || '';
    
    // Add special tag for admin
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const adminTag = isAdmin ? `<span class="badge-admin">Admin</span>` : '';

    tr.innerHTML = `
      <td>${user.name || 'Anonymous User'}</td>
      <td class="email-cell">${email}${adminTag}</td>
      <td class="date-cell">${user.createdDate || '-'}</td>
      <td class="date-cell">${user.lastLogin || '-'}</td>
    `;
    tableBody.appendChild(tr);
  });
}
