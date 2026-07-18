import posthog from 'posthog-js/dist/module.full.no-external'
import './style.css';

posthog.init('phc_zHQqzJta9daxdCjXxVC3B5w3xvRCsChUfTz7jVyQ2E8k', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
  capture_pageview: true
});
window.posthog = posthog;

posthog.capture('$pageview');

// -------------------------------------------------------------
// Google Sign-In (OAuth) Credentials Configuration
// -------------------------------------------------------------
// Paste your Google Client ID here to activate live Google Sign-In:
export const GOOGLE_CLIENT_ID = ""; // e.g. "123456789-abcdef.apps.googleusercontent.com"

// Decodes the standard base64 encoded JWT returned by Google Sign-In
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    posthog.captureException(e, { flow: 'google_jwt_decode' });
    return null;
  }
}

// -------------------------------------------------------------
// 1. Initial State & Unlocked Restorations
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  restoreUnlocks();
  initHeaderScroll();
  initTabs();
  initInnerTabs();
  initRoadmapChecklists();
  initResumeReviewer();
  initAuth();
  initProjectsList();
});

// Restore unlocked states from localStorage depending on user login state
function restoreUnlocks() {
  const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
  const email = localStorage.getItem('user_email') || '';
  if (isLoggedIn && email) {
    setUserOnline(email);
    posthog.identify(email, { email, name: localStorage.getItem('user_name') || undefined });
  }

  // Toggle roadmaps content display
  const roadmapIds = ['sprint', 'mastery', 'webdev'];
  roadmapIds.forEach(id => {
    const card = document.getElementById(`roadmap-${id === 'webdev' ? 'webdev' : id}-card`);
    const unlockedContent = document.getElementById(`${id === 'webdev' ? 'webdev' : 'dsa-' + id}-unlocked-content`);
    if (card && unlockedContent) {
      const btn = card.querySelector('.unlock-btn');
      if (isLoggedIn) {
        if (btn) btn.classList.add('hidden');
        unlockedContent.classList.remove('hidden');
      } else {
        if (btn) btn.classList.remove('hidden');
        unlockedContent.classList.add('hidden');
      }
    }
  });

  // Toggle Courses Directory
  const aimlCard = document.getElementById('aiml-certs-card');
  const aimlContent = document.getElementById('aiml-certs-unlocked-content');
  if (aimlCard && aimlContent) {
    const btn = aimlCard.querySelector('.unlock-btn');
    if (isLoggedIn) {
      if (btn) btn.classList.add('hidden');
      aimlContent.classList.remove('hidden');
    } else {
      if (btn) btn.classList.remove('hidden');
      aimlContent.classList.add('hidden');
    }
  }

  // Toggle Hackathon Guide
  const hackathonCard = document.getElementById('hackathon-guide-card');
  const hackathonContent = document.getElementById('hackathon-unlocked-content');
  if (hackathonCard && hackathonContent) {
    const btn = hackathonCard.querySelector('.unlock-btn');
    if (isLoggedIn) {
      if (btn) btn.classList.add('hidden');
      hackathonContent.classList.remove('hidden');
    } else {
      if (btn) btn.classList.remove('hidden');
      hackathonContent.classList.add('hidden');
    }
  }

  // Toggle Premium Projects & Company Links containers
  const projContainer = document.getElementById('premium-projects-container');
  const projBtn = projContainer ? projContainer.querySelector('.unlock-btn') : null;
  const companyContainer = document.getElementById('company-links-container');
  const companyBtn = companyContainer ? companyContainer.querySelector('.unlock-btn') : null;

  if (projContainer) {
    if (isLoggedIn) {
      projContainer.classList.add('unlocked');
      if (projBtn) projBtn.classList.add('hidden');
    } else {
      projContainer.classList.remove('unlocked');
      if (projBtn) projBtn.classList.remove('hidden');
    }
  }

  if (companyContainer) {
    if (isLoggedIn) {
      companyContainer.classList.add('unlocked');
      if (companyBtn) companyBtn.classList.add('hidden');
    } else {
      companyContainer.classList.remove('unlocked');
      if (companyBtn) companyBtn.classList.remove('hidden');
    }
  }

  // Update Header Auth Button & Admin Link
  const headerAuthBtn = document.getElementById('header-auth-btn');
  const mainNav = document.querySelector('.main-nav');
  const userEmail = localStorage.getItem('user_email') || '';
  const isAdmin = isLoggedIn && userEmail.toLowerCase() === 'rajyanpranshul@gmail.com';

  // Toggle Admin Link
  let adminLink = document.getElementById('header-admin-link');
  if (isAdmin) {
    if (!adminLink && headerAuthBtn) {
      adminLink = document.createElement('a');
      adminLink.id = 'header-admin-link';
      adminLink.href = '/admin.html';
      adminLink.className = 'nav-link';
      adminLink.style.color = 'var(--color-teal)';
      adminLink.style.fontWeight = '600';
      adminLink.textContent = 'Admin ⚙️';
      adminLink.style.marginInlineEnd = '0.5rem';
      adminLink.style.display = 'inline-flex';
      adminLink.style.alignItems = 'center';
      headerAuthBtn.parentNode.insertBefore(adminLink, headerAuthBtn);
    }
  } else {
    if (adminLink) {
      adminLink.remove();
    }
  }

  if (headerAuthBtn) {
    if (isLoggedIn) {
      headerAuthBtn.textContent = "Sign Out";
      headerAuthBtn.style.background = "#ef4444"; // Red for signout
      headerAuthBtn.style.borderColor = "#ef4444";
    } else {
      headerAuthBtn.textContent = "Sign In";
      headerAuthBtn.style.background = "transparent";
      headerAuthBtn.style.borderColor = "var(--border-color)";
    }
  }

  // Resume Reviewer Tries update
  updateResumeTriesUI();

  // Calculate active checklists progress
  calculateRoadmapProgress('dsa-sprint');
  calculateRoadmapProgress('dsa-mastery');
  calculateRoadmapProgress('roadmap-webdev');
}

