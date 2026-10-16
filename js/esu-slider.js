/* KGL — Carrousel institutionnel (autonome, sans dépendance) */
(function () {
  'use strict';

  function init() {
    var root = document.getElementById('esuSlider');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('.esu-slide'));
    if (slides.length < 2) return;
    var dotsWrap = root.querySelector('.esu-dots');
    var prev = root.querySelector('.esu-prev');
    var next = root.querySelector('.esu-next');
    if (!dotsWrap || !prev || !next) return;
    var current = 0;
    var timer = null;
    var DELAY = 6000;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'esu-dot';
      b.setAttribute('aria-label', 'Photo ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].removeAttribute('aria-current');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-current', 'true');
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, DELAY);
    }

    prev.addEventListener('click', function () { go(current - 1); restart(); });
    next.addEventListener('click', function () { go(current + 1); restart(); });
    root.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(current - 1); restart(); }
      if (e.key === 'ArrowRight') { go(current + 1); restart(); }
    });

    go(0);
    restart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
