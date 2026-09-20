export const ADMIN_EMAIL = "rajyanpranshul@gmail.com";

export function isLoggedIn() {
  return localStorage.getItem("user_logged_in") === "true";
}

export function getUserEmail() {
  return localStorage.getItem("user_email") || "";
}

export function getUserName() {
  return localStorage.getItem("user_name") || "";
}

export function isAdmin() {
  return isLoggedIn() && getUserEmail().toLowerCase() === ADMIN_EMAIL;
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
