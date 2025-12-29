// ============================================
// GenAI Roadmap - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // Mobile Navigation
    // ============================================

    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    function toggleSidebar(e) {
        // Prevent event from bubbling immediately to document listener
        if (e) e.stopPropagation();
        sidebar.classList.toggle('active');
        sidebarToggle.classList.toggle('button-hidden');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);

        // Hover Logic (Desktop)
        let hoverTimeout;

        const openSidebar = () => {
            clearTimeout(hoverTimeout);
            sidebar.classList.add('active');
            sidebarToggle.classList.add('button-hidden');
        };

        const closeSidebar = () => {
            hoverTimeout = setTimeout(() => {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('button-hidden');
            }, 300); // 300ms grace period to move mouse to sidebar
        };

        // Open on hover of toggle
        sidebarToggle.addEventListener('mouseenter', openSidebar);
        sidebarToggle.addEventListener('mouseleave', closeSidebar);

        // Keep open while hovering sidebar
        sidebar.addEventListener('mouseenter', openSidebar);
        sidebar.addEventListener('mouseleave', closeSidebar);
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function (e) {
        // Only run this check if sidebar is actually active
        if (sidebar.classList.contains('active')) {
            // If click is NOT on sidebar and NOT on the toggle button
            if (!sidebar.contains(e.target) && (!sidebarToggle || !sidebarToggle.contains(e.target))) {
                sidebar.classList.remove('active');
                if (sidebarToggle) sidebarToggle.classList.remove('button-hidden');
            }
        }
    });

    // Close sidebar when clicking a link (Autohide)
    const navLinks = document.querySelectorAll('.nav-link, .nav-sublist a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    // Close on all screen sizes
                    sidebar.classList.remove('active');
                    if (sidebarToggle) sidebarToggle.classList.remove('button-hidden');
                });
            });
        });
    });

    // ============================================
    // Active Navigation Highlight
    // ============================================

    const sections = document.querySelectorAll('section[id], article[id]');
    const allNavLinks = document.querySelectorAll('.nav-link, .nav-sublist a');

    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ============================================
    // Smooth Scroll with Offset
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
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

    // ============================================
    // Scroll Progress Indicator
    // ============================================

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);

    // ============================================
    // Code Block Copy Functionality
    // ============================================

    document.querySelectorAll('pre').forEach(pre => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 12px;
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.5);
            border-radius: 4px;
            color: #b8b8c8;
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        pre.style.position = 'relative';
        pre.appendChild(copyBtn);

        pre.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });

        copyBtn.addEventListener('click', async () => {
            const code = pre.querySelector('code')?.textContent || pre.textContent;
            try {
                await navigator.clipboard.writeText(code);
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = 'rgba(34, 197, 94, 0.2)';
                copyBtn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                    copyBtn.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px 200px 0px', // Trigger 200px BEFORE element enters viewport
        threshold: 0 // Trigger as soon as one pixel is within the margin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedSelectors = [
        '.layer-section',
        '.toc-card',
        '.info-card',
        '.benefit-card',
        '.section-header',
        '.content-block p', // Animate loose paragraphs too
        '.styled-list li',
        '.check-list li'
    ];

    const elementsToAnimate = document.querySelectorAll(animatedSelectors.join(', '));

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');

        // Simple heuristic for staggering: 
        // If element is part of a grid/list, check its index relative to siblings
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('bento-grid') || parent.tagName === 'UL' || parent.classList.contains('toc-grid'))) {
            const indexInParent = Array.from(parent.children).indexOf(el);
            const delay = (indexInParent % 5) * 100; // Cap stagger at 5 items to avoid huge delays
            if (delay > 0) el.style.transitionDelay = `${delay}ms`;
        }

        observer.observe(el);
    });

    // ============================================
    // Table of Contents Highlighting
    // ============================================

    const tocCards = document.querySelectorAll('.toc-card');
    tocCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });

    // ============================================
    // Layer Stack Animation
    // ============================================

    const layerItems = document.querySelectorAll('.layer-item');
    layerItems.forEach((item, index) => {
        item.style.animationDelay = `${(8 - index) * 0.1}s`;
    });

    // ============================================
    // Search Functionality (Future Enhancement)
    // ============================================

    // Placeholder for search functionality
    function performSearch(query) {
        // This could be enhanced to search through content
        console.log('Search query:', query);
    }

    // ============================================
    // Dark/Light Mode Toggle (Future Enhancement)
    // ============================================

    // ============================================
    // Dark/Light Mode Toggle
    // ============================================

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = 'dark_mode'; // Icon for switching TO dark mode
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = 'light_mode'; // Icon for switching TO light mode
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Initialize
    const savedTheme = localStorage.getItem('theme');
    const systemicTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemicTheme === 'light') {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    document.addEventListener('keydown', function (e) {
        // Press 'S' to toggle sidebar on desktop
        if (e.key === 's' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            // Toggle sidebar if needed
        }

        // Press 'T' to scroll to top
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Press '?' to show keyboard shortcuts (future enhancement)
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            // Show keyboard shortcuts modal
        }
    });

    // ============================================
    // Back to Top Button
    // ============================================

    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    `;
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'scale(1.1)';
    });

    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'scale(1)';
    });

    // ============================================
    // Console Easter Egg
    // ============================================

    console.log('%c🧠 GenAI Roadmap', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cAn Exhaustive Reference Guide to Generative AI', 'font-size: 14px; color: #b8b8c8;');
    console.log('%c─────────────────────────────────────────', 'color: #3a3a4e;');
    console.log('%c8 Layers • 4 Dimensions • 100+ Resources', 'font-size: 12px; color: #8b5cf6;');
});