// -------------------------------------------------------------
// 3. Sticky Header Scroll Effect
// -------------------------------------------------------------
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// -------------------------------------------------------------
// 4. Domain Tab Switcher
// -------------------------------------------------------------
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      posthog.capture('roadmap_tab_selected', {
        domain: targetTab.replace('-content', '')
      });
      const panel = document.getElementById(targetTab);
      if (panel) panel.classList.add('active');
    });
  });
}

// -------------------------------------------------------------
// 5. Unlocked Roadmap Inner Tabs
// -------------------------------------------------------------
function initInnerTabs() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.inner-tab-btn');
    if (!btn) return;

    const parentContent = btn.closest('.unlocked-roadmap-content');
    const targetPanelId = btn.getAttribute('data-inner-tab');

    parentContent.querySelectorAll('.inner-tab-btn').forEach(b => b.classList.remove('active'));
    parentContent.querySelectorAll('.inner-tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetPanel = parentContent.querySelector(`#${targetPanelId}`);
    if (targetPanel) targetPanel.classList.add('active');
  });
}

// -------------------------------------------------------------
// 6. Roadmap Checklists Progress
// -------------------------------------------------------------
function initRoadmapChecklists() {
  document.addEventListener('change', (e) => {
    const cb = e.target.closest('.roadmap-checkbox');
    if (!cb) return;

    const roadmapId = cb.getAttribute('data-roadmap');
    const checkboxes = document.querySelectorAll(`.roadmap-checkbox[data-roadmap="${roadmapId}"]`);

    checkboxes.forEach((box, index) => {
      if (box === cb) {
        localStorage.setItem(`check_${roadmapId}_${index}`, cb.checked ? 'true' : 'false');
      }
    });

    calculateRoadmapProgress(roadmapId);
    posthog.capture('roadmap_checklist_item_toggled', {
      roadmap: roadmapId,
      completed: cb.checked
    });
  });
}

