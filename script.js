// Project Data
const projects = [
    {
        name: "Food Delivery Website",
        desc: "A responsive food ordering app with interactive menu, dynamic cart, and real-time pricing.",
        link: "https://chahar-food-delivery-website.netlify.app/",
    },
    {
        name: "Food Delivery Clone",
        desc: "Interactive menu display and cart with dynamic pricing.",
        link: "https://statuesque-moonbeam-985537.netlify.app/"
    },
    {
        name: "Dynamic Image Gallery",
        desc: "Responsive grid with lightbox and smooth CSS animations.",
        link: "https://zesty-bunny-1d222a.netlify.app/"
    },
    {
        name: "Tic-Tac-Toe Game",
        desc: "Game logic with win detection and score tracking.",
        link: "https://effervescent-pudding-4e203f.netlify.app/"
    },
    {
        name: "Rock-Paper-Scissors",
        desc: "Interactive game with player vs computer functionality.",
        link: "https://marvelous-lamington-72e3eb.netlify.app/"
    },
    {
        name: "Zomato Clone",
        desc: "Interactive food delivery app with restaurant listings and order management.",
        link: "https://zomato-clone.netlify.app/"
    }
];

// Load projects into the DOM
const projectContainer = document.getElementById('project-container');

function displayProjects() {
    if (!projectContainer) return; // Guard clause
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <a href="${p.link}" target="_blank">View Live Demo →</a>
        `;
        projectContainer.appendChild(card);
    });
}

// --- THEME TOGGLE LOGIC ---
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

// 1. Initial Theme Check
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
} else {
    // Optional: Default to light if no preference is saved
    document.documentElement.setAttribute('data-theme', 'light');
}

// 2. Switch Theme Function
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// 3. Navbar Scroll Effect (Updated to use CSS Variables)
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        // Use the CSS variable for the background instead of a hardcoded color
        nav.style.background = 'var(--bg-navbar)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        nav.style.height = '60px'; // Slightly shrink on scroll
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
        nav.style.height = '70px';
    }
});

// Run display function
document.addEventListener('DOMContentLoaded', displayProjects); 