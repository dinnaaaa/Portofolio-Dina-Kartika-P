/**
 * about.test.js — Unit tests for CV download handler
 *
 * Tests the handleCVDownload function from cv.js across three scenarios:
 * successful fetch, failed fetch (ok: false), and network error.
 */

import { handleCVDownload } from '../../js/cv.js';

describe('handleCVDownload', () => {
  const CV_URL = '/src/assets/cv/dina-cv.pdf';

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('does NOT disable the button when fetch succeeds (ok: true)', async () => {
    // Arrange
    document.body.innerHTML = `
      <a href="/src/assets/cv/dina-cv.pdf" data-cv-download class="btn-download-cv">Download CV</a>
    `;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    // Act
    await handleCVDownload(CV_URL);

    // Assert
    const btn = document.querySelector('[data-cv-download]');
    expect(btn.getAttribute('aria-disabled')).not.toBe('true');
    expect(btn.disabled).toBeFalsy();
  });

  it('disables the button when fetch responds with ok: false', async () => {
    // Arrange
    document.body.innerHTML = `
      <a href="/src/assets/cv/dina-cv.pdf" data-cv-download class="btn-download-cv">Download CV</a>
      <div class="about__cv-error"></div>
    `;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    // Act
    await handleCVDownload(CV_URL);

    // Assert
    const btn = document.querySelector('[data-cv-download]');
    expect(btn.getAttribute('aria-disabled')).toBe('true');

    const errorEl = document.querySelector('.about__cv-error');
    expect(errorEl.textContent.trim().length).toBeGreaterThan(0);
  });

  it('disables the button when fetch throws a network error', async () => {
    // Arrange
    document.body.innerHTML = `
      <a href="/src/assets/cv/dina-cv.pdf" data-cv-download class="btn-download-cv">Download CV</a>
      <div class="about__cv-error"></div>
    `;
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    // Act
    await handleCVDownload(CV_URL);

    // Assert
    const btn = document.querySelector('[data-cv-download]');
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });
});