function calculateRoadmapProgress(roadmapId) {
  const checkboxes = document.querySelectorAll(`.roadmap-checkbox[data-roadmap="${roadmapId}"]`);
  if (checkboxes.length === 0) return;

  let checkedCount = 0;
  checkboxes.forEach((cb, index) => {
    const saved = localStorage.getItem(`check_${roadmapId}_${index}`);
    if (saved === 'true') {
      cb.checked = true;
    }
    if (cb.checked) {
      checkedCount++;
    }
  });

  const percent = Math.round((checkedCount / checkboxes.length) * 100);

  const pctLabel = document.getElementById(`${roadmapId}-progress-pct`);
  const fillBar = document.getElementById(`${roadmapId}-progress-fill`);

  if (pctLabel) pctLabel.textContent = `${percent}%`;
  if (fillBar) fillBar.style.width = `${percent}%`;
}

// -------------------------------------------------------------
// 7. Resume Reviewer Simulation
// -------------------------------------------------------------
function initResumeReviewer() {
  if (localStorage.getItem('resume_tries') === null) {
    localStorage.setItem('resume_tries', '1');
  }

  const analyzeBtn = document.getElementById('analyze-resume-btn');
  const skillsInput = document.getElementById('skills-input');
  const resumeInput = document.getElementById('resume-input');
  const resultBox = document.getElementById('resume-analysis-result');

  const savedAnalysis = localStorage.getItem('resume_analysis_saved');
  if (savedAnalysis) {
    const data = JSON.parse(savedAnalysis);
    showAnalysisResult(data.score, data.tips);
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
      let tries = parseInt(localStorage.getItem('resume_tries')) || 0;

      if (!isLoggedIn && tries <= 0) {
        openAuthModal();
        return;
      }

      if (!skillsInput.value.trim() || !resumeInput.value.trim()) {
        alert('Please provide target job skills and paste your resume content before analysis.');
        return;
      }

      analyzeBtn.disabled = true;
      const originalText = analyzeBtn.innerHTML;
      analyzeBtn.innerHTML = `Analyzing Resume... <span class="btn-spinner"></span>`;
      resultBox.classList.add('hidden');

      setTimeout(() => {
        if (!isLoggedIn) {
          tries = Math.max(0, tries - 1);
          localStorage.setItem('resume_tries', tries.toString());
        }

        const skillsText = skillsInput.value.toLowerCase();
        const resumeText = resumeInput.value.toLowerCase();
        const skillsArr = skillsText.split(',').map(s => s.trim());
        let matches = 0;
        skillsArr.forEach(skill => {
          if (resumeText.includes(skill) && skill.length > 0) {
            matches++;
          }
        });

        const matchPercentage = skillsArr.length > 0 ? (matches / skillsArr.length) * 100 : 0;
        const score = Math.max(45, Math.min(95, Math.round(50 + matchPercentage * 0.45)));

        let tips = [];
        if (score < 65) {
          tips = [
            `Critically missing primary keywords: "${skillsArr.slice(0, 3).join(', ')}"`,
            "No metrics/impact values found in description blocks.",
            "Formatting contains weak verbs. Revise to strong action verbs (e.g. Led, Designed, Built)."
          ];
        } else if (score < 85) {
          tips = [
            `Partially matched target skills, but missing detailed context for: "${skillsArr.slice(1, 3).join(', ')}"`,
            "Add quantifiable placement metrics (e.g., 'reduced runtime complexity by 40%').",
            "Consider adding an advanced ML/RAG or highly interactive WebSockets project to stand out."
          ];
        } else {
          tips = [
            "Strong keyword alignment across target fields.",
            "Enhance resume hierarchy by moving high-yield projects above education history.",
            "Prepare STAR-method behavioral templates highlighting these specific matched skills."
          ];
        }

        const analysisData = { score, tips };
        localStorage.setItem('resume_analysis_saved', JSON.stringify(analysisData));

        showAnalysisResult(score, tips);
        updateResumeTriesUI();
        posthog.capture('resume_review_completed', {
          score_range: score < 65 ? 'below_65' : score < 85 ? '65_to_84' : '85_and_above',
          matched_skill_count: matches,
          requested_skill_count: skillsArr.length,
          was_logged_in: isLoggedIn
        });

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = originalText;
      }, 1500);
    });
  }
}

