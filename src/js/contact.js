/**
 * contact.js — Contact Form Validation & Submission
 */

/**
 * Validates an email address string using simple structural rules.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (!email.includes('@')) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (localPart.length === 0) return false;
  if (!domain.includes('.')) return false;

  const domainParts = domain.split('.');
  if (domainParts[0].length === 0) return false;
  if (domainParts[domainParts.length - 1].length === 0) return false;

  return true;
}

/**
 * Validates all contact form fields.
 *
 * @param {{ fullName: string, email: string, subject: string, message: string }} data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateContactForm(data) {
  const errors = {};

  const fullName = (data.fullName || '').trim();
  const email = (data.email || '').trim();
  const subject = (data.subject || '').trim();
  const message = (data.message || '').trim();

  if (!fullName) {
    errors.fullName = 'Nama lengkap wajib diisi.';
  }

  if (!email) {
    errors.email = 'Alamat email wajib diisi.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Format email tidak valid. Contoh: nama@domain.com';
  }

  if (!subject) {
    errors.subject = 'Subjek pesan wajib diisi.';
  }

  if (!message) {
    errors.message = 'Pesan tidak boleh kosong.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function clearErrors(form) {
  form.querySelectorAll('.form__error').forEach((el) => {
    el.textContent = '';
    el.removeAttribute('role');
  });
}

function displayErrors(form, errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input) return;

    const describedBy = input.getAttribute('aria-describedby');
    const errorEl = describedBy
      ? document.getElementById(describedBy)
      : form.querySelector(`.form__error[data-field="${field}"]`);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.setAttribute('role', 'alert');
    }
  });
}

function showToast(message, type = 'success') {
  const statusEl = document.getElementById('form-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `form-status form-status--${type} is-${type}`;
  statusEl.setAttribute('role', 'status');
  statusEl.setAttribute('aria-live', 'polite');

  setTimeout(() => {
    statusEl.className = '';
    statusEl.textContent = '';
  }, 5000);
}

/**
 * Wires up the #contact-form submit event handler.
 */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const data = {
      fullName: form.querySelector('[name="fullName"]')?.value || '',
      email: form.querySelector('[name="email"]')?.value || '',
      subject: form.querySelector('[name="subject"]')?.value || '',
      message: form.querySelector('[name="message"]')?.value || '',
    };

    const { isValid, errors } = validateContactForm(data);

    if (!isValid) {
      displayErrors(form, errors);
      const firstErrorField = Object.keys(errors)[0];
      form.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    // Show success notification within 2 seconds (Requirement 6.2)
    setTimeout(() => {
      showToast('Pesan berhasil dikirim! Terima kasih telah menghubungi saya.', 'success');
    }, 300);

    const trimmed = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };

    const mailtoBody = encodeURIComponent(
      `Dari: ${trimmed.fullName} <${trimmed.email}>\n\n${trimmed.message}`
    );
    const mailtoSubject = encodeURIComponent(trimmed.subject);
    const mailtoLink = `mailto:dina.kartika@example.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    window.location.href = mailtoLink;
    form.reset();
  });
}
