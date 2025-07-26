// Ensure page always starts at top on refresh
window.addEventListener('load', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);
});

window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const backToTopBtn = document.getElementById('backToTop');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Ensure page starts at top on load/refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
    createPlaceholderImages();
    
    // Set home as active initially
    setTimeout(() => {
        updateActiveNavLink();
    }, 100);
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Active navigation link highlighting
        updateActiveNavLink();
    });

    // Back to top functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    // If at the very top, activate home link
    if (window.scrollY < 50) {
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
        return;
    }

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    contactForm.addEventListener('submit', handleFormSubmission);

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.btn-submit');
    const formData = new FormData(contactForm);
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Simulate form submission (replace with actual endpoint)
        await simulateFormSubmission(formData);
        
        // Success
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        clearAllErrors();
        
    } catch (error) {
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Simulate form submission (replace with actual implementation)
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% chance) or failure (10% chance)
            Math.random() > 0.1 ? resolve() : reject(new Error('Simulation error'));
        }, 2000);
    });
}

// Form validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    let isValid = true;

    if (!validateField(name)) isValid = false;
    if (!validateField(email)) isValid = false;
    if (!validateField(subject)) isValid = false;
    if (!validateField(message)) isValid = false;

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearError(field);

    // Required field validation
    if (!value) {
        errorMessage = `${capitalize(fieldName)} is required.`;
        isValid = false;
    } else {
        // Specific field validations
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long.';
                    isValid = false;
                }
                break;
            case 'email':
                if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address.';
                    isValid = false;
                }
                break;
            case 'subject':
                if (value.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters long.';
                    isValid = false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long.';
                    isValid = false;
                }
                break;
        }
    }

    // Show error if validation failed
    if (!isValid) {
        showError(field, errorMessage);
    } else {
        showSuccess(field);
    }

    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showError(field, message) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Show field success
function showSuccess(field) {
    const formGroup = field.parentElement;
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
}

// Clear field error
function clearError(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error', 'success');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Clear all form errors
function clearAllErrors() {
    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles for notification
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .notification-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
            margin-left: 1rem;
        }
    `;

    // Add styles to head if not already present
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }

    // Add to DOM and show
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .about-text, .contact-info, .contact-form');
    animatedElements.forEach(el => observer.observe(el));

    // Typing effect for home section
    typeWriter();
}

// Typing effect
function typeWriter() {
    const text = "Computer Applications Student";
    const element = document.querySelector('.home-text h2');
    if (!element) return;

    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

// Create placeholder images
function createPlaceholderImages() {
    const images = [
        { selector: '#profile-img', alt: 'Profile Photo', color: '#667eea' },
        { selector: 'img[alt="E-Commerce Website"]', alt: 'E-Commerce Project', color: '#ff6b6b' },
        { selector: 'img[alt="Task Management App"]', alt: 'Task Manager', color: '#4ecdc4' },
        { selector: 'img[alt="Weather App"]', alt: 'Weather App', color: '#45b7d1' },
        { selector: 'img[alt="Student Management System"]', alt: 'Student System', color: '#f9ca24' },
        { selector: 'img[alt="Algorithm Visualizer"]', alt: 'Algorithm Viz', color: '#6c5ce7' },
        { selector: 'img[alt="Portfolio Website"]', alt: 'Portfolio', color: '#a29bfe' }
    ];

    images.forEach(({ selector, alt, color }) => {
        const img = document.querySelector(selector);
        if (img && !img.src) {
            // Create a simple colored placeholder with text
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 400, 300);

            // Text
            ctx.fillStyle = 'white';
            ctx.font = '20px Poppins, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(alt, 200, 150);

            img.src = canvas.toDataURL();
        }
    });
}

// Utility functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Project modal functionality (bonus feature)
function initializeProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.project-links')) {
                showProjectModal(card);
            }
        });
    });
}

function showProjectModal(projectCard) {
    const title = projectCard.querySelector('h3').textContent;
    const description = projectCard.querySelector('p').textContent;
    const techStack = Array.from(projectCard.querySelectorAll('.project-tech span')).map(span => span.textContent);

    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${description}</p>
                <h4>Technologies Used:</h4>
                <div class="modal-tech">
                    ${techStack.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="modal-actions">
                    <a href="#" class="btn-primary">View Live</a>
                    <a href="#" class="btn-secondary">View Code</a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);

    // Close modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.project-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce scroll events for better performance
window.addEventListener('scroll', debounce(() => {
    // Scroll-dependent functions here
    updateActiveNavLink();
}, 10));

// Theme toggle (bonus feature)
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = 'Toggle Dark Mode';
    
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('dark-theme', isDark);
    });

    // Load saved theme preference
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProjectModals();
    initializeThemeToggle();
});

// Console message for developers
console.log(`
🚀 Shreya's Portfolio Website
Built with HTML, CSS, and JavaScript
Feel free to explore the code!

BCA Computer Applications Student
Contact: narayananshreya29@gmail.com
`);

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
