import { isLoggedIn } from "./storage.js";
import { openAuthModal } from "./ui.js";

export function initResumeReviewer() {
  if (localStorage.getItem("resume_tries") === null) {
    localStorage.setItem("resume_tries", "1");
  }

  const analyzeBtn = document.getElementById("analyze-resume-btn");
  const skillsInput = document.getElementById("skills-input");
  const resumeInput = document.getElementById("resume-input");
  const resultBox = document.getElementById("resume-analysis-result");

  const savedAnalysis = localStorage.getItem("resume_analysis_saved");
  if (savedAnalysis) {
    const data = JSON.parse(savedAnalysis);
    showAnalysisResult(data.score, data.tips);
  }

  updateResumeTriesUI();

  analyzeBtn?.addEventListener("click", () => {
    let tries = parseInt(localStorage.getItem("resume_tries"), 10) || 0;
    if (!isLoggedIn() && tries <= 0) {
      openAuthModal();
      return;
    }
    if (!skillsInput.value.trim() || !resumeInput.value.trim()) {
      resultBox.classList.remove("is-hidden");
      showAnalysisResult(0, ["Add both target skills and resume text before running analysis."]);
      return;
    }

    analyzeBtn.disabled = true;
    const originalText = analyzeBtn.textContent;
    analyzeBtn.textContent = "Analysing…";
    resultBox.classList.add("is-hidden");

    setTimeout(() => {
      if (!isLoggedIn()) {
        tries = Math.max(0, tries - 1);
        localStorage.setItem("resume_tries", String(tries));
      }

      const skillsArr = skillsInput.value
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const resumeText = resumeInput.value.toLowerCase();
      const matches = skillsArr.filter((skill) => resumeText.includes(skill)).length;
      const matchPercentage = skillsArr.length ? (matches / skillsArr.length) * 100 : 0;
      const score = Math.max(45, Math.min(95, Math.round(50 + matchPercentage * 0.45)));

      let tips;
      if (score < 65) {
        tips = [
          `Missing or weak coverage of: ${skillsArr.slice(0, 3).join(", ") || "listed skills"}.`,
          "Add measurable outcomes (time saved, users served, error rate reduced).",
          "Lead bullets with action verbs: Built, Shipped, Reduced, Designed."
        ];
      } else if (score < 85) {
        tips = [
          `Partial keyword match. Expand context for: ${skillsArr.slice(1, 3).join(", ") || "secondary skills"}.`,
          "Put the strongest project above education.",
          "Prepare a STAR story for each matched skill."
        ];
      } else {
        tips = [
          "Keyword alignment is strong for the stated role.",
          "Tighten formatting so impact numbers sit at the start of bullets.",
          "Keep a one-page version for on-campus drives."
        ];
      }

      localStorage.setItem("resume_analysis_saved", JSON.stringify({ score, tips }));
      showAnalysisResult(score, tips);
      updateResumeTriesUI();
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = originalText;
    }, 900);
  });
}

function showAnalysisResult(score, tips) {
  const resultBox = document.getElementById("resume-analysis-result");
  const scoreText = document.getElementById("analysis-score");
  const tipsList = resultBox?.querySelector(".analysis-tips");
  if (scoreText) scoreText.textContent = score ? `${score}%` : "—";
  if (tipsList) {
    tipsList.innerHTML = tips.map((tip) => `<li>${tip}</li>`).join("");
  }
  resultBox?.classList.remove("is-hidden");
}

export function updateResumeTriesUI() {
  const triesSpan = document.getElementById("resume-tries");
  if (!triesSpan) return;
  const tries = parseInt(localStorage.getItem("resume_tries"), 10) || 0;
  triesSpan.textContent = isLoggedIn() ? "Unlimited after sign-in" : `${tries} free attempt remaining`;
}
