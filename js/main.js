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

  /* ── Homepage enquiry form ───────────────────────────── */
  const homeForm   = document.getElementById('homeEnqForm');
  const homeBtn    = document.getElementById('homeEnqBtn');
  const homeStatus = document.getElementById('homeEnqStatus');

  if (homeForm) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbykyb2E1ZFwvj5U-hkqvICAtkiSe_UnNQdN8ie1NPflr7-ccUEbL5i-R813KWv-QeYP8A/exec';

    homeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields   = ['name', 'phone', 'email', 'location', 'product'];
      let   valid    = true;

      fields.forEach(function (n) {
        const el  = homeForm.elements[n];
        const val = el.value.trim ? el.value.trim() : el.value;
        if (!val) { el.classList.add('error'); valid = false; }
        else       { el.classList.remove('error'); }
      });

      const emailEl = homeForm.elements['email'];
      if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        emailEl.classList.add('error'); valid = false;
      }

      if (!valid) {
        homeStatus.textContent = 'Please fill in all fields.';
        homeStatus.className   = 'school-form-status error';
        return;
      }

      homeBtn.disabled    = true;
      homeBtn.textContent = 'Sending…';
      homeStatus.textContent = '';

      const data = {
        name:     homeForm.elements['name'].value.trim(),
        phone:    homeForm.elements['phone'].value.trim(),
        email:    homeForm.elements['email'].value.trim(),
        location: homeForm.elements['location'].value.trim(),
        product:  homeForm.elements['product'].value,
        message:  '',
      };

      fetch(SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
        .then(function () {
          homeStatus.textContent = 'Thank you — we\'ll be in touch soon.';
          homeStatus.className   = 'school-form-status';
          homeForm.reset();
        })
        .catch(function () {
          homeStatus.textContent = 'Something went wrong. Please try again.';
          homeStatus.className   = 'school-form-status error';
        })
        .finally(function () {
          homeBtn.disabled    = false;
          homeBtn.textContent = 'Get Started →';
        });
    });

    homeForm.addEventListener('input', function (e) {
      e.target.classList.remove('error');
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
