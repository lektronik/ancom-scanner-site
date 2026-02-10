/**
 * Scanner by ancom.gr - Main JavaScript
 * Clean vanilla JS implementation
 */

document.addEventListener('DOMContentLoaded', function () {

    // Initialize all modules
    initStickyNavigation();
    initSmoothScroll();
    initMobileMenu();
    initAccordion();
    initActiveNavState();
    initLazyLoad();

});

// Initialize ScrollReveal after full page load to ensure layout is stable
// This prevents animations from triggering prematurely if images haven't loaded yet
window.addEventListener('load', function () {
    initScrollReveal();
});

/**
 * Sticky Navigation with show/hide on scroll
 */
function initStickyNavigation() {
    const header = document.querySelector('.site-header-nav');
    const secondaryMenu = document.querySelector('.secondary-menu');

    if (!header) return;

    let lastScroll = 0;
    let secondaryHeight = secondaryMenu ? secondaryMenu.offsetHeight : 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add active class when scrolled past secondary menu or hero
        if (currentScroll > secondaryHeight + 50) {
            header.classList.add('active');

            // Show/hide based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                // ONLY hide on desktop (prevent disappearing hamburger on mobile)
                if (window.innerWidth >= 992) {
                    header.classList.add('stand-by');
                }
            } else {
                header.classList.remove('stand-by');
            }
        } else {
            header.classList.remove('active');
            header.classList.remove('stand-by');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('[data-target]');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Mobile-specific check for "Call Now" button logic
                // ONLY applies to the hero-cta button, NOT the menu links
                if (window.innerWidth < 992 && targetId === '#op_contact' && this.classList.contains('hero-cta')) {
                    const mobileContact = document.getElementById('contact-info-mobile');
                    if (mobileContact) {
                        mobileContact.scrollIntoView({ behavior: 'smooth' });
                        return; // Exit early
                    }
                }

                // Use scrollIntoView to respect CSS scroll-margin-top
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.main-menu');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Scroll down button in hero
    const scrollBtns = document.querySelectorAll('[data-actions*="scrollbelow"]');
    scrollBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const homeSection = document.querySelector('.home-section');
            if (homeSection) {
                const nextSection = homeSection.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

/**
 * Mobile menu toggle
 */
/**
 * Mobile Navigation Menu (Pop-up Overlay)
 */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const overlay = document.getElementById('mobile-overlay');
    const closeBtn = overlay ? overlay.querySelector('.close-btn') : null;
    const desktopMenu = document.querySelector('.main-menu .menu');
    const mobileMenuList = document.getElementById('mobile-menu-list');

    if (!toggleBtn || !overlay || !desktopMenu || !mobileMenuList) return;

    // 1. Clone menu items from desktop to mobile
    if (mobileMenuList.children.length === 0) {
        const clonedItems = desktopMenu.cloneNode(true);
        Array.from(clonedItems.children).forEach(item => {
            const mobileItem = item.cloneNode(true);
            const link = mobileItem.querySelector('a');

            if (link) {
                // Manually attach click for scrolling
                link.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Close menu first
                    closeMenu();

                    // Specific logic for smooth scroll from mobile
                    const targetId = this.getAttribute('data-target');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        // Small timeout to allow menu close animation
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }
                });
            }
            mobileMenuList.appendChild(mobileItem);
        });
    }

    // 2. Open Menu
    toggleBtn.addEventListener('click', function () {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scroll

        // Accessibility: Move focus to close button
        if (closeBtn) {
            closeBtn.focus();
        }
    });

    // 3. Close Menu
    function closeMenu() {
        overlay.classList.remove('open');
        document.body.style.overflow = ''; // Unlock scroll
        // Return focus to toggle button
        toggleBtn.focus();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close when clicking outside panel
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeMenu();
        }
    });

    // Accessibility: Focus Trap
    overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' || e.keyCode === 9) {
            const focusableElements = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}

