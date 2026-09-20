import { ADMIN_EMAIL, getUserEmail, isAdmin, isLoggedIn, readJson, writeJson } from "./storage.js";
import { refreshAllProgress } from "./checklists.js";
import { updateResumeTriesUI } from "./resume.js";
import { openAuthModal } from "./ui.js";

let isSignUpMode = false;

export function initAuth() {
  const modal = document.getElementById("auth-dialog");
  const closeBtn = document.getElementById("close-auth-btn");
  const authForm = document.getElementById("auth-form");
  const toggleLink = document.getElementById("auth-toggle-link");
  const modalTitle = document.getElementById("auth-modal-title");
  const submitBtnText = document.querySelector("#auth-submit-btn .auth-btn-text");
  const headerAuthBtn = document.getElementById("header-auth-btn");
  const errorMsg = document.getElementById("auth-error-msg");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".unlock-btn");
    if (!btn) return;
    if (!isLoggedIn()) openAuthModal();
  });

  headerAuthBtn?.addEventListener("click", () => {
    if (isLoggedIn()) {
      const email = getUserEmail();
      if (email) setUserOffline(email);
      localStorage.setItem("user_logged_in", "false");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      restoreUnlocks();
    } else {
      openAuthModal();
    }
  });

  closeBtn?.addEventListener("click", () => modal.close());

  toggleLink?.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    modalTitle.textContent = isSignUpMode ? "Create account" : "Sign in";
    submitBtnText.textContent = isSignUpMode ? "Create account" : "Sign in";
    toggleLink.textContent = isSignUpMode ? "Sign in instead" : "Create an account";
  });

  authForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailVal = document.getElementById("auth-email").value.trim();
    const passwordVal = document.getElementById("auth-password").value;

    errorMsg.classList.add("is-hidden");
    errorMsg.textContent = "";

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailVal.toLowerCase())) {
      errorMsg.textContent = "Use a Gmail address ending in @gmail.com.";
      errorMsg.classList.remove("is-hidden");
      return;
    }
    if (passwordVal.length < 6) {
      errorMsg.textContent = "Password must be at least 6 characters.";
      errorMsg.classList.remove("is-hidden");
      return;
    }

    const submitBtn = document.getElementById("auth-submit-btn");
    const spinner = submitBtn.querySelector(".auth-btn-spinner");
    const text = submitBtn.querySelector(".auth-btn-text");
    submitBtn.disabled = true;
    spinner?.classList.remove("is-hidden");
    text?.classList.add("is-hidden");

    setTimeout(() => {
      const name = getNameFromEmail(emailVal);
      let db = readJson("users_database", []);
      if (!db.length) {
        db = [
          {
            name: "Pranshul Rajyan",
            email: ADMIN_EMAIL,
            createdDate: "2026-07-10 10:15:30",
            lastLogin: formatNow(),
            isOnline: false
          }
        ];
        writeJson("users_database", db);
      }

      const existingUser = db.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());

      if (isSignUpMode) {
        if (existingUser) {
          resetSubmit(submitBtn, spinner, text);
          errorMsg.textContent = "An account with this Gmail already exists. Sign in instead.";
          errorMsg.classList.remove("is-hidden");
          return;
        }
        updateUsersDatabase(emailVal.toLowerCase(), name, passwordVal);
      } else {
        if (!existingUser) {
          resetSubmit(submitBtn, spinner, text);
          errorMsg.textContent = "No account found. Create an account first.";
          errorMsg.classList.remove("is-hidden");
          return;
        }
        if (existingUser.password && existingUser.password !== passwordVal) {
          resetSubmit(submitBtn, spinner, text);
          errorMsg.textContent = "Incorrect password.";
          errorMsg.classList.remove("is-hidden");
          return;
        }
        if (!existingUser.password) existingUser.password = passwordVal;
        existingUser.isOnline = true;
        existingUser.lastLogin = formatNow();
        writeJson("users_database", db);
      }

      localStorage.setItem("user_logged_in", "true");
      localStorage.setItem("user_email", emailVal.toLowerCase());
      localStorage.setItem("user_name", name);
      resetSubmit(submitBtn, spinner, text);
      modal.close();
      restoreUnlocks();
    }, 700);
  });
}