function showAnalysisResult(score, tips) {
  const resultBox = document.getElementById('resume-analysis-result');
  const scoreText = document.getElementById('analysis-score');
  const tipsList = resultBox.querySelector('.analysis-tips');

  if (scoreText) scoreText.textContent = `${score}%`;

  if (tipsList) {
    tipsList.innerHTML = '';
    tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      tipsList.appendChild(li);
    });
  }

  if (resultBox) resultBox.classList.remove('hidden');
}

// Toggle resume tries UI based on user login
function updateResumeTriesUI() {
  const triesSpan = document.getElementById('resume-tries');
  const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
  const tries = parseInt(localStorage.getItem('resume_tries')) || 0;

  if (triesSpan) {
    if (isLoggedIn) {
      triesSpan.textContent = 'Unlimited Attempts';
    } else {
      triesSpan.textContent = `${tries} Try Free`;
    }
  }
}

// -------------------------------------------------------------
// 8. Authentication (Google Sign-In Modal Gate)
// -------------------------------------------------------------
let isSignUpMode = false;

function initAuth() {
  const modal = document.getElementById('auth-dialog');
  const closeBtn = document.getElementById('close-auth-btn');
  const authForm = document.getElementById('auth-form');
  const toggleLink = document.getElementById('auth-toggle-link');
  const modalTitle = document.getElementById('auth-modal-title');
  const submitBtnText = document.querySelector('#auth-submit-btn .auth-btn-text');
  const headerAuthBtn = document.getElementById('header-auth-btn');
  const errorMsg = document.getElementById('auth-error-msg');

  // Trigger login popup on clicking any card "Access" buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.unlock-btn');
    if (!btn) return;

    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    if (!isLoggedIn) {
      openAuthModal();
    }
  });

  // Header auth button trigger
  if (headerAuthBtn) {
    headerAuthBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
      if (isLoggedIn) {
        // Sign Out - mark as offline in DB
        const email = localStorage.getItem('user_email') || '';
        if (email) {
          setUserOffline(email);
        }
        localStorage.setItem('user_logged_in', 'false');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        posthog.reset();
        restoreUnlocks();
        alert("Logged out successfully.");
      } else {
        openAuthModal();
      }
    });
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());

  // Toggle between sign in and sign up
  if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      isSignUpMode = !isSignUpMode;
      if (isSignUpMode) {
        modalTitle.textContent = "Create Account";
        submitBtnText.textContent = "Sign Up";
        toggleLink.textContent = "Sign in to existing account";
      } else {
        modalTitle.textContent = "Sign In";
        submitBtnText.textContent = "Sign In";
        toggleLink.textContent = "Create account instead";
      }
    });
  }

  // Submit handler (Google Sign-In Form validation)
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('auth-email');
      const passwordInput = document.getElementById('auth-password');
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const passwordVal = passwordInput ? passwordInput.value : '';

      // Reset errors
      if (errorMsg) {
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
      }

      // 1. Google Gmail Domain Check
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(emailVal.toLowerCase())) {
        if (errorMsg) {
          errorMsg.textContent = 'Access is restricted. You must enter a valid Google Gmail address (ending in @gmail.com).';
          errorMsg.classList.remove('hidden');
        }
        return;
      }

      // 2. Google Password Strength Check
      if (passwordVal.length < 6) {
        if (errorMsg) {
          errorMsg.textContent = 'Google Account security requires a password of at least 6 characters.';
          errorMsg.classList.remove('hidden');
        }
        return;
      }

      const spinner = document.querySelector('#auth-submit-btn .auth-btn-spinner');
      const text = document.querySelector('#auth-submit-btn .auth-btn-text');
      const submitBtn = document.getElementById('auth-submit-btn');

      submitBtn.disabled = true;
      if (spinner) spinner.classList.remove('hidden');
      if (text) text.classList.add('hidden');

      setTimeout(() => {
        // Extract capitalized full name from email prefix (e.g. arjun.singh@gmail.com -> Arjun Singh)
        const name = getNameFromEmail(emailVal);

        // Retrieve and update users database
        let db = [];
        try {
          db = JSON.parse(localStorage.getItem('users_database')) || [];
        } catch (e) {
          db = [];
        }

        // Seed with default users if empty (only real admin account)
        if (db.length === 0) {
          db = [
            {
              name: "Pranshul Rajyan",
              email: "rajyanpranshul@gmail.com",
              createdDate: "2026-07-10 10:15:30",
              lastLogin: new Date().toISOString().slice(0, 19).replace('T', ' '),
              isOnline: false
            }
          ];
          localStorage.setItem('users_database', JSON.stringify(db));
        }

        const existingUser = db.find(u => u.email.toLowerCase() === emailVal.toLowerCase());

        if (isSignUpMode) {
          if (existingUser) {
            if (spinner) spinner.classList.add('hidden');
            if (text) text.classList.remove('hidden');
            submitBtn.disabled = false;
            if (errorMsg) {
              errorMsg.textContent = 'An account with this Gmail address already exists. Please sign in instead.';
              errorMsg.classList.remove('hidden');
            }
            return;
          }
          // Register new user
          updateUsersDatabase(emailVal.toLowerCase(), name, passwordVal);
        } else {
          if (!existingUser) {
            if (spinner) spinner.classList.add('hidden');
            if (text) text.classList.remove('hidden');
            submitBtn.disabled = false;
            if (errorMsg) {
              errorMsg.textContent = 'No account found with this Gmail address. Click "Create account instead" to sign up first.';
              errorMsg.classList.remove('hidden');
            }
            return;
          }

          // Verify password
          if (existingUser.password && existingUser.password !== passwordVal) {
            if (spinner) spinner.classList.add('hidden');
            if (text) text.classList.remove('hidden');
            submitBtn.disabled = false;
            if (errorMsg) {
              errorMsg.textContent = 'Incorrect password. Please try again.';
              errorMsg.classList.remove('hidden');
            }
            return;
          }

          // Migrate password if the record was previously empty
          if (!existingUser.password) {
            existingUser.password = passwordVal;
          }

          existingUser.isOnline = true;
          existingUser.lastLogin = new Date().toISOString().slice(0, 19).replace('T', ' ');
          localStorage.setItem('users_database', JSON.stringify(db));
        }

        localStorage.setItem('user_logged_in', 'true');
        localStorage.setItem('user_email', emailVal.toLowerCase());
        localStorage.setItem('user_name', name);
        posthog.identify(emailVal.toLowerCase(), { email: emailVal.toLowerCase(), name });
        posthog.capture('auth_completed', { mode: isSignUpMode ? 'sign_up' : 'sign_in' });

        if (spinner) spinner.classList.add('hidden');
        if (text) text.classList.remove('hidden');
        submitBtn.disabled = false;
        modal.close();

        // Unlock everything instantly
        restoreUnlocks();
        startConfetti();
      }, 1200);
    });
  }
}

