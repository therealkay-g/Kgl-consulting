/* KGL — Animations d'apparition au scroll (IntersectionObserver, autonome) */
(function () {
  'use strict';

  function init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.jk-reveal').forEach(function (el) {
        el.classList.add('jk-visible');
      });
      return;
    }

    // Cibles : sections et cartes de l'accueil (photos et CSS inchangés)
    var targets = document.querySelectorAll(
      '.esu-top, .esu-section, .esu-card, .esu-logo-tile, .esu-step, .esu-side .esu-card-r'
    );
    targets.forEach(function (el) {
      el.classList.add('jk-reveal');
    });

    // Léger décalage en cascade dans les grilles
    document.querySelectorAll('.esu-svc-grid, .esu-logos, .esu-steps, .esu-lmd').forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.style.transitionDelay = ((i % 4) * 0.1) + 's';
      });
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('jk-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '50px' }
    );

    document.querySelectorAll('.jk-reveal').forEach(function (el) {
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
