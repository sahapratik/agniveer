/* ── AGNIVEER BANGLA — main.js (standalone, no external deps) ── */
"use strict";

/* ── NAV SCROLL BEHAVIOUR ─────────────────────────────────────── */
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('nav-scrolled', y > 60);
    nav.classList.toggle('nav-hidden', y > lastY + 5 && y > 200);
    nav.classList.remove('nav-hidden', y <= lastY || y < 200);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER / MOBILE MENU ─────────────────────────────────── */
(function () {
  const btn = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.classList.toggle('is-open', !open);
    menu.classList.toggle('is-open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    })
  );
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
})();

/* ── READING PROGRESS BAR ────────────────────────────────────── */
(function () {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
    bar.style.width = Math.min(scrolled, 100) + '%';
  }, { passive: true });
})();

/* ── FADE-UP INTERSECTION OBSERVER ──────────────────────────── */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ───────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  const format = n => n >= 1000 ? (n / 1000).toFixed(0) + ',' + '০০০' : String(n);
  const toBN = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  const animateCounter = el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = toBN(Math.round(current)) + (current >= target && target >= 1000 ? '+' : '');
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
})();

/* ── BACK TO TOP ─────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── COOKIE NOTICE ───────────────────────────────────────────── */
(function () {
  const notice = document.getElementById('cookie-notice');
  if (!notice) return;
  if (localStorage.getItem('cookie_ok')) { notice.remove(); return; }
  setTimeout(() => notice.classList.add('visible'), 1500);
  const ok = document.getElementById('cookie-ok');
  const no = document.getElementById('cookie-no');
  if (ok) ok.addEventListener('click', () => { localStorage.setItem('cookie_ok', '1'); notice.remove(); });
  if (no) no.addEventListener('click', () => notice.remove());
})();

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - navH - 16, behavior: 'smooth' });
  });
});