// Extracts a formatted, capitalized name from an email address prefix
function getNameFromEmail(email) {
  try {
    const prefix = email.split('@')[0];
    const parts = prefix.split(/[._-]/);
    const capitalizedParts = parts.map(part => {
      // Strip numbers
      const textOnly = part.replace(/[0-9]/g, '');
      if (textOnly.length === 0) return '';
      return textOnly.charAt(0).toUpperCase() + textOnly.slice(1).toLowerCase();
    }).filter(p => p.length > 0);

    if (capitalizedParts.length === 0) return 'Google User';
    return capitalizedParts.join(' ');
  } catch (e) {
    return 'Google User';
  }
}

function updateUsersDatabase(email, name, password) {
  let db = [];
  try {
    db = JSON.parse(localStorage.getItem('users_database')) || [];
  } catch (e) {
    db = [];
  }

  const now = new Date();
  const formatTime = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
  const nowStr = formatTime(now);

  const existingUser = db.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    existingUser.lastLogin = nowStr;
    existingUser.name = name;
    existingUser.isOnline = true;
    if (password && !existingUser.password) {
      existingUser.password = password;
    }
  } else {
    db.push({
      email: email,
      name: name,
      password: password,
      createdDate: nowStr,
      lastLogin: nowStr,
      isOnline: true
    });
  }
  localStorage.setItem('users_database', JSON.stringify(db));
}

