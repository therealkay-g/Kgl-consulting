/* KGL — Chrome institutionnel ESU (footer + bannière de page, code original) */
(function () {
  'use strict';

  function ensureCSS() {
    if (!document.querySelector('link[href*="esu-inspired.css"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'css/esu-inspired.css';
      document.head.appendChild(l);
    }
  }

  function label(key, fr) {
    var e = window.KGL_I18N && window.KGL_I18N.t && window.KGL_I18N.t[key];
    if (!e) return fr;
    var lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    return e[lang] || e.fr || fr;
  }

  function buildChrome() {
    var footer = document.createElement('footer');
    footer.className = 'esu-footer';
    footer.innerHTML =
      '<div class="esu-container esu-footer-grid">' +
        '<div class="esu-fbrand">' +
          '<img src="images/logo-kgl.jpg" alt="KGL Management" class="esu-flogo">' +
          '<div class="esu-fname">KGL Management,<br>Business &amp; Consulting</div></div>' +
        '<div><h4 data-i18n="esu.footer.address">' + label('esu.footer.address', 'Adresse') + '</h4>' +
          '<p>Cabinet :<br>Avenue Kanda-Kanda 32, Commune de Kasavubu<br>Kinshasa, RDC</p></div>' +
        '<div><h4 data-i18n="esu.footer.contactT">' + label('esu.footer.contactT', 'Contact') + '</h4>' +
          '<p><a href="mailto:contact@kglgroup.netlify.app">contact@kglgroup.netlify.app</a><br><a href="https://wa.me/243812430023">+243 812 430 023</a><br><a href="contact.html">Conciergerie / Devis</a></p></div>' +
        '<div><h4 data-i18n="esu.footer.links">' + label('esu.footer.links', 'Autres liens') + '</h4>' +
          '<p><a href="index.html">Accueil portail</a><br><a href="contact.html">Contact</a><br><a href="sitemap.xml">Sitemap</a></p></div>' +
      '</div>' +
      '<div class="esu-bottom"><div class="esu-container esu-bottom-in">' +
        '<span>© 2026 KGL MANAGEMENT, BUSINESS &amp; CONSULTING — Tous droits réservés.</span>' +
        '<span class="esu-social">' +
          '<a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>' +
          '<a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>' +
          '<a href="https://wa.me/243812430023" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>' +
          '<a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>' +
        '</span>' +
      '</div></div>';

    document.body.classList.add('esu');
    if (!document.body.classList.contains('auth-page')) buildPageHead();
    document.body.appendChild(footer);
  }

  function buildPageHead() {
    // Bannière institutionnelle reconstituée depuis le h1 existant
    if (document.querySelector('.esu-hero') || document.querySelector('.esu-page-head')) return;
    var h1 = document.querySelector('main h1') || document.querySelector('h1');
    if (!h1) return;
    var main = document.querySelector('main') || document.body;
    var banner = document.createElement('div');
    banner.className = 'esu-page-head';
    var home = label('esu.nav.home', 'Accueil');
    banner.innerHTML =
      '<div class="esu-container">' +
        '<div class="esu-breadcrumb"><a href="index.html">' + home + '</a> / ' + h1.textContent.trim() + '</div>' +
        '<h1>' + h1.textContent.trim() + '</h1>' +
      '</div>';
    if (main === document.body) {
      document.body.insertBefore(banner, document.body.firstChild);
    } else {
      main.insertBefore(banner, main.firstChild);
    }
  }

  function init() {
    ensureCSS();
    // Garde anti-doublon : ne jamais injecter deux fois le footer
    if (document.querySelector('footer.esu-footer')) return;
    buildChrome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
