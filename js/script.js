// ===== KGL MANAGEMENT — ULTRA PREMIUM JAVASCRIPT =====
(function() {
    'use strict';

    // ===== CONFIG =====
    const CONFIG = {
        scrollThreshold: 50,
        stickyCtaThreshold: 800,
        backToTopThreshold: 500,
        toastDuration: 5000,
        testimonialInterval: 6000,
        counterDuration: 2000,
        magneticStrength: 0.3,
        cursorSmoothness: 0.15,
        maxUploadBytes: 25 * 1024 * 1024
    };
    const MAX_UPLOAD_BYTES = CONFIG.maxUploadBytes;

    // ===== STATE =====
    let state = {
        isMenuOpen: false,
        isDarkMode: false,
        currentTestimonial: 0,
        testimonialInterval: null,
        lastScrollY: 0,
        headerHidden: false,
        cursorX: 0,
        cursorY: 0,
        followerX: 0,
        followerY: 0
    };

    // ===== DOM ELEMENTS =====
    const DOM = {
        preloader: document.getElementById('preloader'),
        header: document.getElementById('header'),
        menuToggle: document.getElementById('menuToggle'),
        navMenu: document.getElementById('navMenu'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        scrollProgress: document.getElementById('scroll-progress'),
        backToTop: document.getElementById('back-to-top'),
        stickyCta: document.getElementById('stickyCta'),
        cursor: document.getElementById('cursor'),
        cursorFollower: document.getElementById('cursor-follower'),
        toastContainer: document.getElementById('toast-container'),
        testimonialsTrack: document.getElementById('testimonialsTrack'),
        testimonialsDots: document.querySelectorAll('.testimonials-dots .dot'),
        testimonialPrev: document.querySelector('.testimonial-prev'),
        testimonialNext: document.querySelector('.testimonial-next'),
        animateElements: document.querySelectorAll('[data-animate]'),
        statNumbers: document.querySelectorAll('.stat-number[data-target], .counter[data-target]'),
        magneticBtns: document.querySelectorAll('.magnetic-btn'),
        heroLabels: document.querySelectorAll('.hero-content [data-animate]')
    };

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', init);

    // Chaque module est isole : un module qui throw ne doit pas empecher les
    // suivants de s'initialiser. errors[] permet de les journaliser.
    const errors = [];
    function safe(name, fn) {
        try {
            fn();
        } catch (err) {
            errors.push(name + ': ' + err.message);
            if (window.console) console.warn('[KGL] module "' + name + '" ignore ->', err);
        }
    }

    function init() {
        // Le garde-fou doit etre installe EN PREMIER : si un module plus bas
        // echoue, le contenu reste revele.
        installFailsafe();

        safe('preloader', handlePreloader);

        safe('customCursor', initCustomCursor);

        // Header & scroll effects
        safe('header', initHeader);
        safe('scrollProgress', initScrollProgress);
        safe('backToTop', initBackToTop);
        safe('stickyCta', initStickyCta);
        safe('headerHideOnScroll', initHeaderHideOnScroll);

        // Menu
        safe('mobileMenu', initMobileMenu);

        // Dark mode handled by premium-upgrades.js

        // Animations
        safe('scrollAnimations', initScrollAnimations);
        safe('counterAnimations', initCounterAnimations);
        safe('heroAnimations', initHeroAnimations);

        // Testimonials carousel
        safe('testimonials', initTestimonials);

        // Magnetic buttons
        safe('magneticButtons', initMagneticButtons);

        // Depliant « En savoir plus » (cartes services de l'accueil)
        safe('serviceDetails', initServiceDetails);

        // Modale « Voir la fiche complète » : une seule fiche a l'ecran
        safe('ficheModal', initFicheModal);

        // services.html : seule la fiche demandee s'affiche
        safe('ficheFilter', initFicheFilter);

        // Text scramble
        safe('textScramble', initTextScramble);

        // Smooth scroll
        safe('smoothScroll', initSmoothScroll);

        // Active nav link
        safe('activeNavLink', initActiveNavLink);

        // Form handling
        safe('forms', initForms);

        // Parallax
        safe('parallax', initParallax);

        if (errors.length && window.console) {
            console.warn('[KGL] ' + errors.length + ' module(s) degrade(s) :', errors);
        }
    }

    // ===== FAILSAFE =====
    // Sans JS, le <noscript> du <head> revele la page. Mais si le JS s'execute
    // puis echoue (CDN bloque, script interrompu par une extension, exception),
    // le preloader (#preloader, position:fixed inset:0) reste affiche et les
    // elements [data-animate] restent a opacity:0 => page blanche.
    // Ce garde-fou garantit que le contenu apparait toujours.
    function revealContent() {
        if (DOM.preloader && !DOM.preloader.classList.contains('hidden')) {
            DOM.preloader.classList.add('hidden');
            DOM.heroLabels.forEach(el => el.classList.add('animate'));
        }
        // Filet supplementaire : si l'IntersectionObserver n'a rien anime
        // (contenu deja visible a l'ecran au chargement), on affiche tout.
        if (!document.querySelector('[data-animate].animate')) {
            document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animate'));
        }
    }

    function installFailsafe() {
        // Filet dur : 6 s apres DOMContentLoaded, on revele quoi qu'il arrive.
        setTimeout(revealContent, 6000);
        // Si une erreur survient, on revele rapidement plutot que d'afficher du vide.
        window.addEventListener('error', () => setTimeout(revealContent, 100));
        window.addEventListener('unhandledrejection', () => setTimeout(revealContent, 100));
    }

    // ===== PRELOADER =====
    function handlePreloader() {
        if (!DOM.preloader) return;

        const minLoadTime = 1500;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minLoadTime - elapsed);

            setTimeout(revealContent, remaining);
        });

        // Fallback : window.load peut ne jamais fire si une ressource externe
        // reste bloquee (video mixkit.co, images i.ibb.co). Sans cette branche,
        // le preloader resterait affiche indefiniment.
        setTimeout(revealContent, 4000);
    }

    // ===== CUSTOM CURSOR =====
    function initCustomCursor() {
        if (!DOM.cursor || !DOM.cursorFollower) return;
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

        let rafId = null;
        let isMoving = false;
        let mouseTimeout = null;

        document.addEventListener('mousemove', (e) => {
            state.cursorX = e.clientX;
            state.cursorY = e.clientY;

            if (!isMoving) {
                isMoving = true;
                animateCursor();
            }

            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMoving = false;
                cancelAnimationFrame(rafId);
            }, 100);
        });

        function animateCursor() {
            if (!isMoving) return;

            DOM.cursor.style.left = state.cursorX + 'px';
            DOM.cursor.style.top = state.cursorY + 'px';

            state.followerX += (state.cursorX - state.followerX) * CONFIG.cursorSmoothness;
            state.followerY += (state.cursorY - state.followerY) * CONFIG.cursorSmoothness;

            DOM.cursorFollower.style.left = state.followerX + 'px';
            DOM.cursorFollower.style.top = state.followerY + 'px';

            rafId = requestAnimationFrame(animateCursor);
        }

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .service-card, .project-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => DOM.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => DOM.cursor.classList.remove('hover'));
        });
    }

    // ===== HEADER =====
    function initHeader() {
        if (!DOM.header) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    DOM.header.classList.toggle('scrolled', window.scrollY > CONFIG.scrollThreshold);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function initHeaderHideOnScroll() {
        if (!DOM.header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > lastScroll && currentScroll > 200) {
                // Scrolling down
                DOM.header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                DOM.header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }, { passive: true });

        DOM.header.style.transition = 'transform 0.3s ease, background 0.3s ease, padding 0.3s ease';
    }

    // ===== SCROLL PROGRESS =====
    function initScrollProgress() {
        if (!DOM.scrollProgress) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            DOM.scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // ===== BACK TO TOP =====
    function initBackToTop() {
        if (!DOM.backToTop) return;

        window.addEventListener('scroll', () => {
            DOM.backToTop.classList.toggle('visible', window.scrollY > CONFIG.backToTopThreshold);
        }, { passive: true });

        DOM.backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== STICKY CTA =====
    function initStickyCta() {
        if (!DOM.stickyCta) return;

        window.addEventListener('scroll', () => {
            DOM.stickyCta.classList.toggle('visible', window.scrollY > CONFIG.stickyCtaThreshold);
        }, { passive: true });
    }

    // ===== MOBILE MENU =====
    function initMobileMenu() {
        if (!DOM.menuToggle || !DOM.navMenu) return;

        const toggleMenu = () => {
            state.isMenuOpen = !state.isMenuOpen;
            DOM.navMenu.classList.toggle('active', state.isMenuOpen);
            DOM.menuToggle.classList.toggle('active', state.isMenuOpen);
            DOM.menuToggle.setAttribute('aria-expanded', state.isMenuOpen);
            document.body.classList.toggle('menu-open', state.isMenuOpen);
        };

        DOM.menuToggle.addEventListener('click', toggleMenu);

        // Close on link click (dropdown parents navigate normally on mobile)
        DOM.navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) toggleMenu();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (state.isMenuOpen && 
                !DOM.navMenu.contains(e.target) && 
                !DOM.menuToggle.contains(e.target)) {
                toggleMenu();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) toggleMenu();
        });
    }

    // ===== DARK MODE =====
    function initDarkMode() {
        if (!DOM.darkModeToggle) return;

        // Refonte institutionnelle : le CLAIR est le thème par défaut.
        // On respecte uniquement un choix explicite de l'utilisateur.
        const savedTheme = localStorage.getItem('kgl-theme');

        if (savedTheme === 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }

        DOM.darkModeToggle.addEventListener('click', () => {
            state.isDarkMode ? disableDarkMode() : enableDarkMode();
        });
    }

    function enableDarkMode() {
        state.isDarkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('kgl-theme', 'dark');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0A1F47');
        if (DOM.darkModeToggle) {
            DOM.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            DOM.darkModeToggle.setAttribute('aria-label', 'Activer le mode clair');
        }
    }

    function disableDarkMode() {
        state.isDarkMode = false;
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('kgl-theme', 'light');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#17418A');
        if (DOM.darkModeToggle) {
            DOM.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            DOM.darkModeToggle.setAttribute('aria-label', 'Activer le mode sombre');
        }
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        if (!DOM.animateElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, delay * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        DOM.animateElements.forEach(el => observer.observe(el));
    }

    // ===== COUNTER ANIMATIONS =====
    function initCounterAnimations() {
        if (!DOM.statNumbers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        DOM.statNumbers.forEach(el => observer.observe(el));
    }

    function animateCounter(element, target) {
        const duration = CONFIG.counterDuration;
        const start = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(startValue + (target - startValue) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ===== HERO ANIMATIONS =====
    function initHeroAnimations() {
        // Triggered by preloader removal
    }

    // ===== TESTIMONIALS =====
    function initTestimonials() {
        if (!DOM.testimonialsTrack) return;

        const slides = DOM.testimonialsTrack.children;
        const totalSlides = slides.length;

        if (totalSlides <= 1) return;

        function goToSlide(index) {
            state.currentTestimonial = index;
            DOM.testimonialsTrack.style.transform = `translateX(-${index * 100}%)`;

            DOM.testimonialsDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            goToSlide((state.currentTestimonial + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((state.currentTestimonial - 1 + totalSlides) % totalSlides);
        }

        // Auto-play
        state.testimonialInterval = setInterval(nextSlide, CONFIG.testimonialInterval);

        // Manual navigation
        if (DOM.testimonialNext) {
            DOM.testimonialNext.addEventListener('click', () => {
                clearInterval(state.testimonialInterval);
                nextSlide();
                state.testimonialInterval = setInterval(nextSlide, CONFIG.testimonialInterval);
            });
        }

        if (DOM.testimonialPrev) {
            DOM.testimonialPrev.addEventListener('click', () => {
                clearInterval(state.testimonialInterval);
                prevSlide();
                state.testimonialInterval = setInterval(nextSlide, CONFIG.testimonialInterval);
            });
        }

        DOM.testimonialsDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(state.testimonialInterval);
                goToSlide(index);
                state.testimonialInterval = setInterval(nextSlide, CONFIG.testimonialInterval);
            });
        });

        // Pause on hover
        DOM.testimonialsTrack.addEventListener('mouseenter', () => {
            clearInterval(state.testimonialInterval);
        });

        DOM.testimonialsTrack.addEventListener('mouseleave', () => {
            state.testimonialInterval = setInterval(nextSlide, CONFIG.testimonialInterval);
        });
    }

    // ===== MAGNETIC BUTTONS =====
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

        DOM.magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * CONFIG.magneticStrength}px, ${y * CONFIG.magneticStrength}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===== "EN SAVOIR PLUS" — n'affiche que la zone demandee =====
    // Principe : un seul panneau ouvert a la fois, partout sur le site.
    // Declencheur : [aria-controls] + aria-expanded (un <a> ou un <button>).
    // Cible      : .service-detail / .disclosure-panel.
    // Sans JS, chaque lien garde sa navigation d'origine.
    function initServiceDetails() {
        const pairs = [];

        document.querySelectorAll('[aria-controls]').forEach((trigger) => {
            const id = trigger.getAttribute('aria-controls');
            const panel = id ? document.getElementById(id) : null;
            if (!panel) return;
            if (!panel.classList.contains('service-detail') &&
                !panel.classList.contains('disclosure-panel')) return;
            pairs.push({ trigger: trigger, panel: panel });
        });

        if (!pairs.length) return;

        const isOpen = (pair) => pair.panel.classList.contains('is-open');

        const close = (pair) => {
            pair.panel.classList.remove('is-open');
            pair.trigger.setAttribute('aria-expanded', 'false');

            const card = pair.panel.closest('.service-card');
            if (card) card.classList.remove('is-open');

            const grid = pair.panel.closest('.services-grid');
            if (grid && !grid.querySelector('.service-detail.is-open, .disclosure-panel.is-open')) {
                grid.classList.remove('has-detail-open');
            }
        };

        const closeAll = () => pairs.forEach(close);

        pairs.forEach((pair) => {
            pair.trigger.addEventListener('click', (event) => {
                // Clic + modificateur (nouvel onglet) : on laisse le navigateur faire.
                if (event.ctrlKey || event.metaKey || event.shiftKey ||
                    event.altKey || event.button !== 0) return;

                event.preventDefault();

                const willOpen = !isOpen(pair);
                closeAll();

                if (willOpen) {
                    pair.panel.classList.add('is-open');
                    pair.trigger.setAttribute('aria-expanded', 'true');

                    const card = pair.panel.closest('.service-card');
                    if (card) card.classList.add('is-open');

                    const grid = pair.panel.closest('.services-grid');
                    if (grid) grid.classList.add('has-detail-open');
                }
            });
        });

        // Echap referme le dernier panneau ouvert et rend la main au declencheur
        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            // La modale a sa propre gestion d'Echap.
            if (document.querySelector('.fiche-modal.is-open')) return;

            const open = pairs.filter(isOpen);
            if (!open.length) return;

            const last = open[open.length - 1];
            close(last);
            if (last.trigger && document.contains(last.trigger)) last.trigger.focus();
        });
    }

    // ===== "VOIR LA FICHE COMPLETE" — une seule fiche a l'ecran =====
    // La modale contient les 7 fiches ; seules celles qui portent
    // .is-active sont affichees, toutes les autres restent en display:none.
    function initFicheModal() {
        const modal = document.getElementById('ficheModal');
        if (!modal) return;

        const fiches = Array.prototype.slice.call(modal.querySelectorAll('.fiche'));
        const closeBtn = modal.querySelector('.fiche-modal-close');
        let lastFocus = null;

        const select = (id) => {
            let found = false;
            fiches.forEach((fiche) => {
                const on = fiche.getAttribute('data-fiche-id') === id;
                fiche.classList.toggle('is-active', on);
                if (on) found = true;
            });
            return found;
        };

        const lockScroll = (on) => {
            try {
                const lenis = window.lenis || window.__lenis;
                if (lenis && typeof lenis.stop === 'function') {
                    if (on) lenis.stop();
                    else lenis.start();
                }
            } catch (err) { /* Lenis absent : overflow:hidden suffit */ }
        };

        const open = (id, trigger) => {
            if (!select(id)) return false;
            lastFocus = trigger || document.activeElement;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.documentElement.classList.add('fiche-modal-open');
            lockScroll(true);
            if (closeBtn) closeBtn.focus();
            return true;
        };

        const close = () => {
            if (!modal.classList.contains('is-open')) return;
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.documentElement.classList.remove('fiche-modal-open');
            lockScroll(false);
            fiches.forEach((fiche) => fiche.classList.remove('is-active'));
            if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
            lastFocus = null;
        };

        document.querySelectorAll('[data-fiche]').forEach((trigger) => {
            trigger.addEventListener('click', (event) => {
                if (event.ctrlKey || event.metaKey || event.shiftKey ||
                    event.altKey || event.button !== 0) return;

                const id = trigger.getAttribute('data-fiche');
                if (!id) return;

                event.preventDefault();
                open(id, trigger);
            });
        });

        modal.querySelectorAll('[data-fiche-close]').forEach((el) => {
            el.addEventListener('click', close);
        });

        document.addEventListener('keydown', (event) => {
            if (!modal.classList.contains('is-open')) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                close();
                return;
            }

            if (event.key !== 'Tab') return;

            const active = modal.querySelector('.fiche.is-active');
            const focusables = [];
            if (closeBtn) focusables.push(closeBtn);
            if (active) {
                active.querySelectorAll('a[href], button:not([disabled])').forEach((el) => {
                    focusables.push(el);
                });
            }
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    // ===== SERVICES.HTML — seule la fiche demandee s'affiche =====
    // Repli sans JavaScript ET cas du clic ctrl/maj (nouvel onglet) :
    // services.html#audit n'affiche que la fiche « audit ».
    function initFicheFilter() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        const bar = document.getElementById('ficheFilterBar');
        const resetBtn = document.getElementById('showAllFiches');
        const cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card-large[id]'));

        const reset = () => {
            grid.classList.remove('is-filtered');
            if (bar) bar.classList.remove('is-visible');
            cards.forEach((card) => card.classList.remove('is-selected'));
        };

        const apply = (id) => {
            const target = id ? cards.filter((card) => card.id === id)[0] : null;
            if (!target) {
                reset();
                return false;
            }
            grid.classList.add('is-filtered');
            if (bar) bar.classList.add('is-visible');
            cards.forEach((card) => card.classList.toggle('is-selected', card === target));
            return true;
        };

        const fromHash = () => {
            const id = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
            apply(id);
        };

        fromHash();
        window.addEventListener('hashchange', fromHash);

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                reset();
                if (location.hash) {
                    try {
                        history.replaceState(null, '', location.pathname + location.search);
                    } catch (err) { /* file:// : on ignore */ }
                }
            });
        }
    }

    // ===== TEXT SCRAMBLE =====
    function initTextScramble() {
        const scrambleElements = document.querySelectorAll('.text-scramble');
        const chars = '!<>-_\/[]{}—=+*^?#________';

        scrambleElements.forEach(el => {
            const originalText = el.dataset.text || el.textContent;
            let iteration = 0;

            const scramble = () => {
                el.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration < originalText.length) {
                    iteration += 1/3;
                    requestAnimationFrame(scramble);
                } else {
                    el.textContent = originalText;
                }
            };

            // Start after preloader
            setTimeout(scramble, 2000);
        });
    }

    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
    if (window.lenis || document.documentElement.hasAttribute('data-lenis') || window.isLenisActive) return;
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = DOM.header ? DOM.header.offsetHeight : 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== ACTIVE NAV LINK =====
    function initActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===== FORMS =====
    function initForms() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        validateField(input);
                    }
                });
            });

            // Affichage du nom de fichier + garde-fou taille (Formspree : 25 Mo/fichier)
            form.querySelectorAll('input[type="file"]').forEach(fileInput => {
                const out = form.querySelector('.file-name');
                fileInput.addEventListener('change', () => {
                    const file = fileInput.files && fileInput.files[0];
                    if (!out) return;

                    if (!file) {
                        out.textContent = '';
                        return;
                    }
                    if (file.size > MAX_UPLOAD_BYTES) {
                        out.textContent = tr('ui.err.fileSize', 'Fichier trop volumineux (max 25 Mo).');
                        out.style.color = '#ef4444';
                        fileInput.value = '';
                        showToast(tr('ui.err.fileSize', 'Fichier trop volumineux (max 25 Mo).'), 'error');
                        return;
                    }
                    out.style.color = '';
                    out.textContent = file.name;
                });
            });

            // Submit
            form.addEventListener('submit', handleFormSubmit);
        });
    }

    function validateField(field) {
        // Les champs fichier sont ignorés : leur "value" est un chemin factice
        // (C:\fakepath\...) et leur validation est gérée par l'attribut accept/maxlength.
        if (field.type === 'file') return true;

        const value = (field.value || '').trim();
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = tr('ui.err.required');
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            message = tr('ui.err.email');
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
            message = tr('ui.err.phone');
        }

        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid && !!value);

        // Supprime le message d'erreur précédent
        const holder = field.closest('.form-group, .luxury-field, .field') || field.parentElement;
        const existingError = holder ? holder.querySelector('.field-error') : null;
        if (existingError) existingError.remove();

        if (!isValid && holder) {
            const errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.textContent = message;
            holder.appendChild(errorEl);
        }

        return isValid;
    }

    // Traduit via le système i18n si disponible, sinon renvoie le fallback
    function tr(key, fallback) {
        const lang = window.KGL_i18n?.getLang?.() || 'fr';
        return window.KGL_i18n?.t?.(key, lang) || fallback;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;

        // Honeypot : si un robot a rempli le champ invisible, on sort en silence
        // (aucun envoi, aucun message — le robot ne doit rien apprendre).
        const honey = form.querySelector('[name="_gotcha"]');
        if (honey && honey.value) {
            form.reset();
            return;
        }

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let allValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) allValid = false;
        });

        if (!allValid) {
            showToast(tr('ui.err.form', 'Veuillez corriger les erreurs dans le formulaire'), 'error');
            const firstBad = form.querySelector('.error');
            if (firstBad) firstBad.focus();
            return;
        }

        // Demo login form (no backend): never leak credentials to mailto
        if (form.querySelector('input[type="password"]') && !form.getAttribute('action')) {
            showToast("Espace client en mode démonstration : la connexion sera bientôt disponible.", 'info');
            return;
        }

        // Prevent double submit
        if (form.classList.contains('is-submitting')) return;
        form.classList.add('is-submitting');

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn ? submitBtn.innerText : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                `<span class="btn-spinner"></span> ${tr('ui.sending', 'Envoi...')}`;
        }

        // formData conserve les File pour l'upload ; data est la version "texte"
        // utilisée pour le fallback mailto et l'objet du message.
        const formData = new FormData(form);

        // Permet de répondre directement au candidat/visiteur depuis l'e-mail reçu
        const replyTo = formData.get('email');
        if (replyTo && isValidEmail(String(replyTo).trim())) {
            formData.set('_replyto', String(replyTo).trim());
        }
        formData.set('_subject', buildSubject(form, formData));

        const action = form.getAttribute('action');
        if (action && action.includes('formspree')) {
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    showToast(tr('ui.ok.sent', 'Message envoyé avec succès ! Nous vous répondrons sous 24h.'), 'success');
                    form.reset();
                    clearFileName(form);
                } else {
                    throw new Error('Erreur serveur');
                }
            })
            .catch(() => {
                // Formspree injoignable → on ne perd pas la candidature
                fallbackToMailto(form, flatten(formData), action);
            })
            .finally(() => {
                resetFormState(form, submitBtn, originalText);
            });
        } else {
            fallbackToMailto(form, flatten(formData), action);
            resetFormState(form, submitBtn, originalText);
        }
    }

    // Transforme un FormData en objet texte : les fichiers deviennent leur nom.
    function flatten(formData) {
        const out = {};
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('_')) continue;
            out[key] = (value instanceof File)
                ? (value.name ? `[CV joint : ${value.name}]` : '')
                : value;
        }
        return out;
    }

    // Libellés lisibles pour le fallback mailto
    const FIELD_LABELS = {
        nom: 'Nom', email: 'Email', telephone: 'Téléphone',
        sujet: 'Sujet', message: 'Message', profil: 'Type de profil',
        cv: 'CV', company: 'Société', phone: 'Téléphone'
    };

    function buildSubject(form, formData) {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        if (form.id === 'careerForm') {
            const profil = formData.get('profil');
            return `Candidature spontanée${profil ? ` — ${profil}` : ''}`;
        }
        const sujet = formData.get('sujet');
        if (sujet) return `${sujet} — ${page}`;
        return `Contact depuis ${page}`;
    }

    function fallbackToMailto(form, data, action) {
        // Un formulaire avec piece jointe ne peut pas transiter par mailto :
        // on le signale clairement plutot que d'envoyer un message vide.
        const hasFile = !!form.querySelector('input[type="file"]');
        const anyFileSelected = Array.from(form.querySelectorAll('input[type="file"]'))
            .some(i => i.files && i.files.length > 0);

        const subject = buildSubject(form, new FormData(form));
        const lines = [];
        for (const [key, value] of Object.entries(data)) {
            const label = FIELD_LABELS[key] || key;
            if (value === '' || value == null) continue;
            lines.push(`${label}: ${value}`);
        }
        if (hasFile) {
            lines.push('');
            lines.push(anyFileSelected
                ? "⚠ La piece jointe n'a pas pu etre transferee par cette methode :Merci de renvoyer votre CV par e-mail ou WhatsApp."
                : 'CV : non fourni.');
        }
        lines.push('', '---', 'Envoye depuis le site web KGL MANAGEMENT');

        const body = encodeURIComponent(lines.join('\n'));
        window.location.href =
            `mailto:contact@kglmanagement.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        showToast(anyFileSelected
            ? tr('ui.ok.mailtoFile', "Votre messagerie va s'ouvrir. Merci de joindre manuellement votre CV.")
            : tr('ui.ok.mailto', "Votre client email va s'ouvrir pour finaliser l'envoi"), 'info');

        form.reset();
        clearFileName(form);
        // Le paramètre action reste dispo pour un diagnostic ultérieur
        if (action) form.dataset.lastAction = action;
    }

    // Vide l'affichage du nom de fichier après reset()
    function clearFileName(form) {
        const out = form.querySelector('.file-name');
        if (out) out.textContent = '';
    }

    function resetFormState(form, btn, originalText) {
        form.classList.remove('is-submitting');
        if (btn) {
            btn.disabled = false;
            // innerHTML (et non innerText) pour retirer proprement le spinner
            btn.innerHTML = originalText;
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\d\s\+\-\.\(\)]{8,20}$/.test(phone);
    }

    // ===== TOAST SYSTEM =====
    function showToast(message, type = 'info', title = '') {
        if (!DOM.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const titles = {
            success: 'Succès',
            error: 'Erreur',
            warning: 'Attention',
            info: 'Information'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title || titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Fermer"><i class="fas fa-times"></i></button>
        `;

        DOM.toastContainer.appendChild(toast);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            removeToast(toast);
        });

        // Auto remove
        setTimeout(() => removeToast(toast), CONFIG.toastDuration);
    }

    function removeToast(toast) {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }

    // ===== PARALLAX =====
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero-video-container, .about-image-frame');

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    parallaxElements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const speed = 0.3;
                            el.style.transform = `translateY(${scrollY * speed}px)`;
                        }
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== EXPOSE TOAST GLOBALLY =====
    window.showToast = showToast;

})();