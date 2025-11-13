// Mobile menu functionality
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (!navbar.contains(event.target)) {
        navLinks.classList.remove('active');
    }
});

// GitHub API functionality
const repoForm = document.getElementById('repoForm');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const commitsDiv = document.getElementById('commits');

repoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const repository = document.getElementById('repository').value.trim();
    
    if (!username || !repository) {
        showError('Please enter both username and repository name.');
        return;
    }

    await fetchCommits(username, repository);
});

async function fetchCommits(username, repository) {
    // Show loading state
    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    commitsDiv.innerHTML = '';

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repository}/commits`);
        
        if (!response.ok) {
            throw new Error(`Repository not found or API error: ${response.status}`);
        }

        const commits = await response.json();
        displayCommits(commits, username, repository);
        
    } catch (error) {
        showError(`Error fetching commits: ${error.message}`);
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function displayCommits(commits, username, repository) {
    if (commits.length === 0) {
        commitsDiv.innerHTML = '<p class="error">No commits found for this repository.</p>';
        return;
    }

    const commitsHTML = commits.map(commit => {
        const date = new Date(commit.commit.author.date).toLocaleDateString();
        const time = new Date(commit.commit.author.date).toLocaleTimeString();
        
        return `
            <div class="commit-item">
                <div class="commit-message">${escapeHtml(commit.commit.message)}</div>
                <div class="commit-meta">
                    <span class="commit-author">By: ${escapeHtml(commit.commit.author.name)}</span>
                    <span class="commit-date">${date} at ${time}</span>
                </div>
                <div class="commit-sha">SHA: ${commit.sha.substring(0, 7)}</div>
            </div>
        `;
    }).join('');

    commitsDiv.innerHTML = `
        <h2>📊 ${username}/${repository} - ${commits.length} commits</h2>
        ${commitsHTML}
    `;
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    commitsDiv.innerHTML = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Contact form functionality with Web3Forms
const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactSuccess = document.getElementById('contactSuccess');
const contactError = document.getElementById('contactError');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // Show loading state
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.textContent = 'Sending...';
    
    // Hide previous messages
    contactSuccess.style.display = 'none';
    contactError.style.display = 'none';
    
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success message
            contactSuccess.style.display = 'block';
            contactForm.reset();
            
            // Scroll to success message
            contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error(data.message || 'Form submission failed');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        contactError.style.display = 'block';
        
        // Scroll to error message
        contactError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
        // Reset button state
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = 'Send Message';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.getElementById('navLinks').classList.remove('active');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('GitHub Commit Tracker loaded successfully!');
});