function resetSubmit(submitBtn, spinner, text) {
  submitBtn.disabled = false;
  spinner?.classList.add("is-hidden");
  text?.classList.remove("is-hidden");
}

function formatNow() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function getNameFromEmail(email) {
  try {
    const parts = email
      .split("@")[0]
      .split(/[._-]/)
      .map((part) => {
        const textOnly = part.replace(/[0-9]/g, "");
        if (!textOnly) return "";
        return textOnly.charAt(0).toUpperCase() + textOnly.slice(1).toLowerCase();
      })
      .filter(Boolean);
    return parts.join(" ") || "Student";
  } catch {
    return "Student";
  }
}

function updateUsersDatabase(email, name, password) {
  const db = readJson("users_database", []);
  const nowStr = formatNow();
  const existingUser = db.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    existingUser.lastLogin = nowStr;
    existingUser.name = name;
    existingUser.isOnline = true;
    if (password && !existingUser.password) existingUser.password = password;
  } else {
    db.push({ email, name, password, createdDate: nowStr, lastLogin: nowStr, isOnline: true });
  }
  writeJson("users_database", db);
}

function setUserOnline(email) {
  const db = readJson("users_database", []);
  const user = db.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user && !user.isOnline) {
    user.isOnline = true;
    writeJson("users_database", db);
  }
}

function setUserOffline(email) {
  const db = readJson("users_database", []);
  const user = db.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.isOnline = false;
    writeJson("users_database", db);
  }
}

export function restoreUnlocks() {
  const loggedIn = isLoggedIn();
  const email = getUserEmail();
  if (loggedIn && email) setUserOnline(email);

  const roadmapPairs = [
    ["roadmap-sprint-card", "dsa-sprint-unlocked-content"],
    ["roadmap-mastery-card", "dsa-mastery-unlocked-content"],
    ["roadmap-webdev-card", "webdev-unlocked-content"],
    ["aiml-certs-card", "aiml-certs-unlocked-content"],
    ["hackathon-guide-card", "hackathon-unlocked-content"]
  ];

  roadmapPairs.forEach(([cardId, contentId]) => {
    const card = document.getElementById(cardId);
    const unlockedContent = document.getElementById(contentId);
    if (!card || !unlockedContent) return;
    const btn = card.querySelector(".unlock-btn");
    btn?.classList.toggle("is-hidden", loggedIn);
    unlockedContent.classList.toggle("is-hidden", !loggedIn);
  });

  ["premium-projects-container", "company-links-container"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("is-unlocked", loggedIn);
    el.querySelector(".unlock-btn")?.classList.toggle("is-hidden", loggedIn);
  });

  const headerAuthBtn = document.getElementById("header-auth-btn");
  let adminLink = document.getElementById("header-admin-link");
  if (isAdmin()) {
    if (!adminLink && headerAuthBtn) {
      adminLink = document.createElement("a");
      adminLink.id = "header-admin-link";
      adminLink.href = "/admin.html";
      adminLink.className = "nav-link";
      adminLink.textContent = "Admin";
      headerAuthBtn.parentNode.insertBefore(adminLink, headerAuthBtn);
    }
  } else {
    adminLink?.remove();
  }

  if (headerAuthBtn) {
    headerAuthBtn.textContent = loggedIn ? "Sign out" : "Sign in";
    headerAuthBtn.classList.toggle("btn-danger", loggedIn);
  }

  const greeting = document.getElementById("user-greeting");
  if (greeting) {
    greeting.textContent = loggedIn ? `Signed in as ${email}` : "Sign in to unlock plans, checklists, and directories.";
  }

  updateResumeTriesUI();
  refreshAllProgress();
}
