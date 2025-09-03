// Critical initialization that must happen immediately
document.addEventListener('DOMContentLoaded', function() {
    // Initialize critical UI elements FIRST
    initNavbarAndTopButton();
    initMobileMenu();
    
    // Use a small delay to ensure DOM is fully ready, then init AOS
    setTimeout(() => {
        AOS.init({
            duration: 400,
            easing: 'ease-out',
            once: true,
            offset: 50
        });
    }, 50);

    // Initialize other features immediately
    initParticleSystem();
    initCounters();
    initScrollEffects();
    initInteractiveElements();
    initTypingEffect();
    initMatrixEffect();
});

// Alternative: Initialize critical elements even before DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCriticalElements);
} else {
    initCriticalElements();
}

function initCriticalElements() {
    // Force navbar to be visible immediately
    const navbar = document.querySelector('nav');
    if (navbar) {
        navbar.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 50 !important;
            transform: translateY(0) !important;
            visibility: visible !important;
            opacity: 1 !important;
            transition: none !important;
        `;
    }
}

// Critical navbar and button initialization
function initNavbarAndTopButton() {
    // Initialize go-to-top button immediately
    const goToTopButton = document.getElementById('go-to-top');
    if (goToTopButton) {
        // Set up scroll handler immediately
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 200) {
                goToTopButton.style.opacity = '1';
                goToTopButton.style.visibility = 'visible';
                goToTopButton.classList.add('visible');
            } else {
                goToTopButton.style.opacity = '0';
                goToTopButton.style.visibility = 'hidden';
                goToTopButton.classList.remove('visible');
            }
        };
        
        // Immediate scroll check
        handleScroll();
        
        // Set up scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Click handler
        goToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Particle System
function initParticleSystem() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size and position
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        
        // Random animation duration
        const duration = Math.random() * 10 + 8;
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }

    // Create particles periodically
    setInterval(createParticle, 300);
}

// Mobile Menu
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuButton || !mobileMenu) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    // Toggle mobile menu
    menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
        
        // Prevent body scroll when menu is open
        if (!mobileMenu.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on links
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Animated Counters
function initCounters() {
    const smsCounter = document.getElementById('sms-counter');
    const monthlySms = document.getElementById('monthly-sms');
    
    if (smsCounter) {
        animateCounter(smsCounter, 0, 100000, 1000, (val) => {
            return val.toLocaleString() + '+';
        });
    }
    
    // Add more counters as needed
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = parseInt(counter.getAttribute('data-duration')) || 1000;
        animateCounter(counter, 0, target, duration);
    });
}

function animateCounter(element, start, end, duration, formatter = null) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        if (formatter) {
            element.textContent = formatter(current);
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;
    
    // Disable navbar hiding for now - keep it always visible
    // window.addEventListener('scroll', () => {
    //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
    //     // Navbar hide/show on scroll
    //     if (scrollTop > lastScrollTop && scrollTop > 100) {
    //         navbar.style.transform = 'translateY(-100%)';
    //     } else {
    //         navbar.style.transform = 'translateY(0)';
    //     }
        
    //     lastScrollTop = scrollTop;
        
    // Parallax effect for floating elements - moved to separate function
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const floatingElements = document.querySelectorAll('.animate-float');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
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

// Interactive Elements
function initInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.hover\\:scale-105');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateZ(0)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateZ(0)';
        });
    });
    
    // Interactive skill bars
    const skillBars = document.querySelectorAll('.bg-gradient-to-r');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'pulse-glow 2s ease-in-out infinite alternate';
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(0, 245, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typewriter');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '0.15em solid #00f5ff';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderColor = element.style.borderColor === 'transparent' ? '#00f5ff' : 'transparent';
                }, 750);
            }
        };
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Matrix Rain Effect
function initMatrixEffect() {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-bg';
    document.body.appendChild(matrixContainer);
    
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const columns = Math.floor(window.innerWidth / 20);
    
    function createMatrixChar() {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        char.style.fontSize = (Math.random() * 10 + 10) + 'px';
        
        matrixContainer.appendChild(char);
        
        setTimeout(() => {
            if (char.parentNode) {
                char.parentNode.removeChild(char);
            }
        }, 5000);
    }
    
    // Create matrix characters periodically (less frequent for subtlety)
    setInterval(createMatrixChar, 500);
}

// Performance Metrics Animation
function animatePerformanceMetrics() {
    const metrics = [
        { element: 'cpc-value', value: 0.84, prefix: '$', suffix: '' },
        { element: 'cpl-value', value: 4.44, prefix: '$', suffix: '' },
        { element: 'response-time', value: 1, prefix: '<', suffix: ' Min' }
    ];
    
    metrics.forEach(metric => {
        const element = document.getElementById(metric.element);
        if (element) {
            animateCounter(element, 0, metric.value, 2000, (val) => {
                return metric.prefix + val.toFixed(2) + metric.suffix;
            });
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// Add ripple effect CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Add loading state
            const submitButton = document.getElementById('submit-btn');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitButton.disabled = true;
            
            try {
                // Send form data to server
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Success state
                    submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';
                    submitButton.classList.remove('from-neon-blue', 'to-neon-purple');
                    submitButton.classList.add('from-neon-green', 'to-neon-blue');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    showNotification('Message sent successfully!', 'success');
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.classList.remove('from-neon-green', 'to-neon-blue');
                        submitButton.classList.add('from-neon-blue', 'to-neon-purple');
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Error state
                submitButton.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Failed to Send';
                submitButton.classList.remove('from-neon-blue', 'to-neon-purple');
                submitButton.classList.add('from-neon-pink', 'to-red-500');
                
                // Show error message
                showNotification('Failed to send message. Please try again.', 'error');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('from-neon-pink', 'to-red-500');
                    submitButton.classList.add('from-neon-blue', 'to-neon-purple');
                }, 3000);
            }
        });
    }
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
        type === 'success' 
            ? 'bg-green-600 border-l-4 border-neon-green' 
            : 'bg-red-600 border-l-4 border-neon-pink'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3"></i>
            <span class="text-white font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(-100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate special effect
        document.body.style.animation = 'glitch-skew 0.1s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});

// Performance optimization: Debounce scroll events
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

// Old go-to-top functionality moved to initNavbarAndTopButton() above

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(() => {
    // Scroll handling code here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);
