/* ============================================================
   LuminaDent — script.js
   Handles: sticky header, mobile menu, scroll reveals,
            page transitions, contact form validation
   ============================================================ */

(function () {
  'use strict';

  // ── STICKY HEADER ────────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── MOBILE MENU ──────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ── SCROLL REVEAL ────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // ── PAGE TRANSITION ──────────────────────────────────────
  // Fade-out before navigating away
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Only intercept same-site .html links
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      !href.endsWith('.html')
    ) return;
    e.preventDefault();
    document.body.style.transition = 'opacity .3s ease';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 300);
  });

  // ── CONTACT FORM VALIDATION ──────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const successMsg = document.getElementById('formSuccess');

    function validateField(field) {
      const errorEl = field.parentElement.querySelector('.form-error');
      let valid = true;
      let message = '';

      if (field.required && !field.value.trim()) {
        valid = false;
        message = 'This field is required.';
      } else if (field.type === 'email' && field.value.trim()) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(field.value)) {
          valid = false;
          message = 'Please enter a valid email address.';
        }
      }

      field.classList.toggle('error', !valid);
      if (errorEl) errorEl.textContent = message;
      return valid;
    }

    // Live validation on blur
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('input[required], textarea[required]');
      let allValid = true;
      fields.forEach((f) => { if (!validateField(f)) allValid = false; });

      if (allValid) {
        // Simulate sending
        const btn = form.querySelector('.btn-submit');
        btn.textContent = 'Sending…';
        btn.disabled = true;
        setTimeout(() => {
          form.reset();
          btn.textContent = 'Send Message';
          btn.disabled = false;
          if (successMsg) successMsg.hidden = false;
          setTimeout(() => { if (successMsg) successMsg.hidden = true; }, 6000);
        }, 1200);
      }
    });
  }

  // ── HERO PARALLAX (subtle) ───────────────────────────────
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      if (offset < window.innerHeight) {
        heroImg.style.transform = `scale(1) translateY(${offset * 0.2}px)`;
      }
    }, { passive: true });
  }

})();