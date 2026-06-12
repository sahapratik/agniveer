/* ================================================================
   AGNIVEER BANGLA — main.js
   Handles: Sticky Nav · Mobile Menu · Scroll Animations ·
            Reading Progress · Animated Counters · Back-to-Top ·
            Quote Glow · Filter · Cookie Notice
   ================================================================ */

(function () {
  'use strict';

  /* ── HELPERS ──────────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     1. STICKY NAVIGATION
     Transitions between transparent (over dark hero) and
     frosted-glass solid states on scroll.
  ─────────────────────────────────────────────────────────────── */
  const nav = $('#main-nav');

  function syncNav() {
    if (!nav) return;
    const hasDarkHero = document.body.classList.contains('has-dark-hero');
    const scrolled    = window.scrollY > 80;

    if (hasDarkHero) {
      nav.classList.toggle('nav-solid',       scrolled);
      nav.classList.toggle('nav-transparent', !scrolled);
    } else {
      nav.classList.add('nav-solid');
      nav.classList.remove('nav-transparent');
    }
  }

  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav(); // run once on load

  /* ─────────────────────────────────────────────────────────────
     2. MOBILE HAMBURGER MENU
  ─────────────────────────────────────────────────────────────── */
  const hamburger  = $('#nav-hamburger');
  const mobileMenu = $('#mobile-menu');

  if (hamburger && mobileMenu) {
    function closeMobileMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', closeMobileMenu));

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
        hamburger.focus();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     3. READING PROGRESS BAR
     Only active on pages that have #reading-progress-bar
  ─────────────────────────────────────────────────────────────── */
  const progressBar = $('#reading-progress-bar');

  if (progressBar) {
    function updateProgress() {
      const docH  = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ─────────────────────────────────────────────────────────────
     4. INTERSECTION OBSERVER — SCROLL ANIMATIONS
     Adds .vis to .fade-up elements as they enter the viewport.
     Staggered via CSS delay classes (.d1 – .d5).
  ─────────────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    const fadeEls = $$('.fade-up');

    if (fadeEls.length) {
      const fadeObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            fadeObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

      fadeEls.forEach(el => fadeObs.observe(el));
    }

    /* Sanskrit quote glow on entry */
    const qBlocks = $$('.q-block');
    if (qBlocks.length) {
      const qObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('glow'), 180);
            qObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      qBlocks.forEach(el => qObs.observe(el));
    }

  } else {
    // Immediately reveal everything if reduced motion is preferred
    $$('.fade-up').forEach(el => el.classList.add('vis'));
  }

  /* ─────────────────────────────────────────────────────────────
     5. ANIMATED COUNTERS
     Elements need data-target (number) and optional data-suffix.
     Uses ease-out cubic for smooth deceleration.
  ─────────────────────────────────────────────────────────────── */
  const counters = $$('.stat-num[data-target]');

  if (counters.length && !prefersReduced) {
    function runCounter(el) {
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1800;
      const start    = performance.now();

      // Bengali numeral map
      const toBn = n => n.toString().replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = Math.round(target * ease);
        el.textContent = toBn(current) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = toBn(target) + suffix;
      }
      requestAnimationFrame(tick);
    }

    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(el => cObs.observe(el));
  } else {
    // Set final values immediately for reduced motion
    counters.forEach(el => {
      const toBn = n => n.toString().replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);
      el.textContent = toBn(parseInt(el.dataset.target, 10)) + (el.dataset.suffix || '');
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. BACK-TO-TOP BUTTON
  ─────────────────────────────────────────────────────────────── */
  const btt = $('#back-to-top');

  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     7. COOKIE / CONSENT NOTICE
     Persisted in localStorage so it shows only once.
  ─────────────────────────────────────────────────────────────── */
  const cookieEl = $('#cookie-notice');

  if (cookieEl) {
    const KEY = 'agni-cookie-ok';

    if (!localStorage.getItem(KEY)) {
      setTimeout(() => cookieEl.classList.add('show'), 2200);

      function dismissCookie() {
        cookieEl.classList.remove('show');
        localStorage.setItem(KEY, '1');
      }

      const btnOk = $('#cookie-ok',  cookieEl);
      const btnNo = $('#cookie-no', cookieEl);
      if (btnOk) btnOk.addEventListener('click', dismissCookie);
      if (btnNo) btnNo.addEventListener('click', dismissCookie);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. CATEGORY FILTER BUTTONS
     Toggles .on class and hides/shows cards via data-category.
  ─────────────────────────────────────────────────────────────── */
  const filterBtns = $$('.filter-btn');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('on'));
        this.classList.add('on');

        const filter = this.dataset.filter || 'all';
        const cards  = $$('[data-category]');

        cards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
          // Re-trigger fade animation for visible cards
          if (show && !prefersReduced) {
            card.classList.remove('vis');
            requestAnimationFrame(() => card.classList.add('vis'));
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     9. SMOOTH SCROLL for in-page anchor links
  ─────────────────────────────────────────────────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id     = this.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────────────────
     10. CONTACT FORM — simulated submission
  ─────────────────────────────────────────────────────────────── */
  const contactForm = $('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn     = this.querySelector('.form-submit');
      const origTxt = btn.textContent;

      btn.textContent = 'পাঠানো হচ্ছে…';
      btn.disabled    = true;

      setTimeout(() => {
        btn.textContent         = '✓ বার্তা সফলভাবে পাঠানো হয়েছে!';
        btn.style.background    = '#2E7D32';
        contactForm.reset();

        setTimeout(() => {
          btn.textContent      = origTxt;
          btn.style.background = '';
          btn.disabled         = false;
        }, 3200);
      }, 1600);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     11. NAVBAR ACTIVE LINK HIGHLIGHT
     Marks the current page's nav link as active.
  ─────────────────────────────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .mobile-menu-link').forEach(link => {
    const href = link.getAttribute('href')?.split('?')[0] || '';
    if (href === currentPage) link.classList.add('active');
  });

  /* ─────────────────────────────────────────────────────────────
     12. VERSE TICKER — duplicate content for seamless infinite loop
     We measure the actual content width and duplicate just enough.
  ─────────────────────────────────────────────────────────────── */
  const tickerTrack = $('.verse-ticker-track');
  if (tickerTrack) {
    // Content is already doubled in HTML; no JS needed for basic loop.
    // This just ensures the animation looks right on first paint.
    tickerTrack.style.animationPlayState = 'running';
  }

})();
