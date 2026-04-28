// Project Data from Resume
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
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

// Check for saved user preference
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.background = '#0f172a';
        nav.style.padding = '10px 0';
    } else {
        nav.style.background = 'rgba(15, 23, 42, 0.9)';
    }
});

// Run display function
document.addEventListener('DOMContentLoaded', displayProjects);