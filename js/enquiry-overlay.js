/* ============================================================
   ENQUIRY-OVERLAY.JS
   Shared enquiry form overlay — glass backdrop, pre-selects product
   ============================================================ */

(function () {
  'use strict';

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbykyb2E1ZFwvj5U-hkqvICAtkiSe_UnNQdN8ie1NPflr7-ccUEbL5i-R813KWv-QeYP8A/exec';

  /* ── Inject overlay HTML ─────────────────────────────────── */
  const overlayHTML = `
    <div class="enq-overlay" id="enqOverlay" aria-hidden="true" role="dialog" aria-label="Enquiry form">
      <div class="enq-backdrop" id="enqBackdrop"></div>
      <div class="enq-panel">
        <div class="enq-header">
          <p class="enq-title">Make an Enquiry</p>
          <button class="enq-close" id="enqClose" aria-label="Close">Close</button>
        </div>
        <form class="enq-form" id="enqForm" novalidate>

          <div class="enq-row">
            <div class="enq-group">
              <label for="enq-name">Full Name</label>
              <input type="text" id="enq-name" name="name" placeholder="Your full name" required>
            </div>
            <div class="enq-group">
              <label for="enq-phone">Phone Number</label>
              <input type="tel" id="enq-phone" name="phone" placeholder="+44 00000 00000" required>
            </div>
          </div>

          <div class="enq-row">
            <div class="enq-group">
              <label for="enq-email">Email Address</label>
              <input type="email" id="enq-email" name="email" placeholder="you@example.com" required>
            </div>
            <div class="enq-group">
              <label for="enq-location">Location / School</label>
              <input type="text" id="enq-location" name="location" placeholder="City or school name" required>
            </div>
          </div>

          <div class="enq-group">
            <label for="enq-product">Product of Interest</label>
            <div class="enq-select-wrap">
              <select id="enq-product" name="product" required>
                <option value="" disabled selected>Select a product</option>
                <optgroup label="Bags">
                  <option value="School Backpack">School Backpack</option>
                  <option value="Drawstring Backpack">Drawstring Backpack</option>
                  <option value="Canvas Tote Bag">Canvas Tote Bag</option>
                  <option value="Canvas Backpack Rolltop Carry">Canvas Backpack Rolltop Carry</option>
                  <option value="Canvas Briefcase Daily Carry">Canvas Briefcase Daily Carry</option>
                  <option value="Canvas Satchel Classic Carry">Canvas Satchel Classic Carry</option>
                </optgroup>
                <optgroup label="Uniforms">
                  <option value="School Uniform">School Uniform</option>
                  <option value="V-Neck Uniform">V-Neck Uniform</option>
                  <option value="Custom / Bespoke Uniform">Custom / Bespoke Uniform</option>
                </optgroup>
                <optgroup label="Sportswear">
                  <option value="Bespoke Sportswear">Bespoke Sportswear</option>
                  <option value="Training Kit">Training Kit</option>
                  <option value="Custom Sports Kit">Custom Sports Kit</option>
                </optgroup>
                <option value="Other / General Enquiry">Other / General Enquiry</option>
              </select>
              <span class="enq-select-arrow" aria-hidden="true"></span>
            </div>
          </div>

          <div class="enq-group">
            <label for="enq-message">Message <span class="enq-optional">(optional)</span></label>
            <textarea id="enq-message" name="message" rows="3" placeholder="Any extra details, quantities, or deadlines…"></textarea>
          </div>

          <div class="enq-actions">
            <button type="submit" class="btn btn-green" id="enqSubmitBtn">Send Enquiry &rarr;</button>
            <p class="enq-note">We typically respond within 1–2 business days.</p>
          </div>

          <div class="enq-status" id="enqStatus" aria-live="polite"></div>

        </form>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', overlayHTML);

  /* ── References ──────────────────────────────────────────── */
  const overlay   = document.getElementById('enqOverlay');
  const backdrop  = document.getElementById('enqBackdrop');
  const closeBtn  = document.getElementById('enqClose');
  const form      = document.getElementById('enqForm');
  const submitBtn = document.getElementById('enqSubmitBtn');
  const status    = document.getElementById('enqStatus');
  const productEl = document.getElementById('enq-product');

  /* ── Open / Close ────────────────────────────────────────── */
  function openOverlay(product) {
    // Pre-select + lock product if provided
    if (product) {
      for (var i = 0; i < productEl.options.length; i++) {
        if (productEl.options[i].value === product) {
          productEl.value    = product;
          productEl.disabled = true;
          break;
        }
      }
    } else {
      productEl.disabled = false;
      productEl.value    = '';
    }

    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Re-enable product select and reset form after animation
    setTimeout(function () {
      form.reset();
      productEl.disabled = false;
      status.textContent = '';
      status.className   = 'enq-status';
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Enquiry →';
    }, 350);
  }

  backdrop.addEventListener('click', closeOverlay);
  closeBtn.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
  });

  /* ── Intercept all enquiry triggers ─────────────────────── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-enquiry]');
    if (!trigger) return;
    e.preventDefault();
    openOverlay(trigger.getAttribute('data-product') || '');
  });

  /* ── Form submission ─────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    status.textContent    = '';
    status.className      = 'enq-status';

    var data = {
      name:     form.elements['name'].value.trim(),
      phone:    form.elements['phone'].value.trim(),
      email:    form.elements['email'].value.trim(),
      location: form.elements['location'].value.trim(),
      product:  form.elements['product'].value,
      message:  form.elements['message'].value.trim(),
    };

    fetch(SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
      .then(function () {
        status.textContent = 'Thank you — we\'ll be in touch soon.';
        status.className   = 'enq-status success';
        form.reset();
        productEl.disabled = false;
      })
      .catch(function () {
        status.textContent = 'Something went wrong. Please try again.';
        status.className   = 'enq-status error';
      })
      .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Enquiry →';
      });
  });

  function validateForm() {
    var valid    = true;
    var required = ['name', 'phone', 'email', 'location', 'product'];
    required.forEach(function (name) {
      var el  = form.elements[name];
      var val = el.value.trim ? el.value.trim() : el.value;
      if (!val) { el.classList.add('error'); valid = false; }
      else       { el.classList.remove('error'); }
    });
    var emailEl = form.elements['email'];
    if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl.classList.add('error'); valid = false;
    }
    if (!valid) {
      status.textContent = 'Please fill in all required fields.';
      status.className   = 'enq-status error';
    }
    return valid;
  }

  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
      if (status.className.includes('error')) {
        status.textContent = '';
        status.className   = 'enq-status';
      }
    }
  });

})();
