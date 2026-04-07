/* ============================================================
   MAIN.JS — shared JS across all pages
   Menu overlay · Marquee pause
   ============================================================ */

(function () {
  'use strict';

  /* ── Menu overlay ──────────────────────────────────────── */
  const menuOpen    = document.getElementById('menuOpen');
  const menuClose   = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuOpen && menuClose && menuOverlay) {

    let isAnimating = false;

    function openMenu() {
      if (isAnimating) return;
      isAnimating = true;

      menuOverlay.removeAttribute('aria-hidden');
      menuOverlay.classList.remove('is-closing');
      menuOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // Hamburger → X transform (animate the two bars)
      menuOpen.classList.add('is-open');

      setTimeout(() => { isAnimating = false; }, 800);
    }

    function closeMenu() {
      if (isAnimating) return;
      isAnimating = true;

      menuOverlay.classList.add('is-closing');
      menuOverlay.classList.remove('is-open');
      menuOpen.classList.remove('is-open');

      // After animation finishes: cleanup
      setTimeout(() => {
        menuOverlay.classList.remove('is-closing');
        menuOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        isAnimating = false;
      }, 850);
    }

    menuOpen.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ── Marquee pause on hover ──────────────────────────── */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

})();
