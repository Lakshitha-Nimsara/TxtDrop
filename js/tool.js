/* ==============================================
   TextDrop — tool.js (Editor page logic)
   © 2025 TextDrop. All rights reserved.
   ============================================== */

/* ── Apply saved editor settings on load ── */
(function applyEditorSettings() {
  var ed = document.getElementById('editor');
  if (!ed) return;
  var sz = localStorage.getItem('td_fontSize') || '15';
  var lh = localStorage.getItem('td_lineHeight') || '1.7';
  var sp = localStorage.getItem('td_spellcheck');
  ed.style.fontSize  = sz + 'px';
  ed.style.lineHeight = lh;
  ed.spellcheck = (sp === null) ? true : (sp === 'true');
  updateCount();
})();

/* ── Save as .TXT ── */
function saveTxt() {
  var text = document.getElementById('editor').value;
  if (!text.trim()) {
    alert('The editor is empty. Please type something first.');
    return;
  }
  var rawName = document.getElementById('filenameInput').value.trim();
  var defName = localStorage.getItem('td_defaultFilename') || 'my-text';
  var filename = rawName || defName;
  filename = filename.replace(/[^a-zA-Z0-9\-_. ]/g, '').trim() || defName;
  if (!filename.toLowerCase().endsWith('.txt')) filename += '.txt';

  var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  /* Show toast */
  var t = document.getElementById('saveToast');
  if (t) {
    t.style.display = 'block';
    setTimeout(function () { t.style.display = 'none'; }, 2800);
  }

  /* Clear on save option */
  if (localStorage.getItem('td_clearOnSave') === 'true') {
    document.getElementById('editor').value = '';
    updateCount();
  }

  setStatus('Saved as ' + filename);
}

/* ── Clear Editor ── */
function clearEditor() {
  var ed = document.getElementById('editor');
  if (ed.value && !confirm('Clear all text in the editor?')) return;
  ed.value = '';
  updateCount();
  setStatus('Editor cleared');
}

/* ── Select All ── */
function selectAll() {
  var ed = document.getElementById('editor');
  ed.focus();
  ed.select();
}

/* ── Copy All ── */
function copyAll() {
  var text = document.getElementById('editor').value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(function () {
    setStatus('Copied to clipboard!');
    setTimeout(function () { setStatus('Ready'); }, 2200);
  }).catch(function () {
    setStatus('Use Ctrl+A then Ctrl+C to copy');
  });
}

/* ── Paste ── */
function pasteText() {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    setStatus('Use Ctrl+V / Cmd+V to paste');
    return;
  }
  navigator.clipboard.readText().then(function (text) {
    var ed = document.getElementById('editor');
    var s  = ed.selectionStart;
    var e  = ed.selectionEnd;
    ed.value = ed.value.substring(0, s) + text + ed.value.substring(e);
    ed.selectionStart = ed.selectionEnd = s + text.length;
    updateCount();
  }).catch(function () {
    setStatus('Use Ctrl+V / Cmd+V to paste');
  });
}

/* ── Insert Date / Time ── */
function insertDate() {
  var d = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  insertAtCursor(d);
}
function insertTime() {
  var t = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });
  insertAtCursor(t);
}
function insertAtCursor(text) {
  var ed = document.getElementById('editor');
  ed.focus();
  var s = ed.selectionStart, e = ed.selectionEnd;
  ed.value = ed.value.substring(0, s) + text + ed.value.substring(e);
  ed.selectionStart = ed.selectionEnd = s + text.length;
  updateCount();
}

/* ── Word / Char / Line Counter ── */
function updateCount() {
  var val   = document.getElementById('editor').value;
  var chars = val.length;
  var words = val.trim() ? val.trim().split(/\s+/).length : 0;
  var lines = val ? val.split('\n').length : 1;
  var el    = document.getElementById('charCount');
  if (!el) return;
  var isMobile = window.innerWidth <= 480;
  if (isMobile) {
    el.textContent = chars.toLocaleString() + ' chars · ' + words.toLocaleString() + ' words';
  } else {
    el.textContent =
      chars.toLocaleString() + ' chars · ' +
      words.toLocaleString() + ' words · ' +
      lines.toLocaleString() + ' lines';
  }
}

/* ── Status bar helper ── */
function setStatus(msg) {
  var el = document.getElementById('editorStatus');
  if (el) el.textContent = msg;
}

/* ── Keyboard shortcut: Ctrl+S / Cmd+S ── */
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveTxt();
  }
});
