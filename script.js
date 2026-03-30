/**
 * script.js — Santoss WordPress-ready Theme
 *
 * In WordPress: this file would be enqueued via wp_enqueue_script()
 * inside functions.php, e.g.:
 *
 *   wp_enqueue_script(
 *     'santoss-main',
 *     get_template_directory_uri() . '/js/script.js',
 *     array(),
 *     '1.0.0',
 *     true  // load in footer
 *   );
 */

(function () {
  'use strict';

  /* ============================================================
     1. Sticky header shadow on scroll
     ============================================================ */
  const header = document.querySelector('.site-header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================================
     2. Mobile navigation toggle
     In WordPress: works alongside wp_nav_menu() output
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked (single-page behaviour)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ============================================================
     3. Active nav link highlight on scroll
     ============================================================ */
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.main-nav a[href^="#"]');

  function highlightNav() {
    let current = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ============================================================
     4. Smooth scroll for anchor links
     (CSS scroll-behavior: smooth handles most cases; this is a
      JS fallback and adds offset for the fixed header.)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     5. Simple contact form front-end validation
     In WordPress: replace submit handler with AJAX + wp_ajax_ hook
     or use a plugin like Contact Form 7 / WPForms
     ============================================================ */
  const contactForm = document.querySelector('.contact-form form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = contactForm.querySelector('#contact-name');
      const email   = contactForm.querySelector('#contact-email');
      const message = contactForm.querySelector('#contact-message');
      let valid     = true;

      [name, email, message].forEach(function (field) {
        if (!field) return;
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Simulate success feedback (remove in WordPress — use real AJAX handler)
      const btn     = contactForm.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled    = true;

      setTimeout(function () {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#05c2a0';
        contactForm.reset();

        setTimeout(function () {
          btn.textContent = origText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  /* ============================================================
     6. Intersection Observer — fade-in-up on scroll
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const animatedEls = document.querySelectorAll(
      '.service-card, .testimonial, .blog-card, .feature-item'
    );

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedEls.forEach(function (el, i) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.45s ease ' + (i * 0.06) + 's, transform 0.45s ease ' + (i * 0.06) + 's';
      observer.observe(el);
    });
  }

})();
