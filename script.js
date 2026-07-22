// Date and Day Calculation
function updateDateInfo() {
    const today = new Date();
    // Holiday start: Tue 18 Aug 2026 (months are 0-based: 7 = August)
    const holidayStart = new Date(2026, 7, 18);
    const holidayEnd = new Date(2026, 7, 28); // Fri 28 Aug 2026

    // Format current date
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = formattedDate;

    // Calculate day number relative to holidayStart
    let dayDifference = Math.floor((today - holidayStart) / (1000 * 60 * 60 * 24)) + 1;

    // Clamp and display sensible messages
    if (today < holidayStart) {
        document.getElementById('dayNumber').textContent = 'Starts Tue 18 Aug';
    } else if (today > holidayEnd) {
        document.getElementById('dayNumber').textContent = 'Trip ended';
    } else {
        // Ensure day is within 1..11
        dayDifference = Math.min(Math.max(dayDifference, 1), 11);
        document.getElementById('dayNumber').textContent = `Day ${dayDifference}`;
        // Update emoji based on day
        updateEmoji(dayDifference);
    }
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
