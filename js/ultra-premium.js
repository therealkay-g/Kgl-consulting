// ===== KGL MANAGEMENT — ULTRA PREMIUM ENGINE =====
// Lenis smooth scroll, 3D Tilt cards, Glassmorphism header,
// Staggered text reveals, Magnetic cursor V2, Parallax depth
(function () {
  'use strict';

  // =========================================================
  // 1. LENIS — Ultra-Smooth Inertial Scroll
  // =========================================================
  function initLenisScroll() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js';
    script.onload = () => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
      });

      // Connect Lenis to requestAnimationFrame
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Expose for other scripts (scroll-to, etc.)
      window.__lenis = lenis;

      // Fix: allow anchor links to work with Lenis
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
          }
        });
      });
    };
    document.head.appendChild(script);
  }

  // =========================================================
  // 2. GLASSMORPHISM FLOATING HEADER (Pill-Style)
  // =========================================================
  function initGlassHeader() {
    const style = document.createElement('style');
    style.id = 'kgl-glass-header';
    style.textContent = `
      /* Glass Pill Header on Scroll */
      header.scrolled {
        background: rgba(10, 31, 71, 0.55) !important;
        backdrop-filter: blur(24px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
        border-bottom: 1px solid rgba(23, 65, 138, 0.08) !important;
        box-shadow:
          0 8px 32px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 1px 0 rgba(255, 255, 255, 0.04) inset !important;
      }

      [data-theme="light"] header.scrolled {
        background: rgba(248, 246, 241, 0.6) !important;
        backdrop-filter: blur(24px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
        box-shadow:
          0 8px 32px rgba(0, 0, 0, 0.08),
          0 0 0 1px rgba(255, 255, 255, 0.5) inset !important;
      }

      /* Pill shape when scrolled */
      header.scrolled .header-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 24px;
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }

      /* The header shrinks beautifully */
      header {
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      /* Nav links glow on hover */
      header.scrolled .nav-menu a:hover {
        color: var(--accent-gold) !important;
        text-shadow: 0 0 20px rgba(23, 65, 138, 0.3) !important;
      }

      /* Active link indicator */
      header.scrolled .nav-menu a.active::after {
        background: var(--accent-gold) !important;
        box-shadow: 0 0 8px rgba(23, 65, 138, 0.4);
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 3. 3D TILT EFFECT on Service Cards
  // =========================================================
  function initTiltCards() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.id = 'kgl-tilt-cards';
    style.textContent = `
      /* Tilt card wrapper */
      .service-card,
      .service-card-large,
      .sector-card,
      .commitment-card,
      .experience-card,
      .process-step {
        transform-style: preserve-3d;
        perspective: 1000px;
        will-change: transform;
      }

      /* Inner glow on hover */
      .service-card::after,
      .service-card-large::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
        z-index: 5;
        background: radial-gradient(
          600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          rgba(23, 65, 138, 0.06),
          transparent 40%
        );
      }

      .service-card:hover::after,
      .service-card-large:hover::after {
        opacity: 1;
      }

      /* Gradient border glow effect */
      .service-card.tilt-active,
      .service-card-large.tilt-active {
        border-color: transparent !important;
        background-clip: padding-box;
      }
    `;
    document.head.appendChild(style);

    const cards = document.querySelectorAll(
      '.service-card, .service-card-large, .sector-card, .commitment-card, .experience-card, .process-step'
    );

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
        card.classList.add('tilt-active');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.classList.remove('tilt-active');
      });

      card.style.transition = 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), border-color 0.3s ease';
    });
  }

  // =========================================================
  // 4. BENTO-STYLE SERVICE CARDS (Index Page)
  // =========================================================
  function initBentoServiceGrid() {
    const style = document.createElement('style');
    style.id = 'kgl-bento-services';
    style.textContent = `
      /* Bento Grid for Homepage Services */
      .services-grid {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        grid-auto-rows: minmax(240px, auto) !important;
        gap: 20px !important;
      }

      /* First card spans 2 cols */
      .services-grid .service-card:nth-child(1) {
        grid-column: span 2;
        grid-row: span 1;
      }
      /* Third card spans 2 rows */
      .services-grid .service-card:nth-child(3) {
        grid-row: span 2;
      }

      /* Glassmorphism on service cards */
      .service-card {
        background: rgba(30, 30, 30, 0.6) !important;
        backdrop-filter: blur(16px) saturate(160%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(160%) !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-radius: 20px !important;
        overflow: hidden !important;
        position: relative !important;
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      .service-card:hover {
        border-color: rgba(23, 65, 138, 0.25) !important;
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(23, 65, 138, 0.1) inset,
          0 1px 0 rgba(255, 255, 255, 0.06) inset !important;
        transform: translateY(-8px) !important;
      }

      /* Iridescent top border on hover */
      .service-card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 2px !important;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(23, 65, 138, 0.6),
          rgba(23, 65, 138, 0.6),
          rgba(23, 65, 138, 0.6),
          transparent
        ) !important;
        opacity: 0 !important;
        transition: opacity 0.4s ease !important;
        z-index: 10 !important;
      }

      .service-card:hover::before {
        opacity: 1 !important;
      }

      /* Service Icon refinement */
      .service-icon {
        margin-top: 0 !important;
        width: 56px !important;
        height: 56px !important;
        border-radius: 14px !important;
        background: linear-gradient(135deg, rgba(23, 65, 138,0.15) 0%, rgba(23, 65, 138,0.15) 100%) !important;
        border: 1px solid rgba(23, 65, 138, 0.2) !important;
        color: var(--accent-gold) !important;
        box-shadow: 0 8px 24px rgba(23, 65, 138, 0.1) !important;
      }

      .service-card:hover .service-icon {
        background: var(--gradient-primary) !important;
        color: #fff !important;
        border-color: transparent !important;
        box-shadow: 0 8px 32px rgba(23, 65, 138, 0.3) !important;
      }

      /* Light mode bento adjustments */
      [data-theme="light"] .service-card {
        background: rgba(255, 255, 255, 0.7) !important;
        backdrop-filter: blur(16px) saturate(160%) !important;
        border-color: rgba(0, 0, 0, 0.06) !important;
      }

      [data-theme="light"] .service-card:hover {
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(23, 65, 138, 0.3) !important;
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.08),
          0 0 0 1px rgba(23, 65, 138, 0.15) inset !important;
      }

      /* Service-card-large glassmorphism */
      .service-card-large {
        background: rgba(30, 30, 30, 0.5) !important;
        backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      .service-card-large:hover {
        border-color: rgba(23, 65, 138, 0.2) !important;
        box-shadow:
          0 24px 64px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(23, 65, 138, 0.08) inset !important;
        transform: translateY(-6px) !important;
      }

      .service-card-large::before {
        height: 2px !important;
        background: linear-gradient(
          90deg,
          transparent,
          var(--accent-gold),
          var(--accent-green-light),
          var(--accent-gold),
          transparent
        ) !important;
      }

      [data-theme="light"] .service-card-large {
        background: rgba(255, 255, 255, 0.65) !important;
        border-color: rgba(0, 0, 0, 0.06) !important;
      }

      [data-theme="light"] .service-card-large:hover {
        background: rgba(255, 255, 255, 0.9) !important;
      }

      /* Responsive bento */
      @media (max-width: 1024px) {
        .services-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          grid-auto-rows: auto !important;
        }
        .services-grid .service-card:nth-child(1) {
          grid-column: span 2;
        }
        .services-grid .service-card:nth-child(3) {
          grid-row: span 1;
        }
      }

      @media (max-width: 768px) {
        .services-grid {
          grid-template-columns: 1fr !important;
        }
        .services-grid .service-card:nth-child(1) {
          grid-column: span 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 5. STAGGERED TEXT REVEAL (Letter-by-letter for titles)
  // =========================================================
  function initStaggeredTextReveal() {
    const style = document.createElement('style');
    style.id = 'kgl-staggered-text';
    style.textContent = `
      .stagger-reveal .char {
        display: inline-block;
        opacity: 0;
        transform: translateY(40px) rotateX(-40deg);
        transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        transform-origin: bottom center;
      }

      .stagger-reveal .char.space {
        width: 0.3em;
      }

      .stagger-reveal.revealed .char {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
      }
    `;
    document.head.appendChild(style);

    // Only apply to section-title h2 elements (not hero)
    const titles = document.querySelectorAll('.section-title h2');
    titles.forEach(title => {
      if (title.closest('.hero-content')) return;

      const text = title.textContent;
      title.innerHTML = '';
      title.classList.add('stagger-reveal');

      let charIndex = 0;
      [...text].forEach(char => {
        const span = document.createElement('span');
        span.className = char === ' ' ? 'char space' : 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.transitionDelay = `${charIndex * 25}ms`;
        title.appendChild(span);
        charIndex++;
      });
    });

    // Observe and reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stagger-reveal').forEach(el => observer.observe(el));
  }

  // =========================================================
  // 6. ENHANCED PARALLAX DEPTH LAYERS
  // =========================================================
  function initParallaxDepth() {
    const style = document.createElement('style');
    style.id = 'kgl-parallax-depth';
    style.textContent = `
      /* Floating orbs for depth */
      .depth-orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(80px);
        opacity: 0.08;
        z-index: 0;
      }

      .impact-stats {
        position: relative;
        overflow: hidden;
      }

      .about-preview {
        position: relative;
        overflow: hidden;
      }

      .cta-section {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    // Add floating depth orbs to key sections
    const sections = document.querySelectorAll('.impact-stats, .about-preview, .cta-section');
    sections.forEach(section => {
      const orb1 = document.createElement('div');
      orb1.className = 'depth-orb';
      orb1.style.cssText = `
        width: 400px; height: 400px;
        background: var(--accent-gold);
        top: -100px; right: -100px;
      `;

      const orb2 = document.createElement('div');
      orb2.className = 'depth-orb';
      orb2.style.cssText = `
        width: 300px; height: 300px;
        background: var(--accent-green);
        bottom: -80px; left: -80px;
      `;

      section.appendChild(orb1);
      section.appendChild(orb2);
    });

    // Mouse-follow parallax on orbs
    if (!window.matchMedia('(hover: none)').matches) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        document.querySelectorAll('.depth-orb').forEach((orb, i) => {
          const speed = (i % 2 === 0) ? 20 : -15;
          orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
      });
    }
  }

  // =========================================================
  // 7. PREMIUM SCROLLBAR STYLING
  // =========================================================
  function initPremiumScrollbar() {
    const style = document.createElement('style');
    style.id = 'kgl-premium-scrollbar';
    style.textContent = `
      /* Hide default scrollbar when Lenis is active */
      html.lenis, html.lenis body {
        height: auto;
      }

      .lenis.lenis-smooth {
        scroll-behavior: auto !important;
      }

      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }

      .lenis.lenis-stopped {
        overflow: hidden;
      }

      .lenis.lenis-scrolling iframe {
        pointer-events: none;
      }

      /* Ultra-thin scrollbar */
      ::-webkit-scrollbar {
        width: 4px !important;
      }

      ::-webkit-scrollbar-track {
        background: transparent !important;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(
          to bottom,
          rgba(23, 65, 138, 0.4),
          rgba(23, 65, 138, 0.4)
        ) !important;
        border-radius: 999px !important;
        transition: background 0.3s !important;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(23, 65, 138, 0.7) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 8. ENHANCED GRAIN & FILM TEXTURE
  // =========================================================
  function initCinematicGrain() {
    const style = document.createElement('style');
    style.id = 'kgl-cinematic-grain';
    style.textContent = `
      /* Global animated grain overlay */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: 99990;
        pointer-events: none;
        opacity: 0.025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        background-size: 256px 256px;
        animation: grainShift 0.5s steps(4) infinite;
        mix-blend-mode: overlay;
      }

      @keyframes grainShift {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5%, -5%); }
        50% { transform: translate(5%, 0); }
        75% { transform: translate(0, 5%); }
      }

      /* Reduce grain in light mode */
      [data-theme="light"] body::before {
        opacity: 0.015;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 9. SECTION DIVIDER LINES (Premium separators)
  // =========================================================
  function initSectionDividers() {
    const style = document.createElement('style');
    style.id = 'kgl-section-dividers';
    style.textContent = `
      .premium-divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(23, 65, 138, 0.3) 20%,
          rgba(23, 65, 138, 0.5) 50%,
          rgba(23, 65, 138, 0.3) 80%,
          transparent 100%
        );
        margin: 0;
        border: none;
        position: relative;
      }

      .premium-divider::after {
        content: '';
        position: absolute;
        top: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background: var(--accent-gold);
        border-radius: 50%;
        box-shadow: 0 0 12px rgba(23, 65, 138, 0.4);
      }
    `;
    document.head.appendChild(style);

    // Insert premium dividers between major sections
    const sections = document.querySelectorAll('.section-padding, .impact-stats, .partners-section, .testimonials-section');
    sections.forEach((section, i) => {
      if (i === 0) return; // Skip first
      if (section.previousElementSibling && !section.previousElementSibling.classList.contains('premium-divider')) {
        const divider = document.createElement('hr');
        divider.className = 'premium-divider';
        section.parentNode.insertBefore(divider, section);
      }
    });
  }

  // =========================================================
  // 10. HOVER GLOW CURSOR TRAIL
  // =========================================================
  function initCursorGlow() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.id = 'kgl-cursor-glow';
    style.textContent = `
      #cursor-glow {
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(23, 65, 138, 0.04) 0%,
          transparent 70%
        );
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
      }

      body:hover #cursor-glow {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // =========================================================
  // 11. ANIMATED COUNTER UPGRADE (with comma formatting)
  // =========================================================
  function upgradeCounters() {
    const style = document.createElement('style');
    style.id = 'kgl-counter-upgrade';
    style.textContent = `
      .stat-number {
        font-variant-numeric: tabular-nums;
        background: linear-gradient(135deg, #FFFFFF 0%, rgba(23, 65, 138,0.9) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      [data-theme="light"] .stat-number {
        background: linear-gradient(135deg, #1A1A1A 0%, rgba(23, 65, 138,0.9) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-suffix {
        background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-green-light) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 12. PREMIUM BUTTON SHIMMER EFFECT
  // =========================================================
  function initButtonShimmer() {
    const style = document.createElement('style');
    style.id = 'kgl-btn-shimmer';
    style.textContent = `
      .btn-primary {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%) !important;
        border: 1px solid rgba(23, 65, 138, 0.2) !important;
      }

      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(23, 65, 138, 0.15),
          transparent
        );
        transition: none;
        animation: btnShimmer 3s ease-in-out infinite;
        z-index: 1;
      }

      .btn-primary span,
      .btn-primary i {
        position: relative;
        z-index: 2;
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, var(--accent-green-light) 0%, var(--accent-green) 100%) !important;
        border-color: rgba(23, 65, 138, 0.4) !important;
        box-shadow:
          0 8px 32px rgba(23, 65, 138, 0.3),
          0 0 0 1px rgba(23, 65, 138, 0.1) inset !important;
      }

      @keyframes btnShimmer {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }

      /* Outline button premium */
      .btn-outline {
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        backdrop-filter: blur(8px);
      }

      .btn-outline:hover {
        background: rgba(255, 255, 255, 0.08) !important;
        border-color: rgba(23, 65, 138, 0.5) !important;
        color: var(--accent-gold) !important;
        backdrop-filter: blur(12px);
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 13. HERO ENHANCEMENT — Vignette + Overlay refinement
  // =========================================================
  function enhanceHero() {
    const style = document.createElement('style');
    style.id = 'kgl-hero-enhance';
    style.textContent = `
      .hero-overlay {
        background:
          radial-gradient(ellipse at center, transparent 0%, rgba(10, 31, 71,0.5) 70%),
          linear-gradient(180deg, rgba(10, 31, 71,0.85) 0%, rgba(10, 31, 71,0.4) 40%, rgba(23, 65, 138,0.5) 100%) !important;
      }

      /* Subtle bottom edge glow */
      .hero::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(to top, var(--primary-bg), transparent);
        z-index: 4;
        pointer-events: none;
      }

      /* Scroll indicator pulse */
      .hero-scroll-indicator {
        z-index: 5;
      }

      .scroll-mouse {
        border-color: rgba(23, 65, 138, 0.4) !important;
      }

      .scroll-wheel {
        background: var(--accent-gold) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 14. SECTION LABEL ENHANCED STYLE
  // =========================================================
  function enhanceSectionLabels() {
    const style = document.createElement('style');
    style.id = 'kgl-section-labels';
    style.textContent = `
      .section-label {
        font-size: 0.7rem !important;
        letter-spacing: 0.25em !important;
        color: var(--accent-gold) !important;
        padding: 6px 16px 6px 16px !important;
        padding-left: calc(16px + 1.5rem) !important;
        background: rgba(23, 65, 138, 0.06) !important;
        border: 1px solid rgba(23, 65, 138, 0.12) !important;
        border-radius: 100px !important;
        backdrop-filter: blur(8px) !important;
      }

      .section-label::before {
        left: 16px !important;
        width: 12px !important;
        height: 2px !important;
        background: var(--accent-gold) !important;
      }

      [data-theme="light"] .section-label {
        background: rgba(23, 65, 138, 0.08) !important;
        border-color: rgba(23, 65, 138, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 15. PARTNERS SECTION — Refined infinite scroll
  // =========================================================
  function enhancePartnersSection() {
    const style = document.createElement('style');
    style.id = 'kgl-partners-enhanced';
    style.textContent = `
      .partners-section {
        background: var(--surface-bg) !important;
        border-top: 1px solid var(--glass-border);
        border-bottom: 1px solid var(--glass-border);
      }

      .partners-marquee::before {
        background: linear-gradient(to right, var(--surface-bg), transparent) !important;
      }

      .partners-marquee::after {
        background: linear-gradient(to left, var(--surface-bg), transparent) !important;
      }

      .partner-logo {
        opacity: 0.35 !important;
        filter: grayscale(1) brightness(1.5) !important;
        transition: all 0.5s ease !important;
      }

      .partner-logo:hover {
        opacity: 1 !important;
        filter: grayscale(0) brightness(1) !important;
        transform: scale(1.08);
      }

      [data-theme="light"] .partners-section {
        background: var(--surface-light) !important;
      }

      [data-theme="light"] .partners-marquee::before {
        background: linear-gradient(to right, var(--surface-light), transparent) !important;
      }

      [data-theme="light"] .partners-marquee::after {
        background: linear-gradient(to left, var(--surface-light), transparent) !important;
      }

      [data-theme="light"] .partner-logo {
        filter: grayscale(1) brightness(0.7) !important;
      }

      [data-theme="light"] .partner-logo:hover {
        filter: grayscale(0) brightness(1) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // 16. AI CHATBOT — Assistant KGL Premium
  // =========================================================
  function initAIChatbot() {
    if (document.getElementById('kgl-chatbot')) return;

    const lang = () => window.KGL_i18n?.getLang?.() || 'fr';
    const t = (key) => window.KGL_i18n?.t(key, lang()) || '';

    const chatbotHTML = `
      <div id="kgl-chatbot">
        <div class="chatbot-launcher" id="chatbotLauncher" role="button" aria-label="Assistant KGL IA" tabindex="0">
            <i class="fas fa-robot"></i>
            <span class="launcher-badge">IA</span>
        </div>
        <div class="chatbot-window" id="chatbotWindow" role="dialog" aria-label="Assistant KGL">
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fas fa-robot"></i>
                    <div>
                        <strong data-i18n="chat.assistant">Assistant KGL IA</strong>
                        <span class="status" data-i18n="chat.online">En ligne</span>
                    </div>
                </div>
                <button type="button" id="closeChatbot" aria-label="Fermer"><i class="fas fa-times"></i></button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages"></div>
            <div class="chatbot-input">
                <input type="text" id="chatbotInput" data-i18n-placeholder="chat.placeholder" placeholder="Posez votre question..." autocomplete="off">
                <button type="button" id="chatbotSend" aria-label="Envoyer"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const launcher = document.getElementById('chatbotLauncher');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChatbot');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const messages = document.getElementById('chatbotMessages');

    function renderGreeting() {
      const existing = messages.querySelector('.msg-greeting');
      if (existing) existing.remove();

      const greeting = document.createElement('div');
      greeting.className = 'msg bot msg-greeting';
      greeting.innerHTML = `
        <span class="greeting-text">${t('chat.greeting')}</span>
        <div class="bot-shortcuts">
          <button type="button" class="chat-shortcut" data-key="services">${t('chat.services')}</button>
          <button type="button" class="chat-shortcut" data-key="formations">${t('chat.training')}</button>
          <button type="button" class="chat-shortcut" data-key="contact">${t('chat.contact')}</button>
        </div>
      `;
      messages.insertBefore(greeting, messages.firstChild);
      bindShortcuts();
    }

    function bindShortcuts() {
      messages.querySelectorAll('.chat-shortcut').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          const labels = { services: t('chat.services'), formations: t('chat.training'), contact: t('chat.contact') };
          handleAsk(labels[key] || btn.textContent, key);
        });
      });
    }

    function addMessage(text, type = 'bot') {
      const msg = document.createElement('div');
      msg.className = `msg ${type}`;
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function getResponse(query, shortcutKey) {
      if (shortcutKey === 'services') return t('chat.r.services');
      if (shortcutKey === 'formations') return t('chat.r.training');
      if (shortcutKey === 'contact') return t('chat.r.contact');

      const q = query.toLowerCase();
      if (/service|expertise|offer|faites|propose/.test(q)) return t('chat.r.services');
      if (/formation|apprendre|train|academy|sage/.test(q)) return t('chat.r.training');
      if (/contact|joindre|reach|whatsapp|appel|devis/.test(q)) return t('chat.r.contact');
      if (/qui|fondateur|founder|ceo|lunkamba|john/.test(q)) return t('chat.r.who');
      if (/bonjour|hello|salut|hi/.test(q)) return t('chat.greeting');
      return t('chat.default');
    }

    function handleAsk(query, shortcutKey) {
      if (!query || !query.trim()) return;
      addMessage(query.trim(), 'user');

      setTimeout(() => {
        addMessage(getResponse(query, shortcutKey), 'bot');
      }, 500);
    }

    function toggleChat(open) {
      const isOpen = open !== undefined ? open : !chatWindow.classList.contains('active');
      chatWindow.classList.toggle('active', isOpen);
      launcher.classList.toggle('active', isOpen);
      if (isOpen) setTimeout(() => input.focus(), 300);
    }

    launcher.addEventListener('click', () => toggleChat());
    launcher.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleChat(); }
    });
    closeBtn.addEventListener('click', () => toggleChat(false));

    sendBtn.addEventListener('click', () => {
      handleAsk(input.value);
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAsk(input.value);
        input.value = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWindow.classList.contains('active')) toggleChat(false);
    });

    document.addEventListener('kgl:langchange', () => {
      const title = chatWindow.querySelector('.chatbot-title strong');
      const status = chatWindow.querySelector('.chatbot-title .status');
      if (title) title.textContent = t('chat.assistant');
      if (status) status.textContent = t('chat.online');
      if (input) input.placeholder = t('chat.placeholder');
      renderGreeting();
    });

    renderGreeting();
  }

  // =========================================================
  // 17. AMBIENT LIGHTING INJECTION
  // =========================================================
  function initAmbientLighting() {
    const glowTop = document.createElement('div');
    glowTop.className = 'ambient-glow-top';
    const glowBottom = document.createElement('div');
    glowBottom.className = 'ambient-glow-bottom';
    
    document.body.appendChild(glowTop);
    document.body.appendChild(glowBottom);
  }

  // =========================================================
  // MASTER INIT
  // =========================================================
  function init() {
    initLenisScroll();
    initGlassHeader();
    initBentoServiceGrid();
    initTiltCards();
    initStaggeredTextReveal();
    initParallaxDepth();
    initPremiumScrollbar();
    initCinematicGrain();
    initSectionDividers();
    initCursorGlow();
    upgradeCounters();
    initButtonShimmer();
    enhanceHero();
    enhanceSectionLabels();
    enhancePartnersSection();
    initAIChatbot();
    initAmbientLighting();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
