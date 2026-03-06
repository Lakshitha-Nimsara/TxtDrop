/* ==============================================
   TextDrop — contact.js (Contact form logic)
   Sends form data to php/mail.php via fetch()
   © 2025 TextDrop. All rights reserved.
   ============================================== */

async function submitContact() {
  var name    = document.getElementById('cName').value.trim();
  var email   = document.getElementById('cEmail').value.trim();
  var subject = document.getElementById('cSubject').value.trim();
  var msg     = document.getElementById('cMsg').value.trim();
  var status  = document.getElementById('contactStatus');
  var btn     = document.getElementById('submitBtn');

  /* Basic validation */
  if (!name || !email || !msg) {
    showStatus('error', '⚠ Please fill in your name, email, and message.');
    return;
  }
  if (!isValidEmail(email)) {
    showStatus('error', '⚠ Please enter a valid email address.');
    return;
  }

  /* Show loading */
  btn.textContent = 'Sending...';
  btn.disabled    = true;

  try {
    var formData = new FormData();
    formData.append('name',    name);
    formData.append('email',   email);
    formData.append('subject', subject || 'Contact from TextDrop');
    formData.append('message', msg);

    var response = await fetch('php/mail.php', {
      method: 'POST',
      body: formData
    });

    var result = await response.json();

    if (result.success) {
      showStatus('success', '✅ Message sent! We will get back to you soon.');
      /* Clear the form */
      ['cName', 'cEmail', 'cSubject', 'cMsg'].forEach(function (id) {
        document.getElementById(id).value = '';
      });
    } else {
      showStatus('error', '❌ ' + (result.message || 'Something went wrong. Please email us directly.'));
    }

  } catch (err) {
    showStatus('error', '❌ Could not connect. Please email us at: txtdropping@gmail.com');
  }

  btn.textContent = 'Send Message';
  btn.disabled    = false;
}

/* ── Show status message ── */
function showStatus(type, text) {
  var el = document.getElementById('contactStatus');
  el.style.display      = 'block';
  el.textContent        = text;
  el.style.color        = type === 'success' ? 'var(--success)' : 'var(--danger)';
  el.style.background   = type === 'success' ? 'rgba(52,211,153,0.08)' : 'rgba(240,82,82,0.08)';
  el.style.border       = '1px solid ' + (type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(240,82,82,0.3)');
}

/* ── Email validator ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
