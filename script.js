// Date and Day Calculation
function updateDateInfo() {
    const today = new Date();
    const holidayStart = new Date(2026, 6, 1); // July 1, 2026
    
    // Format current date
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = formattedDate;
    
    // Calculate day number
    const dayDifference = Math.floor((today - holidayStart) / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('dayNumber').textContent = `Day ${dayDifference}`;
    
    // Update emoji based on day
    updateEmoji(dayDifference);
}

function updateEmoji(dayNumber) {
    const emojis = ['🌴', '🏖️', '🌊', '🍹', '🦜', '🌺', '⛱️', '🐠', '🏝️', '☀️'];
    const emojiIndex = (dayNumber - 1) % emojis.length;
    document.getElementById('dateEmoji').textContent = emojis[emojiIndex];
}

// Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const navLinks = document.querySelectorAll('.nav-link:not(.locked)');

function toggleMenu() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenu() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

menuBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Prevent locked setup link from opening
document.querySelector('.nav-link.locked').addEventListener('click', (e) => {
    e.preventDefault();
    alert('🔒 Setup is locked!');
});

// Submit Button Handler
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', () => {
    alert('Submit page coming soon!');
    // Future: Navigate to submit page
});

// See More Button Handler
const seeMoreBtn = document.getElementById('seeMoreBtn');
seeMoreBtn.addEventListener('click', () => {
    alert('Full leaderboard page coming soon!');
    // Future: Navigate to full leaderboard page
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDateInfo();
    
    // Update date/day/emoji every minute
    setInterval(updateDateInfo, 60000);
});
