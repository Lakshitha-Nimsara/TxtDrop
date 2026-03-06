/* ==============================================
   TextDrop — settings.js (Settings page logic)
   © 2025 TextDrop. All rights reserved.
   ============================================== */

/* ── Load and display all saved settings ── */
function loadSettings() {
  /* Theme */
  var theme   = localStorage.getItem('td_theme') || 'dark';
  var isLight = theme === 'light';
  document.body.classList.toggle('light', isLight);
  var tt = document.getElementById('themeToggle');
  if (tt) tt.checked = isLight;

  /* Font size */
  var sz   = localStorage.getItem('td_fontSize') || '15';
  var fsel = document.getElementById('fontSizeSelect');
  if (fsel) fsel.value = sz;

  /* Line height */
  var lh   = localStorage.getItem('td_lineHeight') || '1.7';
  var lsel = document.getElementById('lineHeightSelect');
  if (lsel) lsel.value = lh;

  /* Spellcheck */
  var sp    = localStorage.getItem('td_spellcheck');
  var spVal = (sp === null) ? true : (sp === 'true');
  var spT   = document.getElementById('spellToggle');
  if (spT) spT.checked = spVal;

  /* Default filename */
  var dfn   = localStorage.getItem('td_defaultFilename') || '';
  var dfnEl = document.getElementById('defaultFilename');
  if (dfnEl) dfnEl.value = dfn;

  /* Clear on save */
  var cos   = localStorage.getItem('td_clearOnSave') === 'true';
  var cosEl = document.getElementById('clearOnSave');
  if (cosEl) cosEl.checked = cos;
}

/* ── Toggle Theme ── */
function toggleTheme() {
  var isLight = document.getElementById('themeToggle').checked;
  document.body.classList.toggle('light', isLight);
  localStorage.setItem('td_theme', isLight ? 'light' : 'dark');
}

/* ── Change Font Size ── */
function changeFontSize() {
  var sz = document.getElementById('fontSizeSelect').value;
  localStorage.setItem('td_fontSize', sz);
}

/* ── Change Line Height ── */
function changeLineHeight() {
  var lh = document.getElementById('lineHeightSelect').value;
  localStorage.setItem('td_lineHeight', lh);
}

/* ── Toggle Spellcheck ── */
function toggleSpell() {
  var v = document.getElementById('spellToggle').checked;
  localStorage.setItem('td_spellcheck', v);
}

/* ── Save Default Filename ── */
function saveDefaultFilename() {
  var v = document.getElementById('defaultFilename').value.trim();
  localStorage.setItem('td_defaultFilename', v || 'my-text');
}

/* ── Save any boolean setting ── */
function saveSetting(key, val) {
  localStorage.setItem('td_' + key, val);
}

/* ── Reset All Settings ── */
function resetSettings() {
  if (!confirm('Reset all settings to their defaults?')) return;
  [
    'td_theme', 'td_fontSize', 'td_lineHeight',
    'td_spellcheck', 'td_defaultFilename', 'td_clearOnSave'
  ].forEach(function (k) { localStorage.removeItem(k); });
  loadSettings();
  document.body.classList.remove('light');
}

/* ── Init ── */
loadSettings();
