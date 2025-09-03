// ===== CLEAN PORTFOLIO JAVASCRIPT =====

// Critical initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize in order of importance
    initNavbar();
    initGoToTop();
    initMobileMenu();
    
    // Initialize AOS with optimized settings
    setTimeout(() => {
        AOS.init({
            duration: 300,
            easing: 'ease-out',
            once: true,
            offset: 30
        });
    }, 50);
    
    // Initialize other features
    initCounters();
    initContactForm();
    initParticles();
});

// ===== NAVBAR MANAGEMENT =====
function initNavbar() {
    const navbar = document.querySelector('nav');
    if (navbar) {
        // Ensure navbar is always visible
        navbar.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            width: 100% !important;
            z-index: 9999 !important;
            background-color: #0a0a0f !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        // Smooth scroll for navigation links
        const navLinks = navbar.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== GO TO TOP BUTTON =====
function initGoToTop() {
    const goToTopButton = document.getElementById('go-to-top');
    if (!goToTopButton) return;
    
    const handleScroll = () => {
        if (window.scrollY > 300) {
            goToTopButton.style.opacity = '1';
            goToTopButton.style.visibility = 'visible';
        } else {
            goToTopButton.style.opacity = '0';
            goToTopButton.style.visibility = 'hidden';
        }
    };
    
    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Click handler
    goToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    handleScroll();
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle('hidden');
        
        // Prevent body scroll when menu is open
        if (!mobileMenu.classList.contains('hidden')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Close menu on link clicks
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-counter'));
                const duration = parseInt(counter.getAttribute('data-duration')) || 800;
                
                animateCounter(counter, 0, target, duration);
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 2);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';
                submitButton.className = submitButton.className.replace('from-neon-blue to-neon-purple', 'from-neon-green to-neon-blue');
                contactForm.reset();
                showNotification('Message sent successfully!', 'success');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            submitButton.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Failed to Send';
            submitButton.className = submitButton.className.replace('from-neon-blue to-neon-purple', 'from-red-500 to-red-600');
            showNotification('Failed to send message. Please try again.', 'error');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.className = submitButton.className.replace(/from-\w+-\w+ to-\w+-\w+/, 'from-neon-blue to-neon-purple');
        }, 3000);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `
        fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 
        transform transition-all duration-300 translate-x-full
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
    `;
    
    notification.innerHTML = `
        <div class="flex items-center text-white">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        
        const duration = Math.random() * 4 + 4;
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    // Create particles less frequently for better performance
    setInterval(createParticle, 800);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for scroll events
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

// Optimize scroll performance
const optimizedScrollHandler = debounce(() => {
    // Any additional scroll handling can go here
}, 16);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// ===== ACCESSIBILITY =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on escape
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
    }
});
