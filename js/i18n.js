// ===== KGL MANAGEMENT — INTERNATIONALISATION FR/EN =====
(function () {
  'use strict';

  const STORAGE_KEY = 'kgl-lang';
  const DEFAULT_LANG = 'fr';

  let currentLang = DEFAULT_LANG;

  function getPageId() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path === '' ? 'index.html' : path;
  }

  function t(key, lang) {
    const L = lang || currentLang;
    const entry = window.KGL_I18N?.t?.[key];
    if (!entry) return null;
    return entry[L] || entry.fr || null;
  }

  function applyTranslations(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'en' ? 'en' : 'fr';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const text = t(key, lang);
      if (text === null) return;

      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = t(key, lang);
      if (text) el.placeholder = text;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const text = t(key, lang);
      if (text) el.setAttribute('aria-label', text);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const text = t(key, lang);
      if (text) el.title = text;
    });

    const pageId = getPageId();
    const pageMeta = window.KGL_I18N?.pages?.[pageId];
    if (pageMeta) {
      if (pageMeta.title?.[lang]) document.title = pageMeta.title[lang];
      const desc = document.querySelector('meta[name="description"]');
      if (desc && pageMeta.description?.[lang]) desc.content = pageMeta.description[lang];
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && pageMeta.title?.[lang]) ogTitle.content = pageMeta.title[lang];
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && pageMeta.description?.[lang]) ogDesc.content = pageMeta.description[lang];
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.content = lang === 'en' ? 'en_US' : 'fr_FR';
    }

    updateLangButtons(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll('link[rel="alternate"][hreflang], link[rel="alternate"][hreflang="x-default"]').forEach((el) => el.remove());
    const base = window.location.origin + window.location.pathname;
    ['fr', 'en', 'x-default'].forEach((l) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      if (l === 'x-default') {
        link.hreflang = 'x-default';
      } else {
        link.hreflang = l;
      }
      link.href = base;
      document.head.appendChild(link);
    });

    document.dispatchEvent(new CustomEvent('kgl:langchange', { detail: { lang } }));
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-switcher .lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  function createLangSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('role', 'group');
    switcher.innerHTML = `
      <button type="button" class="lang-btn active" data-lang="fr" aria-pressed="true" aria-label="Français">FR</button>
      <span class="lang-separator">|</span>
      <button type="button" class="lang-btn" data-lang="en" aria-pressed="false" aria-label="English">EN</button>
    `;
    return switcher;
  }

  function initLangSwitcher() {
    document.querySelectorAll('.header-actions').forEach((actions) => {
      if (actions.querySelector('.lang-switcher')) return;

      const switcher = createLangSwitcher();

      const darkToggle = actions.querySelector('#darkModeToggle');
      if (darkToggle) {
        actions.insertBefore(switcher, darkToggle);
      } else {
        actions.appendChild(switcher);
      }
    });

    // Mobile: also expose the language switcher inside the nav overlay
    document.querySelectorAll('#navMenu').forEach((menu) => {
      if (menu.querySelector('.lang-switcher')) return;
      const switcher = createLangSwitcher();
      switcher.classList.add('nav-lang-switcher');
      menu.appendChild(switcher);
    });

    document.querySelectorAll('.lang-switcher .lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang && lang !== currentLang) applyTranslations(lang);
      });
    });
  }

  function detectLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
    const browser = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    return browser === 'en' ? 'en' : DEFAULT_LANG;
  }

  function initHeaderValues() {
    document.querySelectorAll('header .header-container').forEach((container) => {
      const logo = container.querySelector('.logo');
      if (!logo || logo.closest('.header-brand')) return;

      const brand = document.createElement('div');
      brand.className = 'header-brand';
      logo.parentNode.insertBefore(brand, logo);
      brand.appendChild(logo);

      const marquee = document.createElement('div');
      marquee.className = 'header-values-marquee';
      marquee.setAttribute('aria-label', 'Valeurs KGL');
      marquee.innerHTML = `
        <div class="header-values-track">
          <span class="header-values-text" data-i18n="header.values">INTÉGRITÉ · INNOVATION · PROFESSIONNALISME · PERFORMANCE</span>
          <span class="header-values-text" aria-hidden="true" data-i18n="header.values">INTÉGRITÉ · INNOVATION · PROFESSIONNALISME · PERFORMANCE</span>
        </div>
      `;
      brand.appendChild(marquee);
    });

    document.documentElement.style.setProperty('--header-height', '108px');
    document.documentElement.style.setProperty('--header-height-scrolled', '92px');
  }

  function markDropdownItems() {
    document.querySelectorAll('.nav-menu li').forEach((li) => {
      if (li.querySelector('.dropdown-menu')) {
        li.classList.add('has-dropdown');
      }
    });
  }

  function init() {
    if (!window.KGL_I18N) return;

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && !viewport.content.includes('viewport-fit')) {
      viewport.content += ', viewport-fit=cover';
    }

    markDropdownItems();
    initHeaderValues();
    initLangSwitcher();
    currentLang = detectLanguage();
    applyTranslations(currentLang);
  }

  window.KGL_i18n = { apply: applyTranslations, t, getLang: () => currentLang };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
