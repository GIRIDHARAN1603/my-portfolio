// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initScrollIndicators();
    initSmoothScrolling();
    initProfileImageFallback();
}

// Initialize profile image fallback handling
function initProfileImageFallback() {
    const profileImage = document.querySelector('.profile-image');
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    
    if (profileImage && profilePlaceholder) {
        // Test if image loads successfully
        profileImage.addEventListener('load', function() {
            // Image loaded successfully, hide placeholder
            profilePlaceholder.style.display = 'none';
            profileImage.style.display = 'block';
        });
        
        profileImage.addEventListener('error', function() {
            // Image failed to load, show placeholder
            profileImage.style.display = 'none';
            profilePlaceholder.style.display = 'flex';
        });
        
        // Check if image is already cached and loaded
        if (profileImage.complete) {
            if (profileImage.naturalWidth > 0) {
                // Image is loaded
                profilePlaceholder.style.display = 'none';
                profileImage.style.display = 'block';
            } else {
                // Image failed to load
                profileImage.style.display = 'none';
                profilePlaceholder.style.display = 'flex';
            }
        }
    }
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateActiveNavLink();
        }, 100));
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    // Handle all navigation links with href starting with #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
                const offsetTop = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function (used by buttons) - Fixed version
function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId); // Debug log
    const target = document.getElementById(sectionId);
    
    if (target) {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
        const offsetTop = target.offsetTop - navbarHeight - 20;
        
        // Use both approaches for maximum compatibility
        try {
            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });
        } catch (e) {
            // Fallback for browsers that don't support smooth scrolling options
            window.scrollTo(0, Math.max(0, offsetTop));
        }
    } else {
        console.error('Target section not found:', sectionId);
    }
}

// Scroll-based animations using Intersection Observer
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - just show all elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animate');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
                
                // Special handling for skill items
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillItem(entry.target);
                }
                
                // Special handling for venture cards
                if (entry.target.classList.contains('venture-card')) {
                    animateVentureCard(entry.target);
                }
                
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    const animatedElements = [
        '.timeline-item',
        '.venture-card', 
        '.skill-item',
        '.contact-info',
        '.contact-form',
        '.about-content'
    ];

    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    });
}

// Timeline item animation
function animateTimelineItem(item) {
    const content = item.querySelector('.timeline-content');
    if (content) {
        setTimeout(() => {
            content.style.transform = 'scale(1.05)';
            setTimeout(() => {
                content.style.transform = 'scale(1)';
            }, 200);
        }, 300);
    }
}

// Skill item animation
function animateSkillItem(item) {
    const icon = item.querySelector('.skill-icon');
    if (icon) {
        setTimeout(() => {
            icon.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }, 500);
        }, 200);
    }
}

// Venture card animation
function animateVentureCard(card) {
    const icon = card.querySelector('.venture-icon');
    if (icon) {
        setTimeout(() => {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 300);
        }, 150);
    }
}

// Scroll indicators
function initScrollIndicators() {
    // Hero scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }, 100));
    }
}

// Contact form handling - Fixed version
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Fix textarea focus issue by ensuring proper event handling
        const messageField = contactForm.querySelector('#message');
        if (messageField) {
            // Prevent any interference with the textarea
            messageField.addEventListener('click', function(e) {
                e.stopPropagation();
                this.focus();
            });
            
            messageField.addEventListener('focus', function(e) {
                e.stopPropagation();
            });
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields before submission
            const formInputs = this.querySelectorAll('input[required], textarea[required]');
            let isFormValid = true;
            
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                handleFormSubmission(this);
            }
        });

        // Add real-time validation with proper event handling
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                e.stopPropagation();
                validateField(input);
            });
            
            input.addEventListener('input', (e) => {
                e.stopPropagation();
                clearFieldError(input);
                // Re-validate on input if field was previously invalid
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
            
            // Prevent any focus stealing for textareas
            if (input.tagName.toLowerCase() === 'textarea') {
                input.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                
                input.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }
}

// Handle form submission
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i data-feather="loader"></i> Sending...';
    submitBtn.disabled = true;
    feather.replace();
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        showFormSuccess();
        form.reset();
        // Clear any validation errors
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.field-error').forEach(el => el.remove());
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        feather.replace();
    }, 2000);
}

// Show form success message
function showFormSuccess() {
    // Create and show success notification
    const notification = document.createElement('div');
    notification.className = 'form-notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <i data-feather="check-circle"></i>
            <span>Message sent successfully! I'll get back to you soon.</span>
        </div>
    `;
    
    // Add styles for the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--portfolio-secondary);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    if (notificationContent) {
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
    }
    
    document.body.appendChild(notification);
    feather.replace();
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Form validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation - fixed regex
    if (field.type === 'email' && value) {
        // More permissive email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Name validation
    if (field.name === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
    }
    
    // Subject validation
    if (field.name === 'subject' && value && value.length < 3) {
        isValid = false;
        errorMessage = 'Subject must be at least 3 characters long';
    }
    
    // Message validation
    if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Add error styles to field
    field.style.borderColor = '#dc3545';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    }
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    }
});

// Page visibility API to pause/resume animations
document.addEventListener('visibilitychange', () => {
    const animations = document.querySelectorAll('.hero-pattern');
    
    if (document.visibilityState === 'hidden') {
        animations.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        animations.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Preload critical resources
function preloadCriticalResources() {
    const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];
    
    criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();

// Export functions for global access
window.scrollToSection = scrollToSection;

// Additional error handling
window.addEventListener('error', (e) => {
    console.log('JavaScript error caught:', e.error);
});

// Ensure smooth scrolling works even if CSS scroll-behavior fails
if (!CSS.supports('scroll-behavior', 'smooth')) {
    // Polyfill for browsers that don't support smooth scrolling
    const smoothScrollPolyfill = (target, duration = 1000) => {
        const targetPosition = target.offsetTop - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };
    
    // Override the scrollToSection function for browsers without smooth scroll support
    window.scrollToSection = function(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            smoothScrollPolyfill(target);
        }
    };
}