function setUserOnline(email) {
  let db = [];
  try {
    db = JSON.parse(localStorage.getItem('users_database')) || [];
  } catch (e) {
    db = [];
  }
  const user = db.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    if (!user.isOnline) {
      user.isOnline = true;
      localStorage.setItem('users_database', JSON.stringify(db));
    }
  }
}

function setUserOffline(email) {
  let db = [];
  try {
    db = JSON.parse(localStorage.getItem('users_database')) || [];
  } catch (e) {
    db = [];
  }
  const user = db.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.isOnline = false;
    localStorage.setItem('users_database', JSON.stringify(db));
  }
}

function openAuthModal() {
  const modal = document.getElementById('auth-dialog');
  if (modal) {
    modal.showModal();
  }
}




// -------------------------------------------------------------
// 9. Searchable 50 Final Year Projects List
// -------------------------------------------------------------
const finalYearProjects = [
  { id: 1, title: "Malware Detection Using Deep Learning", link: "https://youtu.be/f-JRYJWVKKE?si=GuebwSt9chYyjZzT" },
  { id: 2, title: "Stock Price Prediction Using Machine Learning", link: "https://youtu.be/nh4BOMuaF_I?si=gT0s5Vl2UyOAuze4" },
  { id: 3, title: "Automatic Face Attendance System Project", link: "https://youtu.be/tLhFaAurhGw?si=gdsdp8JjlgsAFeos" },
  { id: 4, title: "Crime Prediction Using Machine Learning", link: "https://youtu.be/4rAoiBh2MH0?si=g6aMlqXYhVDuoKJe" },
  { id: 5, title: "AI Chatbot Project NLTK Project", link: "https://youtu.be/tLormT06XS0?si=Y_eH9tRhpcRwJmBz" },
  { id: 6, title: "Fake News Detection Using Machine Learning And Deep Learning", link: "https://youtu.be/DQRZHOpU9bU?si=561xPypbVjJyHHIK" },
  { id: 7, title: "Rainfall Prediction system Using Machine Learning", link: "https://youtu.be/RrMOFPkBg5k?si=q-GyKPZq1DMORZZf" },
  { id: 8, title: "Credit Card Fraud Detection System", link: "https://youtu.be/CiEnP4xE0dY?si=hNJ1Y4dUV_FfEuxG" },
  { id: 9, title: "Disease Prediction on jupyter notebook", link: "https://youtu.be/czIgZRyhZks?si=NKVaOUVCQN9MEuaG" },
  { id: 10, title: "Email Spam detection Project Using Machine Learning", link: "https://youtu.be/KmmZ3uxHTb4?si=ByA4na2VtsAqho85" },
  { id: 11, title: "Plant Disease Detection project", link: "https://youtu.be/VPW8OGHTUrk?si=HXHi9baaT6FQmAmo" },
  { id: 12, title: "Brain Tumor Detection Using Machine Learning", link: "https://youtu.be/-uzwKfRt6DU?si=Y8rTmLEqtET3X_Y_" },
  { id: 13, title: "Heart Disease Prediction Using Machine Learning", link: "https://youtu.be/b0z32XjpMJ4?si=NOT1Swl-xEeFu4QI" },
  { id: 14, title: "Network Intrusion detection Using Machine Learning", link: "https://youtu.be/fUMWwDYPjOk?si=-Iik7eEaKI6M-AmA" },
  { id: 15, title: "Face Mask Detection Project", link: "https://youtu.be/7hLboIeBeTk?si=7Jbtdo1AEvMPm-RP" },
  { id: 16, title: "Lung Cancer Detection Using Machine Learning", link: "https://youtu.be/FAwpwldzOq8?si=msno4XDeNcDikp-1" },
  { id: 17, title: "Movies Recommendation System", link: "https://youtu.be/3_0gWNzBiGQ?si=Ey37uVhTXWQlob-n" },
  { id: 18, title: "Bank Record Storage System Using Blockchain Project", link: "https://youtu.be/ZH3ySXHGrPE?si=ASf0r2X_k3STxxE1" },
  { id: 19, title: "Data Duplication Removal Using Machine Learning", link: "https://youtu.be/_b_7sjDpuC0?si=bhzLt2HZG8rColc-" },
  { id: 20, title: "Co2 Emmision Prediction Using Machine Learning", link: "https://youtu.be/G05B-uG6PcY?si=fDRaF1MehLi-N4Xm" },
  { id: 21, title: "Diabetes Prediction System Using machine learning", link: "https://youtu.be/39PUAvOknxw?si=TjqKioAZMkmgj-We" },
  { id: 22, title: "Big Mart Sale Prediction System Using machine learning", link: "https://youtu.be/HgQssKEiWzc?si=Qtki40BtqnlUntv1" },
  { id: 23, title: "Real Estate Price Prediction", link: "https://youtu.be/bsCIo_bg4UY?si=8uyJpZoajWuEL4Pm" },
  { id: 24, title: "Road Pavement detection system", link: "https://youtu.be/BEUFt6_UjYM?si=_Tl5XsNny2RWlqDS" },
  { id: 25, title: "Health Record Using Blockchain", link: "https://youtu.be/akHpUgWmcE8?si=owLnILV8glVX-SqB" },
  { id: 26, title: "Land Registry Using Blockchain", link: "https://youtu.be/0x-fnZXXrD0?si=LWjUy3SyISHygOA8" },
  { id: 27, title: "Forest Fire Using Machine learning", link: "https://youtu.be/paJ9eQp52TA?si=JKE9Udefj3GPj9cc" },
  { id: 28, title: "Breast Cancer Using Machine Learning", link: "https://youtu.be/TzkyqZhNCEo?si=G3Vd9kDRyZNe8EBI" },
  { id: 29, title: "Cricket Scrore Prediction Using Machine Learning", link: "https://youtu.be/6hUSAyxymRA?si=BsskAm-kRQsalIgq" },
  { id: 30, title: "Blockchain Evidence Management system", link: "https://youtu.be/h2naWQ2lFa0?si=5UI9sWkxkp9LdpJG" },
  { id: 31, title: "Full Stack Blockchain Voting System Project", link: "https://youtu.be/ohc-LvRjfVg?si=kA8ywmT_qGLgIz11" },
  { id: 32, title: "Fake Product Identification by QR Code Using Blockchain", link: "https://youtu.be/8nVStd41gxE?si=5VKAWbxy91Hqp4r7" },
  { id: 33, title: "Blockchain Communication System", link: "https://youtu.be/Kt8NHdWnvdk?si=6_0F8z_lcSqoEUT3" },
  { id: 34, title: "Electronic Health Record Using Blockchain", link: "https://youtu.be/akHpUgWmcE8?si=23YZ6GgvuDHHvlEw" },
  { id: 35, title: "Land Registry Using Blockchain technology", link: "https://youtu.be/0x-fnZXXrD0?si=2EXgO3CZtwv5T3" },
  { id: 36, title: "Blockchain Blood Bank Management System Project", link: "https://youtu.be/jVJFHrRVMeE?si=9alGZEaYAlOKkmO7" },
  { id: 37, title: "Bank Record Storage System Using Blockchain", link: "https://youtu.be/ZH3ySXHGrPE?si=3Cw8_86L34jAdvNy" },
  { id: 38, title: "Ethereum Explorer Project", link: "https://youtu.be/buJ4Sg7At1o?si=SPHNwx24nyGiJplg" },
  { id: 39, title: "Web3.js Blockchain Project", link: "https://youtu.be/kWK-T4go0qo?si=aJyiEotBwkwVymvu" },
  { id: 40, title: "Attendance System Using Blockchain Project", link: "https://youtu.be/wdtI2qsQptc?si=LzTyv-jDydS64Q0a" },
  { id: 41, title: "Etherium Explorer Project Blockchain Project", link: "https://youtu.be/buJ4Sg7At1o?si=40tzimbqUBz8PK6B" },
  { id: 42, title: "React Cryptocurrency Project", link: "https://youtu.be/HbRmkbOoG0A?si=ANoh7P_0l4j46TkR" },
  { id: 43, title: "Air Pollution AQI Website Project", link: "https://youtu.be/QGF0D7d53i4?si=VUc_BCqRg3BYXVHY" },
  { id: 44, title: "Fashion Ecommerce Website", link: "https://youtu.be/TRLH8fG-uyU?si=uTIwULIG4uMDSZaR" },
  { id: 45, title: "URL Phishing Detection System", link: "https://youtu.be/nDxP_lJmVk4?si=0ttLR4zsoJani-ay" },
  { id: 46, title: "Super Cipher Project", link: "https://youtu.be/mbGBaiqdKnw?si=pKSMqqXdeOdYDH-Q" },
  { id: 47, title: "Cryptography Communication System Project", link: "https://youtu.be/DcmO-Xe7GVk?si=kQpKfx0JYrZLCIUa" },
  { id: 48, title: "Steganography Project FULL STACK", link: "https://youtu.be/wVDSMBJMG0Q?si=bHHHdWONtsFTyLY6" },
  { id: 49, title: "Triple DES project", link: "https://youtu.be/Z8qna_22WTU?si=8e5hsoFYNdM_xUha" },
  { id: 50, title: "AES Communication Security Project", link: "https://youtu.be/KAmrEceJllM?si=YCyvT6C5WOvJp01m" }
];

