/* ==========================================================================
   PORTFOLIO JAVASCRIPT
   Handles: Theme toggler, Scroll spy, Mobile menu, Scroll reveals, 
            Contact form feedback, & CV Print trigger.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --------------------------------------------------------------------------
    // 1. LIGHT/DARK THEME TOGGLE
    // --------------------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme in localStorage, otherwise check system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        
        // Save preference to localStorage
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // --------------------------------------------------------------------------
    // 2. MOBILE MENU NAVIGATION
    // --------------------------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu visibility
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --------------------------------------------------------------------------
    // 3. HEADER SCROLL EFFECT
    // --------------------------------------------------------------------------
    const header = document.querySelector('.header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Trigger on initial load

    // --------------------------------------------------------------------------
    // 4. SCROLL SPY (Highlight active link in header)
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

            if (correspondingNavLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Trigger on initial load

    // --------------------------------------------------------------------------
    // 5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Trigger skill bar width animation if this is a skills card
                if (entry.target.classList.contains('skills-card')) {
                    animateSkills(entry.target);
                }
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Offset bottom buffer slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Trigger skills bar fill animations
    const animateSkills = (skillsCard) => {
        const fillBars = skillsCard.querySelectorAll('.skill-bar-fill');
        fillBars.forEach(bar => {
            // Read target width styled inline (or fallback to style attribute directly)
            const targetWidth = bar.style.width;
            bar.style.width = '0'; // reset first
            setTimeout(() => {
                bar.style.width = targetWidth; // set to animate to target
            }, 100);
        });
    };

    // --------------------------------------------------------------------------
    // 6. CONTACT FORM SUBMISSION & SUCCESS TOAST
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const toast = document.getElementById('toast');
    const toastCloseBtn = document.getElementById('toastCloseBtn');
    let toastTimeout;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Visual loading state
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `
                <span class="spinner"></span>
                <span>Sending...</span>
            `;

            // Simulate form processing (e.g. email sending simulation)
            setTimeout(() => {
                // Show Success Toast
                showToast();

                // Reset form fields
                contactForm.reset();

                // Reset submit button
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
            }, 1500);
        });
    }

    const showToast = () => {
        clearTimeout(toastTimeout);
        toast.classList.add('active');
        
        // Auto-close after 5 seconds
        toastTimeout = setTimeout(() => {
            hideToast();
        }, 5000);
    };

    const hideToast = () => {
        toast.classList.remove('active');
    };

    if (toastCloseBtn) {
        toastCloseBtn.addEventListener('click', hideToast);
    }

});
