//---- Dark Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const toggleButton = document.getElementById('toggleButton');
const projectsSection = document.getElementById('projects');

const hamburger = document.querySelector('.hamburger');
const sideNav = document.querySelector('.sidebar');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');  // Toggle the dark theme class
    // Optionally change the icon (e.g., moon/sun)
    if (body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';  // Sun icon for dark theme
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';  // Moon icon for light theme
    }
});

//---- Project Card Sorting
function filterProjects(category) {
    const projects = document.querySelectorAll('.card');
    
    // Loop through all project cards
    projects.forEach(project => {
        // If the category matches or 'all' is selected, show the project
        if (category === 'all' || project.getAttribute('data-category') === category) {
            project.style.display = 'block'; // Show project
        } else {
            project.style.display = 'none'; // Hide project
        }
    });
}

//---- Add Event listener to the button
toggleButton.addEventListener('click', function() {
    // Toggle the 'hidden' class on the projects section
    projectsSection.classList.toggle('hidden');

    // Change button text based on visibility of the projects section
    if (projectsSection.classList.contains('hidden')) {
        toggleButton.textContent = 'Show Projects';  // If hidden, change text to 'Show Projects'
    } else {
        toggleButton.textContent = 'Hide Projects';  // If visible, change text to 'Hide Projects'
    }
});

//---- Hamburger Menu
const navMainMenuToggle = document.querySelector(".nav-main-menu-toggle");

 navMainMenuToggle.addEventListener("click", (e) => {
     e.preventDefault();
     const ariaControls = navMainMenuToggle.getAttribute("aria-controls");
     if (navMainMenuToggle.getAttribute("aria-expanded") === "false") {
         navMainMenuToggle.setAttribute("aria-expanded", "true");
         navMainMenuToggle.setAttribute("aria-label", "Close menu");
         navMainMenuToggle.parentElement.querySelector(`#${ariaControls}`).toggleAttribute("hidden");
     } else {
         navMainMenuToggle.setAttribute("aria-expanded", "false");
         navMainMenuToggle.setAttribute("aria-label", "Open menu");
        navMainMenuToggle.parentElement.querySelector(`#${ariaControls}`).toggleAttribute("hidden");
     }
});