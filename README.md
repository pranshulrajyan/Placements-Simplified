# 🎓 Placements Simplified

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)

**Placements Simplified** is a curated, high-yield technology placement preparation accelerator. It replaces cluttered study guides with structured roadmaps, interactive checklist tracking, automated tools, and verified project blueprints to help students land their dream tech offers.

---

## ✨ Features

### 🗺️ Curated Preparation Roadmaps
* **DSA & Algorithms**:
  * *2-Month Sprint*: Designed for high-speed OA (Online Assessment) clearance.
  * *6-8 Month Mastery*: Deep-dive path covering full-stack concepts, complex data structures, and system design (HLD/LLD).
* **Web Development**: Complete 2-month MERN-stack curriculum.
* **AI Certifications & Hackathons**: Specialized resource directories and structured strategy roadmaps.

### 📝 Mock Resume Reviewer (ATS Checker)
* Analyzes candidate resumes against target job description keywords.
* Calculates compatibility score and provides actionable, level-based feedback (STAR format formatting, missing high-impact projects, metric quantification).
* Includes a built-in rate-limiter simulation (unlocked with sign-in).

### 🔬 Project Lab & Company Q-Bank
* **Searchable Projects Lab**: Direct access to 50 curated final-year portfolio projects, with titles and video tutorials.
* **Company-Specific Q-Bank**: Frequently asked interview questions from top tech giants (Google, Microsoft, Amazon).
* **Fast I/O & Core CS Guides**: C++ Fast I/O boilerplates, Python templates, and schoolroom-style breakdowns of operating systems (OS) and database management systems (DBMS).

### 🔒 Interactive Auth Gate & Admin Console
* Simulated Google OAuth system that unlocks all courses, checklists, and projects on sign-in.
* Real-time sync of user metrics stored via `localStorage`.
* Dedicated administrative panel (`/admin.html`) to review real-time registrations, live active count, search/filter user profiles, and reset the local database.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Build Tool**: [Vite.js](https://vite.dev/) (lightning-fast development and optimized production asset bundles)
* **Styling**: Modern, fluid vanilla CSS containing glassmorphism, responsive grid layouts, and custom interactive themes.
* **Authentication**: Simulated Google Identity Services (OAuth JWT decode helper).
* **Analytics**: Integrated [Vercel Web Analytics](https://vercel.com/analytics) script to monitor real-time visitor insights.
* **State Management**: Persisted checklist items, resume reviewer attempts, and local registrations utilizing synchronized `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* npm (comes with Node.js)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ypranshulrajyan/placements-simplified.git
    ```
   
1. Install the project dependencies:
    ```bash
    npm install
    ```
2. Start the local development server:
    ```bash
    npm run dev
    ```
3. Access the web app locally at http://localhost:5173
   