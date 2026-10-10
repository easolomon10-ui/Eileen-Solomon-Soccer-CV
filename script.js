// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                // Land on the section's heading rather than the section box, so the
                // section's top padding doesn't leave a dead gap under the navbar.
                const heading = target.querySelector('.section-title, h1, h2');
                const GAP_BELOW_NAV = 24;
                const anchorEl = heading || target;
                const anchorTop = anchorEl.getBoundingClientRect().top + window.scrollY;
                const targetPosition = Math.max(0, anchorTop - navHeight - GAP_BELOW_NAV);
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Download CV: print the live page through a print stylesheet, so the PDF is
    // generated from whatever is on the page right now rather than a stale export.
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // Animate stats on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target, 600);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(animateStats, observerOptions);
    statNumbers.forEach(stat => observer.observe(stat));

    function animateNumber(element, duration) {
        const raw = element.textContent.trim();
        const parts = raw.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
        if (!parts) return;

        const prefix = parts[1];
        const end = parseFloat(parts[2]);
        const suffix = parts[3];
        const decimals = (parts[2].split('.')[1] || '').length;
        if (!end) return;

        const steps = Math.max(1, Math.round(duration / 16));
        const increment = end / steps;
        let current = 0;

        const render = value => {
            element.textContent = prefix + value.toFixed(decimals) + suffix;
        };

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = raw;
                clearInterval(timer);
            } else {
                render(current);
            }
        }, 16);
    }

    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
});
