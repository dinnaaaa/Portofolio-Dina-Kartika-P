/**
 * cv.js — CV Download Availability Check
 *
 * Performs a HEAD request on page load to verify the CV file is accessible.
 * If unavailable, disables all CV download buttons and shows an error message.
 */

/**
 * Checks whether the CV file is available and disables download buttons if not.
 *
 * @param {string} cvUrl - Path to the CV PDF file
 * @returns {Promise<void>}
 */
export async function handleCVDownload(cvUrl) {
  try {
    const response = await fetch(cvUrl, { method: 'HEAD' });
    if (!response.ok) throw new Error('CV tidak tersedia');
    // File is available — buttons remain active
  } catch (_error) {
    const cvButtons = document.querySelectorAll(
      '[href*="dina-cv.pdf"], [data-cv-download]'
    );

    cvButtons.forEach((btn) => {
      btn.setAttribute('aria-disabled', 'true');
      if (btn.tagName === 'BUTTON') {
        btn.disabled = true;
      }
    });

    showCVError(
      'CV saat ini tidak tersedia. Silakan hubungi melalui formulir kontak.'
    );
  }
}

/**
 * Displays a CV unavailability error message.
 *
 * @param {string} message
 */
function showCVError(message) {
  const errorEl = document.querySelector('.about__cv-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }
}
