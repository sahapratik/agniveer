/* ── AGNIVEER BANGLA — main.js (standalone, no external deps) ── */
"use strict";

/* ── NAV SCROLL BEHAVIOUR ─────────────────────────────────────── */
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const onScroll = () => {
    const solid = window.scrollY > 60;
    nav.classList.toggle('nav-solid', solid);
    nav.classList.toggle('nav-transparent', !solid);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER / MOBILE MENU ─────────────────────────────────── */
(function () {
  const btn = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.classList.toggle('open', !open);
    menu.classList.toggle('open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
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
    els.forEach(el => el.classList.add('vis'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
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
  const toBN = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  // Indian-style digit grouping: last 3 digits, then groups of 2 (e.g. 50000 -> 50,000)
  const groupIndian = n => {
    const s = String(Math.round(n));
    if (s.length <= 3) return s;
    let last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    const groups = [];
    while (rest.length > 2) { groups.unshift(rest.slice(-2)); rest = rest.slice(0, -2); }
    if (rest) groups.unshift(rest);
    return groups.join(',') + ',' + last3;
  };
  const animateCounter = el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = toBN(groupIndian(current)) + suffix;
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
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── COOKIE NOTICE ───────────────────────────────────────────── */
(function () {
  const notice = document.getElementById('cookie-notice');
  if (!notice) return;
  if (localStorage.getItem('cookie_ok')) { notice.remove(); return; }
  setTimeout(() => notice.classList.add('show'), 1500);
  const ok = document.getElementById('cookie-ok');
  const no = document.getElementById('cookie-no');
  if (ok) ok.addEventListener('click', () => { localStorage.setItem('cookie_ok', '1'); notice.classList.remove('show'); });
  if (no) no.addEventListener('click', () => notice.classList.remove('show'));
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
