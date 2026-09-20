import "./style.css";
import { restoreUnlocks, initAuth } from "./js/auth.js";
import { initHeaderScroll, initTabs, initInnerTabs, initMobileNav, initSiteSearch } from "./js/ui.js";
import { initRoadmapChecklists, refreshAllProgress } from "./js/checklists.js";
import { initResumeReviewer } from "./js/resume.js";
import { initProjectsList } from "./js/projects.js";
import { initTracker } from "./js/tracker.js";
import { getTodaysDrill } from "./data/drills.js";

document.addEventListener("DOMContentLoaded", () => {
  restoreUnlocks();
  initHeaderScroll();
  initTabs();
  initInnerTabs();
  initMobileNav();
  initSiteSearch();
  initRoadmapChecklists();
  refreshAllProgress();
  initResumeReviewer();
  initAuth();
  initProjectsList();
  initTracker();
  renderDailyDrill();
});

function renderDailyDrill() {
  const drill = getTodaysDrill();
  const topic = document.getElementById("drill-topic");
  const prompt = document.getElementById("drill-prompt");
  if (topic) topic.textContent = drill.topic;
  if (prompt) prompt.textContent = drill.prompt;
}
