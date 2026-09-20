export function initRoadmapChecklists() {
  document.addEventListener("change", (e) => {
    const cb = e.target.closest(".roadmap-checkbox");
    if (!cb) return;
    const roadmapId = cb.getAttribute("data-roadmap");
    const checkboxes = document.querySelectorAll(`.roadmap-checkbox[data-roadmap="${roadmapId}"]`);
    checkboxes.forEach((box, index) => {
      if (box === cb) {
        localStorage.setItem(`check_${roadmapId}_${index}`, cb.checked ? "true" : "false");
      }
    });
    calculateRoadmapProgress(roadmapId);
  });
}

export function calculateRoadmapProgress(roadmapId) {
  const checkboxes = document.querySelectorAll(`.roadmap-checkbox[data-roadmap="${roadmapId}"]`);
  if (!checkboxes.length) return { percent: 0, checked: 0, total: 0 };

  let checkedCount = 0;
  checkboxes.forEach((cb, index) => {
    if (localStorage.getItem(`check_${roadmapId}_${index}`) === "true") {
      cb.checked = true;
    }
    if (cb.checked) checkedCount += 1;
  });

  const percent = Math.round((checkedCount / checkboxes.length) * 100);
  const pctLabel = document.getElementById(`${roadmapId}-progress-pct`);
  const fillBar = document.getElementById(`${roadmapId}-progress-fill`);
  if (pctLabel) pctLabel.textContent = `${percent}%`;
  if (fillBar) fillBar.style.width = `${percent}%`;
  return { percent, checked: checkedCount, total: checkboxes.length };
}

export function refreshAllProgress() {
  const ids = ["dsa-sprint", "dsa-mastery", "roadmap-webdev"];
  const stats = ids.map((id) => ({ id, ...calculateRoadmapProgress(id) }));
  const totals = stats.reduce(
    (acc, s) => {
      acc.checked += s.checked;
      acc.total += s.total;
      return acc;
    },
    { checked: 0, total: 0 }
  );
  const overall = totals.total ? Math.round((totals.checked / totals.total) * 100) : 0;

  const overallLabel = document.getElementById("overall-progress-label");
  const overallFill = document.getElementById("overall-progress-fill");
  const overallMeta = document.getElementById("overall-progress-meta");
  if (overallLabel) overallLabel.textContent = `${overall}%`;
  if (overallFill) overallFill.style.width = `${overall}%`;
  if (overallMeta) overallMeta.textContent = `${totals.checked} of ${totals.total} checklist items complete`;

  const map = {
    "dsa-sprint": "stat-sprint",
    "dsa-mastery": "stat-mastery",
    "roadmap-webdev": "stat-webdev"
  };
  stats.forEach((s) => {
    const el = document.getElementById(map[s.id]);
    if (el) el.textContent = `${s.percent}%`;
  });
}
