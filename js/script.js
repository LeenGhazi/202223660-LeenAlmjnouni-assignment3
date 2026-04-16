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
   Fetch Data from Github API
========================= */
// get the elements related to the github repos section
const githubReposGrid = document.getElementById("githubReposGrid");
const repoStatus = document.getElementById("repoStatus");
const repoComplexityFilter = document.getElementById("repoComplexityFilter");
const repoSort = document.getElementById("repoSort");
let githubReposData = [];
//  MANUAL COMPLEXITY MAP, for the sake of this project, i will categorize some of my projects to advanced manually
const repoComplexityMap = {
  "202223660-LeenAlmjnouni-assignment3": "advanced",
  "Crime-Forecasting-in-Los-Angeles": "advanced",
  "Navi-KFUPM": "advanced",
  "Salary-Prediction-Classification": "advanced",
  "Face_Lite": "advanced",
  "Peruke_Game": "advanced",
};
// categorize a repo as beginner by default so that only the specified projects above are advanced.
function getRepoComplexity(repo) {
  return repoComplexityMap[repo.name] || "beginner";
}
//  Fetch all programming languages used in one repository
async function fetchRepoLanguages(repo) {
  try {
    const response = await fetch(repo.languages_url);
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status}`);
    }
    // The API returns an object where keys are language names and values are bytes of code
    const languagesData = await response.json();
    return Object.keys(languagesData);
  } catch (error) {
    console.error(`Language fetch failed for ${repo.name}:`, error);
    return [];
  }
}
// Create repository card structure
function createRepoCard(repo) {
  const complexity = getRepoComplexity(repo);
  // convert the language object to one string
  const languagesText = repo.languages.length
  ? `Languages: ${repo.languages.join(", ")}`
  : "Languages: Not specified";
  return `
  <article class="card project-card">
    
    <!-- TOP -->
    <div class="repo-top">
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description available."}</p>
    </div>

    <!-- BOTTOM -->
    <div class="repo-bottom">
      <div class="repo-meta">
        <span class="repo-tag">Complexity: ${complexity}</span>
      </div>

      <div class="repo-meta">
        <span class="repo-tag">${languagesText}</span>
      </div>

      <a 
        class="btn primary repo-link" 
        href="${repo.html_url}" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        View Repository
      </a>
    </div>

  </article>
`;
}
// Filter + sort repos.
function getProcessedRepos() {
  let repos = [...githubReposData];
  // filter by complexity, sort by name or last update
  const selectedComplexity = repoComplexityFilter.value;
  const selectedSort = repoSort.value;
  // Filter only by beginner / advanced
  if (selectedComplexity !== "all") {
    repos = repos.filter((repo) => getRepoComplexity(repo) === selectedComplexity);
  }
  // Sort options
  if (selectedSort === "name") {
    repos.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSort === "updated") {
    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
  return repos;
}
// rener repo information to the page.
function renderGitHubRepos() {
  if (!githubReposGrid) return;
  const repos = getProcessedRepos();
  // display this message if there is no result after filtering, otherwise show the repos cards
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
// load the repos from the github api, with caching and error handling
async function loadGitHubRepos() {
  if (!repoStatus || !githubReposGrid) return;
  repoStatus.textContent = "Loading repositories...";

  // CACHE CHECK
  const cachedData = localStorage.getItem("githubRepos");
  const cachedTime = Number(localStorage.getItem("githubReposTime"));
  const now = Date.now();
  // after 10 minutes, the cache will be considered expired and the data will be fetched again from the API
  const cacheDuration = 1000 * 60 * 10; 
  // if the data still valid, use it and render the repos without making an API call
  if (cachedData && cachedTime && now - cachedTime < cacheDuration) {
    githubReposData = JSON.parse(cachedData);
    repoStatus.textContent = "Loaded from cache.";
    renderGitHubRepos();
    return;
  }
  // if not, fetch the data from the API, process it, save it to the cache, and then render it
  try {
    const response = await fetch("https://api.github.com/users/LeenGhazi/repos?sort=updated&per_page=100");
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status}`);
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

    // SAVE CACHE
    localStorage.setItem("githubRepos", JSON.stringify(githubReposData));
    localStorage.setItem("githubReposTime", Date.now());
    repoStatus.textContent = "Repositories loaded successfully.";
    renderGitHubRepos();
    } catch (error) {
      console.error("GitHub fetch error:", error);
      repoStatus.textContent = "Sorry, GitHub repositories could not be loaded right now.";
      githubReposGrid.innerHTML = "";
    }
}
// Event listeners for filtering and sorting

if (repoComplexityFilter) {
  repoComplexityFilter.addEventListener("change", renderGitHubRepos);}
if (repoSort) {
  repoSort.addEventListener("change", renderGitHubRepos);}

  
/* =========================
   POPUP GREETING + LOADING GITHUB REPOS
========================= */
// loading the name saved in the local storage and showing the greeting if the name is found, 
// otherwise show the popup to ask for the name
// also, load the github repos in the same time to make sure they are ready when the user closes the popup
window.addEventListener("DOMContentLoaded", () => {
  const savedName = localStorage.getItem("username");
  document.body.classList.add("overlay-active");

  const input = document.getElementById("popup-name");
  const button = document.querySelector(".popup-box button");

  if (savedName) {
    input.style.display = "none";
    button.style.display = "none";
    showGreetingOnly(savedName);
  }

  loadGitHubRepos();
});
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




