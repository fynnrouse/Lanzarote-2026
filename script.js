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

// Page Navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

// Submission Form Handling
let formSubmitted = false;

// Person Selection
document.addEventListener('DOMContentLoaded', () => {
    const personButtons = document.querySelectorAll('.person-btn');
    personButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all person buttons
            personButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Store selected person
            document.getElementById('selectedPerson').value = this.dataset.person;
        });
    });

    // Score Selection (Food, Service, Ambiance)
    function setupScoreButtons(containerSelector, scoreInputId) {
        const container = document.querySelector(containerSelector);
        const buttons = container.querySelectorAll('.score-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons in this category
                buttons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Store selected score
                document.getElementById(scoreInputId).value = this.dataset.score;
            });
        });
    }

    setupScoreButtons('#foodButtons', 'foodScore');
    setupScoreButtons('#serviceButtons', 'serviceScore');
    setupScoreButtons('#ambianceButtons', 'ambianceScore');

    // Form Submission
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    formSubmitBtn.addEventListener('click', async function() {
        // Validate form
        const person = document.getElementById('selectedPerson').value;
        const food = document.getElementById('foodScore').value;
        const service = document.getElementById('serviceScore').value;
        const ambiance = document.getElementById('ambianceScore').value;
        const comments = document.getElementById('comments').value;

        if (!person || !food || !service || !ambiance) {
            alert('Please select a person and scores for Food, Service, and Ambiance.');
            return;
        }

        if (formSubmitted) {
            alert('You have already submitted your scores.');
            return;
        }

        // Get restaurant name (placeholder until admin settings are ready)
        const restaurant = document.getElementById('restaurantDisplay').textContent;

        // Prepare data for Google Apps Script
        const data = {
            restaurant: restaurant,
            person: person,
            food: parseInt(food),
            service: parseInt(service),
            ambiance: parseInt(ambiance),
            comment: comments
        };

        try {
            // Submit to Google Apps Script
            const response = await fetch('https://script.google.com/macros/s/AKfycbzxUnoBsjH5rmqtvg9agQhoJl27nrIiegHLHWvw_xPOcWKcCtfZOKkffmzGKST6rVmV/exec', {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            });

            // Mark form as submitted
            formSubmitted = true;

            // Hide form and show thank you message
            document.getElementById('submissionForm').style.display = 'none';
            document.getElementById('thankYouMessage').style.display = 'block';

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting scores. Please try again.');
        }
    });

    // Return to Home Button
    const returnHomeBtn = document.getElementById('returnHomeBtn');
    if (returnHomeBtn) {
        returnHomeBtn.addEventListener('click', () => {
            // Reset form for next submission
            document.getElementById('submissionForm').style.display = 'block';
            document.getElementById('thankYouMessage').style.display = 'none';
            // Reset form fields
            document.getElementById('selectedPerson').value = '';
            document.getElementById('foodScore').value = '';
            document.getElementById('serviceScore').value = '';
            document.getElementById('ambianceScore').value = '';
            document.getElementById('comments').value = '';
            // Remove active classes
            document.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.score-btn').forEach(b => b.classList.remove('active'));
            // Navigate to home
            showPage('homePage');
        });
    }

    // Submit Button Handler (opens submission page)
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', () => {
        // Reset form state if needed
        if (formSubmitted) {
            formSubmitted = false;
            document.getElementById('submissionForm').style.display = 'block';
            document.getElementById('thankYouMessage').style.display = 'none';
            // Reset form fields
            document.getElementById('selectedPerson').value = '';
            document.getElementById('foodScore').value = '';
            document.getElementById('serviceScore').value = '';
            document.getElementById('ambianceScore').value = '';
            document.getElementById('comments').value = '';
            document.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.score-btn').forEach(b => b.classList.remove('active'));
        }
        showPage('submissionPage');
    });

    // See More Button Handler
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    seeMoreBtn.addEventListener('click', () => {
        alert('Full leaderboard page coming soon!');
        // Future: Navigate to full leaderboard page
    });

    // Initialize date/time
    updateDateInfo();

    // Update date/day/emoji every minute
    setInterval(updateDateInfo, 60000);

    // Set initial restaurant name (placeholder - will be replaced with admin settings)
    document.getElementById('restaurantDisplay').textContent = 'Restaurant Name';
});
