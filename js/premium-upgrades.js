// ===== KGL MANAGEMENT — PREMIUM UPGRADES =====
// Corrections: #3 polices, #4 transitions pages, #5 section processus,
// #6 section partenaires, #7 dark mode cohérent, #8 testimonials initiales,
// #10 grain CSS, #11 animations variées, #12 favicon SVG
(function () {
  'use strict';

  // =========================================================
  // CORRECTION #3 - POLICES (Cooper Hewitt auto-hebergee)
  // Injectées dynamiquement pour toutes les pages
  // =========================================================
  function injectPremiumFonts() {
    const existing = document.getElementById('kgl-premium-fonts');
    if (existing) return;
    // Refonte institutionnelle : Cooper Hewitt est auto-hebergee (fonts/).
    // On force une pile unique sur tous les elements pour un rendu homogene.
    const style = document.createElement('style');
    style.id = 'kgl-premium-font-override';
    style.textContent = `
      :root {
        --font-primary: 'Cooper Hewitt', 'Segoe UI', system-ui, sans-serif !important;
        --font-secondary: 'Cooper Hewitt', 'Segoe UI', system-ui, sans-serif !important;
        --font-accent: 'Cooper Hewitt', 'Segoe UI', system-ui, sans-serif !important;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-secondary) !important;
        letter-spacing: -0.01em !important;
      }
      .hero-label, .section-label, .nav-menu a, .btn, .stat-label,
      .preloader-text, .dark-mode-toggle, .footer-col h4,
      .project-category, .certification-badge, .timeline-date {
        font-family: var(--font-accent) !important;
      }
      body, p, li, td, input, textarea, select, .toast-message {
        font-family: var(--font-primary) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // CORRECTION #4 — PAGE TRANSITIONS (Fade + Wipe)
  // =========================================================
  function injectPageTransitionStyles() {
    const style = document.createElement('style');
    style.id = 'kgl-page-transitions';
    style.textContent = `
      /* Overlay de transition */
      #page-transition-overlay {
        position: fixed;
        inset: 0;
        z-index: 999998;
        pointer-events: none;
        background: var(--primary-bg, #111827);
        transform: translateY(100%);
        transition: transform 0.55s cubic-bezier(0.76, 0, 0.24, 1);
      }
      #page-transition-overlay.entering {
        transform: translateY(0%);
        pointer-events: all;
      }
      #page-transition-overlay.leaving {
        transform: translateY(-100%);
        transition: transform 0.45s cubic-bezier(0.76, 0, 0.24, 1) 0.05s;
      }
      /* Grain doré sur l'overlay */
      #page-transition-overlay::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
        opacity: 0.15;
      }
      /* Logo centré pendant la transition */
      #page-transition-overlay .pt-logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        opacity: 0;
        transition: opacity 0.25s ease 0.15s;
      }
      #page-transition-overlay.entering .pt-logo {
        opacity: 1;
      }
      #page-transition-overlay .pt-logo img {
        height: 60px;
        width: auto;
        background: #fff;
        padding: 8px;
        border-radius: 12px;
        border: 2px solid #17418A;
      }
      #page-transition-overlay .pt-line {
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #17418A, #0F2E68);
        transition: width 0.4s ease 0.25s;
        border-radius: 2px;
      }
      #page-transition-overlay.entering .pt-line {
        width: 120px;
      }
    `;
    document.head.appendChild(style);
  }

  function createPageTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="pt-logo">
        <img src="images/logo-kgl.jpg" alt="KGL" decoding="async" width="236" height="126" loading="eager">
        <div class="pt-line"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function initPageTransitions() {
    injectPageTransitionStyles();
    const overlay = createPageTransitionOverlay();

    // Reveal page on load (slide up)
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        overlay.classList.add('leaving');
        setTimeout(() => overlay.classList.remove('leaving'), 600);
      });
    });

    // Intercept all internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (e.defaultPrevented) return;

      const href = link.getAttribute('href');
      if (!href) return;
      // Skip: hash, external, new tab, tel, mailto
      if (
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        link.target === '_blank' ||
        e.ctrlKey || e.metaKey || e.shiftKey
      ) return;

      e.preventDefault();
      const destination = href;

      overlay.classList.remove('leaving');
      overlay.classList.add('entering');

      setTimeout(() => {
        window.location.href = destination;
      }, 600);
    });
  }

  // =========================================================
  // CORRECTION #5 — SECTION PROCESSUS (injectée sur index + services)
  // =========================================================
  function buildProcessSection() {
    const html = `
    <section class="process-section section-padding" id="processus">
      <div class="container">
        <div class="section-title" data-animate="fade-up">
          <span class="section-label">Notre Méthode</span>
          <h2>Comment nous travaillons</h2>
          <p>Un processus rigoureux, transparent et orienté résultats pour chaque projet</p>
        </div>
        <div class="process-steps">
          <div class="process-step" data-animate="fade-right" data-delay="0">
            <div class="process-step-number">01</div>
            <div class="process-step-content">
              <div class="process-step-icon"><i class="fas fa-comments"></i></div>
              <h3>Consultation initiale</h3>
              <p>Nous analysons vos besoins, votre contexte et vos objectifs lors d'un entretien dédié — sans engagement.</p>
            </div>
            <div class="process-step-connector"></div>
          </div>
          <div class="process-step" data-animate="fade-up" data-delay="1">
            <div class="process-step-number">02</div>
            <div class="process-step-content">
              <div class="process-step-icon"><i class="fas fa-file-alt"></i></div>
              <h3>Proposition & devis</h3>
              <p>Une offre technique et financière détaillée vous est remise sous 72h, adaptée à votre budget et planning.</p>
            </div>
            <div class="process-step-connector"></div>
          </div>
          <div class="process-step" data-animate="fade-up" data-delay="2">
            <div class="process-step-number">03</div>
            <div class="process-step-content">
              <div class="process-step-icon"><i class="fas fa-cogs"></i></div>
              <h3>Exécution & suivi</h3>
              <p>Notre équipe terrain déploie le projet avec des rapports d'avancement réguliers et une transparence totale.</p>
            </div>
            <div class="process-step-connector"></div>
          </div>
          <div class="process-step" data-animate="fade-left" data-delay="3">
            <div class="process-step-number">04</div>
            <div class="process-step-content">
              <div class="process-step-icon"><i class="fas fa-chart-line"></i></div>
              <h3>Livraison & impact</h3>
              <p>Rapport final, mesure d'impact et accompagnement post-projet pour garantir la durabilité des résultats.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
    return html;
  }

  function injectProcessStyles() {
    const style = document.createElement('style');
    style.id = 'kgl-process-styles';
    style.textContent = `
      .process-section {
        background: var(--surface-bg, #121212);
        position: relative;
        overflow: hidden;
      }
      .process-section::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(23, 65, 138,0.06) 0%, transparent 70%);
        pointer-events: none;
      }
      .process-steps {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 32px;
        position: relative;
        z-index: 1;
      }
      @media (max-width: 1024px) {
        .process-steps { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 600px) {
        .process-steps { grid-template-columns: 1fr; }
      }
      .process-step {
        position: relative;
        text-align: center;
        padding: 32px 20px;
        background: var(--surface-light, #1E1E1E);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.06);
        transition: border-color 0.3s, transform 0.3s;
      }
      .process-step:hover {
        border-color: rgba(23, 65, 138,0.4);
        transform: translateY(-8px);
      }
      .process-step-connector {
        display: none;
      }
      .process-step-number {
        font-family: var(--font-accent, 'Cooper Hewitt', sans-serif);
        font-size: 3.5rem;
        font-weight: 800;
        color: rgba(23, 65, 138,0.12);
        line-height: 1;
        position: absolute;
        top: 16px;
        right: 20px;
        user-select: none;
        transition: color 0.3s;
      }
      .process-step:hover .process-step-number {
        color: rgba(23, 65, 138,0.25);
      }
      .process-step-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #17418A 0%, #0F2E68 100%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.4rem;
        margin: 0 auto 20px;
        box-shadow: 0 8px 24px rgba(23, 65, 138,0.2);
        transition: transform 0.3s;
      }
      .process-step:hover .process-step-icon {
        transform: scale(1.1) rotate(-5deg);
      }
      .process-step-content h3 {
        font-size: 1.15rem;
        color: #F5F5F5;
        margin-bottom: 12px;
      }
      .process-step-content p {
        font-size: 0.875rem;
        color: #A0A0A0;
        line-height: 1.7;
        max-width: 100%;
        margin: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function injectProcessSection() {
    // Insert before CTA section on index & services
    const cta = document.querySelector('.cta-section');
    if (!cta) return;
    // Avoid double injection
    if (document.getElementById('processus')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildProcessSection();
    cta.parentNode.insertBefore(wrapper.firstElementChild, cta);
    // Re-init scroll animations for new elements
    reinitScrollAnimations();
  }

  // =========================================================
  // CORRECTION #6 — PARTENAIRES: ajout de logos texte si pas d'image
  // (on améliore le markup existant des partners-track)
  // =========================================================
  function enhancePartnerLogos() {
    const tracks = document.querySelectorAll('.partners-track');
    tracks.forEach(track => {
      // Add partner name labels under each logo
      const logos = track.querySelectorAll('.partner-logo');
      logos.forEach(logo => {
        const img = logo.querySelector('img');
        if (!img) return;
        const name = img.getAttribute('alt') || '';
        if (!logo.querySelector('.partner-name')) {
          const label = document.createElement('span');
          label.className = 'partner-name';
          label.textContent = name;
          logo.appendChild(label);
        }
      });
    });

    // Inject partner label styles
    const style = document.createElement('style');
    style.id = 'kgl-partner-labels';
    style.textContent = `
      .partner-logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .partner-name {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--text-muted, #666);
        font-family: var(--font-accent, 'Cooper Hewitt', sans-serif);
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .partner-logo:hover .partner-name {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // CORRECTION #7 — THÈME COHÉRENT (refonte institutionnelle)
  // Le site est CLAIR par défaut (registre MINEDU-NC).
  // Le toggle bascule vers un mode sombre bleu nuit.
  // =========================================================
  function fixDarkModeLogic() {
    // Les variables de thème sont désormais gérées par css/style.css :
    // plus aucune injection de couleurs ici.
    const style = document.createElement('style');
    style.id = 'kgl-light-mode';
    style.textContent = `
      /* Tooltip du bouton de thème */
      .dark-mode-toggle::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: -32px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.65rem;
        background: rgba(10, 31, 71, 0.85);
        color: #fff;
        padding: 3px 8px;
        border-radius: 4px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        font-family: var(--font-accent, sans-serif);
      }

      .dark-mode-toggle:hover::after {
        opacity: 1;
      }

      .dark-mode-toggle {
        position: relative;
      }
    `;
    document.head.appendChild(style);

    // Patch the dark mode toggle behavior
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    const savedTheme = localStorage.getItem('kgl-theme');
    if (savedTheme === 'dark') {
      applyDarkMode(newToggle);
    } else {
      applyLightMode(newToggle);
      if (!savedTheme) localStorage.setItem('kgl-theme', 'light');
    }

    newToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        applyLightMode(newToggle);
        localStorage.setItem('kgl-theme', 'light');
      } else {
        applyDarkMode(newToggle);
        localStorage.setItem('kgl-theme', 'dark');
      }
      document.dispatchEvent(new CustomEvent('kgl:themechange', {
        detail: { theme: document.documentElement.getAttribute('data-theme') || 'light' }
      }));
    });
  }

  function applyLightMode(btn) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#17418A');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-moon"></i>';
      btn.setAttribute('aria-label', 'Activer le mode sombre');
    }
  }

  function applyDarkMode(btn) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0A1F47');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-sun"></i>';
      btn.setAttribute('aria-label', 'Activer le mode clair');
    }
  }

  // =========================================================
  // CORRECTION #8 — TESTIMONIALS: Initiales stylisées
  // =========================================================
  function patchTestimonialAvatars() {
    const style = document.createElement('style');
    style.id = 'kgl-avatar-styles';
    style.textContent = `
      .author-avatar {
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #17418A 0%, #0F2E68 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        font-size: 1.1rem;
        font-family: var(--font-accent, 'Cooper Hewitt', sans-serif);
        flex-shrink: 0;
        letter-spacing: 0.05em;
        box-shadow: 0 4px 16px rgba(23, 65, 138,0.25);
      }
      .author-avatar img { display: none !important; }
    `;
    document.head.appendChild(style);

    // Replace images with initials
    document.querySelectorAll('.author-avatar').forEach(avatar => {
      const nameEl = avatar.closest('.testimonial-author')?.querySelector('.author-info h4');
      if (!nameEl) return;
      const name = nameEl.textContent.trim();
      const initials = name
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      avatar.textContent = initials;
    });
  }

  // =========================================================
  // CORRECTION #10 — GRAIN CSS (texture film sur sections sombres)
  // =========================================================
  function injectGrainEffect() {
    const style = document.createElement('style');
    style.id = 'kgl-grain';
    style.textContent = `
      /* SVG grain filter */
      .grain-overlay {
        position: relative;
      }
      .grain-overlay::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.04;
        pointer-events: none;
        z-index: 0;
        border-radius: inherit;
      }
      .grain-overlay > * {
        position: relative;
        z-index: 1;
      }
      /* Apply grain to hero, CTA, impact stats */
      .hero { position: relative; }
      .hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
        pointer-events: none;
        z-index: 3;
      }
      .cta-section::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 0;
      }
      .impact-stats::before {
        mix-blend-mode: overlay;
      }
      /* Service cards subtle grain */
      .service-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.025;
        border-radius: inherit;
        pointer-events: none;
        z-index: 3;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================
  // CORRECTION #11 — ANIMATIONS VARIÉES (clip-path, scale, fade-left/right)
  // =========================================================
  function enhanceScrollAnimations() {
    const style = document.createElement('style');
    style.id = 'kgl-animations-enhanced';
    style.textContent = `
      /* Clip-path reveal pour les titres principaux */
      [data-animate="clip-reveal"] {
        clip-path: inset(0 100% 0 0);
        opacity: 1 !important;
        transform: none !important;
      }
      [data-animate="clip-reveal"].animate {
        clip-path: inset(0 0% 0 0);
        transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1);
      }

      /* Scale up pour les cards */
      [data-animate="scale-up"] {
        opacity: 0;
        transform: scale(0.88) translateY(20px);
      }
      [data-animate="scale-up"].animate {
        opacity: 1;
        transform: scale(1) translateY(0);
        transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* Fade from left (pour images) */
      [data-animate="fade-left-strong"] {
        opacity: 0;
        transform: translateX(-60px) rotate(-1deg);
      }
      [data-animate="fade-left-strong"].animate {
        opacity: 1;
        transform: translateX(0) rotate(0deg);
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* Fade from right (pour texte aside) */
      [data-animate="fade-right-strong"] {
        opacity: 0;
        transform: translateX(60px);
      }
      [data-animate="fade-right-strong"].animate {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* Stagger children (s'applique au parent) */
      [data-animate="stagger-children"] > * {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      [data-animate="stagger-children"].animate > *:nth-child(1) { opacity:1;transform:none;transition-delay:0.05s; }
      [data-animate="stagger-children"].animate > *:nth-child(2) { opacity:1;transform:none;transition-delay:0.15s; }
      [data-animate="stagger-children"].animate > *:nth-child(3) { opacity:1;transform:none;transition-delay:0.25s; }
      [data-animate="stagger-children"].animate > *:nth-child(4) { opacity:1;transform:none;transition-delay:0.35s; }
      [data-animate="stagger-children"].animate > *:nth-child(n+5) { opacity:1;transform:none;transition-delay:0.45s; }

      /* Delay variants */
      [data-delay="5"] { transition-delay: 0.5s !important; }
      [data-delay="6"] { transition-delay: 0.6s !important; }
      [data-delay="7"] { transition-delay: 0.7s !important; }
      [data-delay="8"] { transition-delay: 0.8s !important; }
    `;
    document.head.appendChild(style);

    // Patch existing elements with varied animation types
    requestAnimationFrame(() => {
      // Section titles → clip-reveal
      document.querySelectorAll('.section-title h2').forEach(el => {
        if (!el.closest('[data-animate]')) return;
      });

      // Service cards → scale-up
      document.querySelectorAll('.service-card[data-animate]').forEach(el => {
        el.setAttribute('data-animate', 'scale-up');
      });

      // About images → fade from side
      document.querySelectorAll('.about-image[data-animate]').forEach(el => {
        el.setAttribute('data-animate', 'fade-right-strong');
      });
      document.querySelectorAll('.about-content[data-animate]').forEach(el => {
        el.setAttribute('data-animate', 'fade-left-strong');
      });

      // Featured projects → stagger
      const projectGrid = document.querySelector('.featured-projects-grid');
      if (projectGrid && !projectGrid.hasAttribute('data-animate')) {
        document.querySelectorAll('.featured-project[data-animate]').forEach((el, i) => {
          el.setAttribute('data-animate', 'scale-up');
          el.setAttribute('data-delay', String(i));
        });
      }

      // Process steps → already handled by data-animate attributes
    });
  }

  // =========================================================
  // CORRECTION #12 — FAVICON SVG (monogramme KGL)
  // =========================================================
  function injectSVGFavicon() {
    // Remove existing favicon links
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(l => l.remove());

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="22" fill="#111827"/>
        <rect x="3" y="3" width="94" height="94" rx="19" fill="none" stroke="#17418A" stroke-width="3" opacity="0.8"/>
        <!-- K -->
        <text x="8" y="72" font-family="Georgia,serif" font-size="52" font-weight="700" fill="#17418A" letter-spacing="-2">K</text>
        <!-- GL small -->
        <text x="54" y="58" font-family="Georgia,serif" font-size="24" font-weight="600" fill="#FFFFFF" opacity="0.9">GL</text>
        <!-- Green accent line -->
        <rect x="8" y="78" width="84" height="3" rx="1.5" fill="#0F2E68"/>
      </svg>
    `;

    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/svg+xml';
    faviconLink.href = svgUrl;
    document.head.appendChild(faviconLink);

    // Also inject as a data-URI (for broader support)
    const encoded = 'data:image/svg+xml,' + encodeURIComponent(svgContent.trim());
    const faviconFallback = document.createElement('link');
    faviconFallback.rel = 'shortcut icon';
    faviconFallback.href = encoded;
    document.head.appendChild(faviconFallback);
  }

  // =========================================================
  // HELPER: Re-init scroll animations for newly added elements
  // =========================================================
  function reinitScrollAnimations() {
    const newElements = document.querySelectorAll('[data-animate]:not(.animate)');
    if (!newElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, Number(delay) * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    newElements.forEach(el => observer.observe(el));
  }

  // =========================================================
  // INIT — Run all upgrades on DOM ready
  // =========================================================
  function init() {
    injectPremiumFonts();
    initPageTransitions();
    injectGrainEffect();
    injectProcessStyles();
    injectProcessSection();
    enhancePartnerLogos();
    fixDarkModeLogic();
    patchTestimonialAvatars();
    enhanceScrollAnimations();
    injectSVGFavicon();
    // Re-run scroll observer after all DOM injections
    setTimeout(reinitScrollAnimations, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
