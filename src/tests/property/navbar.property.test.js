// Feature: portfolio-profile, Property 1: setActiveNavLink sets exactly one active nav link

/**
 * Property-based tests for navbar.js
 *
 * Property 1: setActiveNavLink sets exactly one active link matching sectionId
 * Validates: Requirements 1.4
 */

import * as fc from 'fast-check';
import { setActiveNavLink, toggleMobileMenu } from '../../js/navbar.js';

const SECTION_IDS = ['hero', 'about', 'skills', 'portfolio', 'contact'];

/**
 * Build a minimal nav DOM with all 5 .navbar__link anchors in jsdom.
 */
function buildNavDOM() {
  document.body.innerHTML = `
    <nav class="navbar">
      <ul class="navbar__links" id="nav-panel" role="list">
        <li><a href="#hero" class="navbar__link">Beranda</a></li>
        <li><a href="#about" class="navbar__link">Tentang</a></li>
        <li><a href="#skills" class="navbar__link">Keahlian</a></li>
        <li><a href="#portfolio" class="navbar__link">Portofolio</a></li>
        <li><a href="#contact" class="navbar__link">Kontak</a></li>
      </ul>
    </nav>
  `;
}

describe('Property 1 — Active Nav Link Exclusivity', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Exactly one nav link is active and its href contains the given sectionId', () => {
    fc.assert(
      fc.property(fc.constantFrom(...SECTION_IDS), (sectionId) => {
        buildNavDOM();

        setActiveNavLink(sectionId);

        const navLinks = Array.from(document.querySelectorAll('.navbar__link'));

        const activeLinks = navLinks.filter((link) =>
          link.classList.contains('nav__link--active')
        );

        // Exactly one link must have the active class
        expect(activeLinks).toHaveLength(1);

        // That link's href must contain #sectionId
        const activeHref = activeLinks[0].getAttribute('href') || '';
        expect(
          activeHref === `#${sectionId}` || activeHref.endsWith(`#${sectionId}`)
        ).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: portfolio-profile, Property 2: toggleMobileMenu(isOpen) panel visibility matches isOpen

/**
 * Property 2: toggleMobileMenu round-trip — panel visibility matches isOpen
 * Validates: Requirements 1.6
 */

/**
 * Build a minimal mobile-nav DOM with hamburger, nav-panel, and backdrop.
 */
function buildMobileMenuDOM() {
  document.body.innerHTML = `
    <nav class="navbar">
      <button class="navbar__hamburger" aria-expanded="false" aria-label="Toggle menu"></button>
      <ul class="navbar__links" id="nav-panel">
        <li><a href="#hero" class="navbar__link">Beranda</a></li>
      </ul>
      <div class="navbar__backdrop"></div>
    </nav>
  `;
}

describe('Property 2 — Mobile Menu Toggle Round-Trip', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Panel visibility matches isOpen for any boolean value', () => {
    // Feature: portfolio-profile, Property 2: toggleMobileMenu(isOpen) panel visibility matches isOpen
    fc.assert(
      fc.property(fc.boolean(), (isOpen) => {
        buildMobileMenuDOM();

        toggleMobileMenu(isOpen);

        const panel = document.getElementById('nav-panel') ||
          document.querySelector('.navbar__links');
        const hamburger = document.querySelector('.navbar__hamburger');

        expect(panel.classList.contains('is-open')).toBe(isOpen);
        expect(hamburger.getAttribute('aria-expanded')).toBe(String(isOpen));
      }),
      { numRuns: 100 }
    );
  });

  it('Open then close always results in hidden state', () => {
    // Feature: portfolio-profile, Property 2: toggleMobileMenu(isOpen) panel visibility matches isOpen
    fc.assert(
      fc.property(fc.constant(null), () => {
        buildMobileMenuDOM();

        toggleMobileMenu(true);
        toggleMobileMenu(false);

        const panel = document.getElementById('nav-panel') ||
          document.querySelector('.navbar__links');
        const hamburger = document.querySelector('.navbar__hamburger');

        expect(panel.classList.contains('is-open')).toBe(false);
        expect(hamburger.getAttribute('aria-expanded')).toBe('false');
      }),
      { numRuns: 100 }
    );
  });
});
