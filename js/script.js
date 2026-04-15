/* =========================
   THEME TOGGLE (Light / Dark)
========================= */
// theme button
const themeToggleBtn = document.getElementById("themeToggle");
// a function to change theme based on the theme name
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggleBtn.textContent = theme === "dark" ? "☀️ Theme" : "🌙 Theme";
}
// intiial the,e when the page is open 
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    themeToggleBtn.textContent = "🌙 Theme";
  }
})();
// function call when the button is pressed
themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
});


/* =========================
   SMOOTH SCROLLING
========================= */
// this is for jumping to a different section from the buttons in the naigation bar
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", () => setTimeout(() => a.blur(), 150));
});


/* =========================
   FORM INTERACTION 
========================= */
// get the elements in the form
const form = document.getElementById("contactMeForm");
const statusEl = document.getElementById("formStatus");
const nameInput = document.getElementById("nameInput");
const emailInput = form.querySelector('input[name="email"]');
const messageInput = form.querySelector('textarea[name="message"]');
// function to handle the submission from the user in the contact form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const messageText = (formData.get("message") || "").toString().trim();
  [nameInput, emailInput, messageInput].forEach(el => el.classList.remove("error"));

  statusEl.textContent = "Sending...";
  statusEl.style.opacity = "0.9";
  statusEl.style.color = "";
  statusEl.className = "form-status";
  setTimeout(() => {
    if (!name || !email || !messageText) {
      statusEl.textContent = "Please fill out all fields";
      statusEl.style.color = "#a62828";
      statusEl.className = "form-status";
      if (!name) {
        nameInput.classList.add("error");
        nameInput.focus();
      }
      if (!email) {
        emailInput.classList.add("error");
        emailInput.focus();
      }
      if (!messageText) {
        messageInput.classList.add("error");
        messageInput.focus();
      }
      return;
    }
    statusEl.textContent = `Thanks, ${name}! Your message was sent successfully.`;
    statusEl.className = "form-status";
    statusEl.style.color = "";
    form.reset();
  }, 600);
});
// remove error on input
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
  });
});


/* =========================
   POPUP GREETING 
========================= */
// loading the name saved in the local storage and showing the greeting if the name is found, 
// otherwise show the popup to ask for the name
window.onload = function () {
  const savedName = localStorage.getItem("username");
  document.body.classList.add("overlay-active");
  const input = document.getElementById("popup-name");
  const button = document.querySelector(".popup-box button");
  if (savedName) {
    input.style.display = "none";
    button.style.display = "none";
    showGreetingOnly(savedName);
  }
};
// show a greeting message based on the time of the day + the name of the user saved already in the local storage
function getGreeting(name) {
  const hour = new Date().getHours();
  let message = "";
  if (hour < 12) message = "Good morning";
  else if (hour < 18) message = "Good afternoon";
  else message = "Good evening";
  return `${message}, ${name} 👋`;
}
// fetch the username from the localStorage + show the greeting message + hide the popup box after 2.5 seconds
function handleName() {
  const input = document.getElementById("popup-name").value;
  const text = document.getElementById("popup-text");
  if (input === "") {
    text.textContent = "❌ Please enter your name";
    return;
  }
  localStorage.setItem("username", input);
  text.textContent = getGreeting(input);
  document.getElementById("popup-name").style.display = "none";
  document.querySelector(".popup-box button").style.display = "none";
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
    document.body.classList.remove("overlay-active"); 
}, 2500);
}
// this function is similar to the one above, but only used if the name is already saved in the local storage
function showGreetingOnly(name) {
  const text = document.getElementById("popup-text");
  text.textContent = getGreeting(name);
  document.getElementById("popup-name").style.display = "none";
  document.querySelector(".popup-box button").style.display = "none";
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
    document.body.classList.remove("overlay-active"); 
}, 2500);
}

/* =========================
   Fetch Data from Github API
========================= */
const githubReposGrid = document.getElementById("githubReposGrid");
const repoStatus = document.getElementById("repoStatus");
const repoComplexityFilter = document.getElementById("repoComplexityFilter");
const repoSort = document.getElementById("repoSort");

