/**
 * navbar.js — Sticky Navbar: smooth scroll, active link highlight, hamburger
 *
 * Exports:
 *   initNavbar()                    — main entry point, call once on DOMContentLoaded
 *   smoothScrollTo(targetId, duration) — easeInOutCubic rAF scroll
 *   setActiveNavLink(activeSectionId)  — updates .nav__link--active classes
 *   toggleMobileMenu(isOpen)           — opens / closes the mobile panel
 */

// ─── Smooth Scroll ────────────────────────────────────────────────────────────

/**
 * Smoothly scrolls the page to the element with the given ID.
 *
 * @param {string} targetId   - The `id` of the destination section element
 * @param {number} [duration=600] - Scroll duration in ms (capped at 800 ms)
 */
export function smoothScrollTo(targetId, duration = 600) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const clampedDuration = Math.min(duration, 800);
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / clampedDuration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ─── Active Link ─────────────────────────────────────────────────────────────

/**
 * Removes the active class from all nav links and adds it to the one whose
 * `href` ends with `#${activeSectionId}`.
 *
 * @param {string} activeSectionId
 */
export function setActiveNavLink(activeSectionId) {
  const navLinks = document.querySelectorAll('.navbar__link');

  navLinks.forEach((link) => {
    link.classList.remove('nav__link--active', 'navbar__link--active');
    link.removeAttribute('aria-current');
  });

  const activeLink = Array.from(navLinks).find((link) => {
    const href = link.getAttribute('href') || '';
    return href === `#${activeSectionId}` || href.endsWith(`#${activeSectionId}`);
  });

  if (activeLink) {
    activeLink.classList.add('nav__link--active', 'navbar__link--active');
    activeLink.setAttribute('aria-current', 'true');
  }
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

/**
 * Opens or closes the mobile navigation panel.
 *
 * @param {boolean} isOpen
 */
export function toggleMobileMenu(isOpen) {
  const hamburger = document.querySelector('.navbar__hamburger');
  const panel =
    document.getElementById('nav-panel') ||
    document.querySelector('.navbar__links');
  const backdrop = document.querySelector('.navbar__backdrop');

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  if (panel) {
    panel.classList.toggle('is-open', isOpen);
  }

  if (backdrop) {
    backdrop.classList.toggle('is-visible', isOpen);
  }
}

// ─── Escape / Outside-click close ────────────────────────────────────────────

function handleKeydown(e) {
  if (e.key === 'Escape') {
    toggleMobileMenu(false);
  }
}

function handleOutsideClick(e) {
  const navbar = document.querySelector('.navbar');
  if (navbar && !navbar.contains(e.target)) {
    toggleMobileMenu(false);
  }
}

// ─── Initializer ──────────────────────────────────────────────────────────────

/**
 * Sets up all navbar behaviours.
 * Should be called once after DOMContentLoaded.
 */
export function initNavbar() {
  // ── IntersectionObserver for active link ──────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNavLink(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -50% 0px',
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ── Nav link click: smooth scroll + close mobile menu ─────────────────────
  const navLinks = document.querySelectorAll('.navbar__link');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const targetId = href.startsWith('#') ? href.slice(1) : null;

      if (targetId) {
        e.preventDefault();
        smoothScrollTo(targetId);
        toggleMobileMenu(false);
      }
    });
  });

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  const hamburger = document.querySelector('.navbar__hamburger');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isCurrentlyOpen =
        hamburger.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isCurrentlyOpen);

      if (!isCurrentlyOpen) {
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('click', handleOutsideClick);
      } else {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', handleOutsideClick);
      }
    });
  }

  // ── Backdrop click ────────────────────────────────────────────────────────
  const backdrop = document.querySelector('.navbar__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  }
}
