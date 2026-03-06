/* ==============================================
   TextDrop — main.js (shared across all pages)
   © 2025 TextDrop. All rights reserved.
   ============================================== */

/* ── Mark active nav link based on current page ── */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-menu a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === path) {
      a.classList.add('active');
    }
  });
})();

/* ── Mobile Menu Toggle ── */
function toggleMob() {
  document.getElementById('mobMenu').classList.toggle('open');
}
function closeMob() {
  document.getElementById('mobMenu').classList.remove('open');
}

/* ── Apply saved theme on every page load ── */
(function applyTheme() {
  const theme = localStorage.getItem('td_theme') || 'dark';
  if (theme === 'light') {
    document.body.classList.add('light');
  }
})();

/* ── Footer year ── */
(function setYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
})();
