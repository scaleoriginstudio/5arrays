/* ============================================================
   CONTACT.JS — form submission to Google Sheets via Apps Script
   ============================================================ */

(function () {
  'use strict';

  // ── Replace this with your deployed Apps Script Web App URL ──
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbykyb2E1ZFwvj5U-hkqvICAtkiSe_UnNQdN8ie1NPflr7-ccUEbL5i-R813KWv-QeYP8A/exec';

  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const status    = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    status.textContent    = '';
    status.className      = 'form-status';

    const data = {
      name:     form.elements['name'].value.trim(),
      phone:    form.elements['phone'].value.trim(),
      email:    form.elements['email'].value.trim(),
      location: form.elements['location'].value.trim(),
      product:  form.elements['product'].value,
      message:  form.elements['message'].value.trim(),
    };

    fetch(SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',           // Apps Script Web Apps require no-cors
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
      .then(function () {
        status.textContent = 'Thank you — we\'ll be in touch soon.';
        status.className   = 'form-status success';
        form.reset();
      })
      .catch(function () {
        status.textContent = 'Something went wrong. Please email us directly.';
        status.className   = 'form-status error';
      })
      .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Enquiry →';
      });
  });

  function validateForm() {
    let valid = true;
    const required = ['name', 'phone', 'email', 'location', 'product'];

    required.forEach(function (name) {
      const el = form.elements[name];
      if (!el) return;
      const val = el.value.trim ? el.value.trim() : el.value;
      if (!val) {
        el.classList.add('error');
        valid = false;
      } else {
        el.classList.remove('error');
      }
    });

    // Basic email format check
    const emailEl = form.elements['email'];
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl.classList.add('error');
      valid = false;
    }

    if (!valid) {
      status.textContent = 'Please fill in all required fields.';
      status.className   = 'form-status error';
    }

    return valid;
  }

  // Clear error state on input
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
      status.textContent = '';
      status.className   = 'form-status';
    }
  });

})();