/**
 * Accordion functionality
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.ft-accordion-item');

    accordionItems.forEach(function (item) {
        const title = item.querySelector('.ft-accordion-title');
        const content = item.querySelector('.ft-tab-content');

        if (title && content) {
            title.addEventListener('click', function (e) {
                e.preventDefault();

                // Close all other items
                accordionItems.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .elementor-invisible');

    if (!revealElements.length) return;

    const revealOptions = {
        root: null,
        // Trigger when element is 100px above the bottom of viewport (standard delay)
        // This prevents peeking triggers but guarantees start when scrolled in
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealCallback = function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Get animation delay from data attribute
                const settings = entry.target.getAttribute('data-settings');
                let delay = 0;

                if (settings) {
                    try {
                        const parsed = JSON.parse(settings);
                        delay = parsed._animation_delay || 0;
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }

                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(function (el) {
        observer.observe(el);
    });

    // Handle on-scroll image animations (ft-intro-img-2)
    const onScrollImages = document.querySelectorAll('.on-scroll.ft-intro-img-2');

    if (onScrollImages.length) {
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('focus-on');
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        onScrollImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    }
}

/**
 * Active navigation state based on scroll position
 */
function initActiveNavState() {
    const sections = document.querySelectorAll('section[id]');
    // Select both desktop and mobile menu items
    const navLinks = document.querySelectorAll('.main-menu .menu li.menu-item, #mobile-menu-list li');

    if (!sections.length || !navLinks.length) return;

    function updateActiveState() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const header = document.querySelector('.site-header-nav');
        const headerOffset = header ? header.offsetHeight + 50 : 150;

        // 1. Get all targets from nav links
        const targets = [];
        navLinks.forEach(link => {
            const anchor = link.querySelector('a');
            if (anchor) {
                const targetId = anchor.getAttribute('data-target');
                if (targetId && targetId.startsWith('#')) {
                    const idClean = targetId.substring(1);
                    const section = document.getElementById(idClean);
                    if (section) {
                        // Avoid duplicates
                        if (!targets.some(t => t.id === idClean)) {
                            targets.push({
                                id: idClean,
                                top: section.offsetTop - headerOffset,
                                element: section
                            });
                        }
                    }
                }
            }
        });

        // Ensure home-section is in the list if not already
        if (!targets.some(t => t.id === 'home-section')) {
            const homeSec = document.getElementById('home-section');
            if (homeSec) {
                targets.push({
                    id: 'home-section',
                    top: 0,
                    element: homeSec
                });
            }
        }

        // Add contact-details manually if not linked but exists
        // (This helps with the alias logic if it's treated as a distinct section)
        if (!targets.some(t => t.id === 'contact-details')) {
            const cdSec = document.getElementById('contact-details');
            if (cdSec) {
                targets.push({
                    id: 'contact-details',
                    top: cdSec.offsetTop - headerOffset,
                    element: cdSec
                });
            }
        }

        // Sort by position
        targets.sort((a, b) => a.top - b.top);

        // 2. Determine active section (Logic: "Last section passed")
        // Default to first section (Home)
        let currentSection = targets.length > 0 ? targets[0].id : '';

        for (let i = 0; i < targets.length; i++) {
            if (scrollPosition >= targets[i].top) {
                currentSection = targets[i].id;
            }
        }

        // 3. Bottom of page override (Force Contact)
        if (scrollPosition + windowHeight >= documentHeight - 50) {
            currentSection = 'op_contact'; // Force contact active at bottom
        }

        // Aliasing
        if (currentSection === 'contact-details') currentSection = 'op_contact';
        if (currentSection === 'page-top') currentSection = 'home-section';

        // 4. Update Classes
        navLinks.forEach(li => {
            li.classList.remove('current-menu-item');
            const a = li.querySelector('a');
            if (a) {
                const tId = a.getAttribute('data-target').substring(1);
                // Check direct match or home alias (reverse check)
                // If currentSection is 'home-section', highlight 'page-top' or 'home-section'
                const isHome = currentSection === 'home-section' && (tId === 'page-top' || tId === 'home-section');

                if (tId === currentSection || isHome) {
                    li.classList.add('current-menu-item');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveState, { passive: true });
    updateActiveState(); // Initial call
}

/**
 * Lazy load images with data-lazyload attribute
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-lazyload]');

    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-lazyload');
                    img.removeAttribute('data-lazyload');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(function (img) {
            img.src = img.getAttribute('data-lazyload');
            img.removeAttribute('data-lazyload');
        });
    }
}
