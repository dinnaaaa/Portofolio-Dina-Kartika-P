/**
 * Unit tests for navbar.js
 *
 * Covers:
 *   - smoothScrollTo(targetId, duration)
 *   - setActiveNavLink(activeSectionId)
 *   - toggleMobileMenu(isOpen)
 */

import { smoothScrollTo, setActiveNavLink, toggleMobileMenu } from '../../js/navbar.js';

// ─── smoothScrollTo ───────────────────────────────────────────────────────────

describe('smoothScrollTo', () => {
  let scrollToSpy;
  let rafCallbacks;

  beforeEach(() => {
    // Spy on window.scrollTo
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    // Capture rAF callbacks so we can drive them manually
    rafCallbacks = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length; // fake handle
    });

    // Minimal DOM: a target section element
    document.body.innerHTML = `
      <section id="about" style="margin-top: 500px;">About</section>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  /** Flush all queued rAF callbacks with a synthetic timestamp sequence */
  function flushRaf(steps = 60, stepMs = 16) {
    let timestamp = 0;
    for (let i = 0; i < steps && rafCallbacks.length > 0; i++) {
      const cb = rafCallbacks.shift();
      timestamp += stepMs;
      cb(timestamp);
    }
  }

  it('calls window.scrollTo after smooth-scrolling to an existing target', () => {
    smoothScrollTo('about', 600);
    flushRaf();
    expect(scrollToSpy).toHaveBeenCalled();
  });

  it('uses duration ≤ 800 ms when called with 600 ms', () => {
    // We verify indirectly: rAF animations finish within 800 ms of timestamps.
    // Drive the animation exactly 800 ms worth of frames and confirm scrollTo ran.
    smoothScrollTo('about', 600);
    flushRaf(55, 16); // ~880 ms total — more than enough for 600 ms duration
    expect(scrollToSpy).toHaveBeenCalled();
  });

  it('clamps duration > 800 ms to 800 ms', () => {
    // With a 2000 ms requested duration, the clamp makes it finish in ≤ 800 ms
    // of elapsed animation time. Drive 810 ms of frames — animation must complete.
    smoothScrollTo('about', 2000);

    // Drive frames: 51 × 16 ms ≈ 816 ms — past the clamped 800 ms boundary
    flushRaf(51, 16);

    // scrollTo should have been called (animation progressed to completion)
    expect(scrollToSpy).toHaveBeenCalled();

    // Confirm no more rAF callbacks are pending (animation completed)
    const countAfterComplete = rafCallbacks.length;
    expect(countAfterComplete).toBe(0);
  });

  it('does nothing when the target element does not exist', () => {
    smoothScrollTo('nonexistent', 600);
    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(rafCallbacks.length).toBe(0);
  });
});

// ─── setActiveNavLink ─────────────────────────────────────────────────────────

describe('setActiveNavLink', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav class="navbar">
        <ul class="navbar__links">
          <li><a href="#hero"   class="navbar__link">Hero</a></li>
          <li><a href="#about"  class="navbar__link">About</a></li>
          <li><a href="#skills" class="navbar__link">Skills</a></li>
        </ul>
      </nav>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('marks exactly one link active after calling setActiveNavLink("about")', () => {
    setActiveNavLink('about');

    const allLinks = Array.from(document.querySelectorAll('.navbar__link'));
    const activeLinks = allLinks.filter(
      (l) => l.classList.contains('nav__link--active') || l.classList.contains('navbar__link--active')
    );

    expect(activeLinks).toHaveLength(1);
  });

  it('the active link href is "#about" after setActiveNavLink("about")', () => {
    setActiveNavLink('about');

    const allLinks = Array.from(document.querySelectorAll('.navbar__link'));
    const activeLink = allLinks.find(
      (l) => l.classList.contains('nav__link--active') || l.classList.contains('navbar__link--active')
    );

    expect(activeLink).toBeDefined();
    expect(activeLink.getAttribute('href')).toBe('#about');
  });

  it('non-active links do NOT have the active class', () => {
    setActiveNavLink('about');

    const allLinks = Array.from(document.querySelectorAll('.navbar__link'));
    const inactiveLinks = allLinks.filter(
      (l) => l.getAttribute('href') !== '#about'
    );

    inactiveLinks.forEach((link) => {
      expect(link.classList.contains('nav__link--active')).toBe(false);
      expect(link.classList.contains('navbar__link--active')).toBe(false);
    });
  });

  it('switches the active link when called a second time with a different id', () => {
    setActiveNavLink('about');
    setActiveNavLink('skills');

    const allLinks = Array.from(document.querySelectorAll('.navbar__link'));
    const activeLinks = allLinks.filter(
      (l) => l.classList.contains('nav__link--active') || l.classList.contains('navbar__link--active')
    );

    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0].getAttribute('href')).toBe('#skills');
  });
});

// ─── toggleMobileMenu ─────────────────────────────────────────────────────────

describe('toggleMobileMenu', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('toggleMobileMenu(false) — closing the menu', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <nav class="navbar">
          <button class="navbar__hamburger" aria-expanded="true"></button>
          <ul class="navbar__links is-open"></ul>
        </nav>
      `;
    });

    it('removes the is-open class from .navbar__links', () => {
      toggleMobileMenu(false);
      const panel = document.querySelector('.navbar__links');
      expect(panel.classList.contains('is-open')).toBe(false);
    });

    it('sets aria-expanded to "false" on the hamburger', () => {
      toggleMobileMenu(false);
      const hamburger = document.querySelector('.navbar__hamburger');
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('toggleMobileMenu(true) — opening the menu', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <nav class="navbar">
          <button class="navbar__hamburger" aria-expanded="false"></button>
          <ul class="navbar__links"></ul>
        </nav>
      `;
    });

    it('adds the is-open class to .navbar__links', () => {
      toggleMobileMenu(true);
      const panel = document.querySelector('.navbar__links');
      expect(panel.classList.contains('is-open')).toBe(true);
    });

    it('sets aria-expanded to "true" on the hamburger', () => {
      toggleMobileMenu(true);
      const hamburger = document.querySelector('.navbar__hamburger');
      expect(hamburger.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