let githubReposData = [];

/*
  MANUAL COMPLEXITY MAP
  Write each repository name exactly as it appears on GitHub.
  Change beginner/advanced however you want.
*/
const repoComplexityMap = {
  "202223660-LeenAlmjnouni-assignment1": "beginner",
  "202223660-LeenAlmjnouni-assignment2": "beginner",
  "202223660-LeenAlmjnouni-assignment3": "advanced",
  "Navi-KFUPM": "advanced",
  "6-4-express-request-data": "advanced",
  "7-1-mongodb-LeenGhazi-1": "advanced",
  "6-2-npm-node-LeenGhazi": "beginner",
  "demo_1.1_hello_web": "beginner"
};

// categorize a repo as beginner by default
function getRepoComplexity(repo) {
  return repoComplexityMap[repo.name] || "beginner";
}

//  Fetch all languages used in one repository

async function fetchRepoLanguages(repo) {
  try {
    const response = await fetch(repo.languages_url);

    if (!response.ok) {
      throw new Error("Failed to fetch languages");
    }

    const languagesData = await response.json();
    return Object.keys(languagesData);
  } catch (error) {
    console.error(`Language fetch failed for ${repo.name}:`, error);
    return [];
  }
}

// repository card
function createRepoCard(repo) {
  const complexity = getRepoComplexity(repo);

  const languagesHTML = repo.languages.length
    ? repo.languages
        .map((lang) => `<span class="repo-tag">${lang}</span>`)
        .join("")
    : `<span class="repo-tag">No languages listed</span>`;

  return `
    <article class="card project-card">
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description available."}</p>

      <div class="repo-meta">
        <span class="repo-tag">Complexity: ${complexity}</span>
      </div>

      <div class="repo-meta">
        ${languagesHTML}
      </div>

      <a 
        class="btn primary repo-link" 
        href="${repo.html_url}" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        View Repository
      </a>
    </article>
  `;
}

/*
  Filter + sort repos
*/
function getProcessedRepos() {
  let repos = [...githubReposData];

  const selectedComplexity = repoComplexityFilter.value;
  const selectedSort = repoSort.value;

  // Filter only by beginner / advanced
  if (selectedComplexity !== "all") {
    repos = repos.filter((repo) => getRepoComplexity(repo) === selectedComplexity);
  }

  // Sort only by name
  if (selectedSort === "name") {
    repos.sort((a, b) => a.name.localeCompare(b.name));
  }

  return repos;
}

function renderGitHubRepos() {
  if (!githubReposGrid) return;

  const repos = getProcessedRepos();

  if (!repos.length) {
    githubReposGrid.innerHTML = `
      <article class="card project-card">
        <h3>No repositories found</h3>
        <p>Try changing the filter or sorting options.</p>
      </article>
    `;
    return;
  }

  githubReposGrid.innerHTML = repos.map(createRepoCard).join("");
}

async function loadGitHubRepos() {
  if (!repoStatus || !githubReposGrid) return;

  repoStatus.textContent = "Loading repositories...";

  try {
    const response = await fetch("https://api.github.com/users/LeenGhazi/repos?sort=updated&per_page=100");

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const repos = await response.json();

   const ownRepos = repos.filter((repo) => !repo.fork);

    const reposWithLanguages = await Promise.all(
      ownRepos.map(async (repo) => {
        const languages = await fetchRepoLanguages(repo);
        return {
          ...repo,
          languages
        };
      })
    );

    githubReposData = reposWithLanguages;

    repoStatus.textContent = "Repositories loaded successfully.";
    renderGitHubRepos();
  } catch (error) {
    console.error("GitHub fetch error:", error);
    repoStatus.textContent = "Sorry, GitHub repositories could not be loaded right now.";
    githubReposGrid.innerHTML = "";
  }
}

if (repoComplexityFilter) {
  repoComplexityFilter.addEventListener("change", renderGitHubRepos);
}

if (repoSort) {
  repoSort.addEventListener("change", renderGitHubRepos);
}

window.addEventListener("DOMContentLoaded", () => {
  loadGitHubRepos();
});