function initProjectsList() {
  const container = document.getElementById('projects-scroll-list');
  const searchInput = document.getElementById('project-search-input');

  if (!container) return;

  renderProjects(finalYearProjects);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = finalYearProjects.filter(p => p.title.toLowerCase().includes(query));
      renderProjects(filtered);
      if (query) {
        posthog.capture('project_search_used', { result_count: filtered.length });
      }
    });
  }
}

function renderProjects(projectsArray) {
  const container = document.getElementById('projects-scroll-list');
  if (!container) return;

  if (projectsArray.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem;">No matching projects found.</p>`;
    return;
  }

  container.innerHTML = '';
  projectsArray.forEach(p => {
    const div = document.createElement('div');
    div.className = 'project-list-row-item';
    div.innerHTML = `
      <div class="row-project-info">
        <span class="p-index">#${p.id}</span>
        <span class="p-title">${p.title}</span>
      </div>
      <div class="row-project-actions">
        <a href="${p.link}" target="_blank" class="row-btn-youtube">🎥 Video ↗</a>
      </div>
    `;
    container.appendChild(div);
  });
}

// -------------------------------------------------------------
// 10. Custom Premium Confetti Animation
// -------------------------------------------------------------
let confettiActive = false;

function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#a855f7', '#06b6d4', '#ec4899', '#3b82f6', '#10b981'];
  const confettiCount = 150;
  const particles = [];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }

  confettiActive = true;
  let duration = 4000;
  const startTime = Date.now();

  function draw() {
    if (!confettiActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;

      if (p.y <= canvas.height) {
        activeParticles++;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    if (Date.now() - startTime < duration && activeParticles > 0) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiActive = false;
    }
  }

  draw();
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
