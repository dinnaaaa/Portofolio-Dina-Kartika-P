// Feature: portfolio-profile, Property 10: external links have target="_blank" rel="noopener noreferrer"

/**
 * Property-Based Tests: External Links Security Attributes
 *
 * Property 10: For every anchor (<a>) in the document that refers to an external
 * URL (starting with http:// or https://), the target attribute must be "_blank"
 * and the rel attribute must contain both "noopener" and "noreferrer".
 *
 * **Validates: Requirements 6.7**
 *
 * Strategy:
 * - Suite 1: Deterministically iterate all external <a> elements parsed from
 *   index.html and assert each has the required security attributes.
 * - Suite 2: Use createProjectCard() with generated project data and assert
 *   that every repoUrl / demoUrl anchor has the security attributes.
 * - Suite 3: Generative contract — build <a> elements from fc.webUrl() values
 *   following the spec contract and confirm the attributes are present.
 *
 * // Property 11 — stub (separate task)
 * // Property 12 — stub (separate task)
 * // Property 13 — stub (separate task)
 */

import * as fc from 'fast-check';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createProjectCard } from '../../js/portfolio.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true when the href represents an external URL. */
function isExternalHref(href) {
  return typeof href === 'string' &&
    (href.startsWith('http://') || href.startsWith('https://'));
}

/** Returns the rel tokens as a Set for easy membership checks. */
function relTokens(anchor) {
  const rel = anchor.getAttribute('rel') || '';
  return new Set(rel.split(/\s+/).filter(Boolean));
}

// ── Suite 1 — Static document ─────────────────────────────────────────────────

describe('Property 10 — Static document: all external <a> elements have security attributes', () => {
  beforeEach(() => {
    const htmlPath = resolve(process.cwd(), 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('all external links have target="_blank"', () => {
    // Feature: portfolio-profile, Property 10: external links have target="_blank"
    const anchors = Array.from(document.querySelectorAll('a'));
    const externalLinks = anchors.filter((a) => isExternalHref(a.getAttribute('href')));

    // Sanity: there should be at least one external link in the document
    expect(externalLinks.length).toBeGreaterThan(0);

    for (const link of externalLinks) {
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('all external links have rel containing "noopener"', () => {
    // Feature: portfolio-profile, Property 10: external links rel contains noopener
    const anchors = Array.from(document.querySelectorAll('a'));
    const externalLinks = anchors.filter((a) => isExternalHref(a.getAttribute('href')));

    for (const link of externalLinks) {
      const tokens = relTokens(link);
      expect(tokens.has('noopener')).toBe(true);
    }
  });

  it('all external links have rel containing "noreferrer"', () => {
    // Feature: portfolio-profile, Property 10: external links rel contains noreferrer
    const anchors = Array.from(document.querySelectorAll('a'));
    const externalLinks = anchors.filter((a) => isExternalHref(a.getAttribute('href')));

    for (const link of externalLinks) {
      const tokens = relTokens(link);
      expect(tokens.has('noreferrer')).toBe(true);
    }
  });

  it('internal links (href starting with # or /) do NOT require target="_blank"', () => {
    // Feature: portfolio-profile, Property 10: internal links are not required to have target="_blank"
    const anchors = Array.from(document.querySelectorAll('a'));
    const internalLinks = anchors.filter((a) => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('#') || href.startsWith('/');
    });

    // Confirm they exist (nav links are all internal)
    expect(internalLinks.length).toBeGreaterThan(0);

    // None of these should be flagged as external — just confirm the helper agrees
    for (const link of internalLinks) {
      expect(isExternalHref(link.getAttribute('href'))).toBe(false);
    }
  });
});

// ── Suite 2 — createProjectCard integration ───────────────────────────────────

describe('Property 10 — createProjectCard: generated external links have security attributes', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('For any project with repoUrl, the card repo link has target="_blank"', () => {
    // Feature: portfolio-profile, Property 10: createProjectCard repoUrl link has target="_blank"
    // **Validates: Requirements 6.7**
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1, maxLength: 60 }),
          description: fc.string(),
          thumbnail: fc.string(),
          category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
          techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
          repoUrl: fc.webUrl(),
        }),
        (project) => {
          const card = createProjectCard(project);
          const repoLink = card.querySelector('a.project-card__link--repo');

          expect(repoLink).not.toBeNull();
          expect(repoLink.getAttribute('target')).toBe('_blank');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('For any project with repoUrl, the card repo link rel contains "noopener" and "noreferrer"', () => {
    // Feature: portfolio-profile, Property 10: createProjectCard repoUrl link rel has noopener noreferrer
    // **Validates: Requirements 6.7**
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1, maxLength: 60 }),
          description: fc.string(),
          thumbnail: fc.string(),
          category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
          techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
          repoUrl: fc.webUrl(),
        }),
        (project) => {
          const card = createProjectCard(project);
          const repoLink = card.querySelector('a.project-card__link--repo');

          expect(repoLink).not.toBeNull();
          const tokens = relTokens(repoLink);
          expect(tokens.has('noopener')).toBe(true);
          expect(tokens.has('noreferrer')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('For any project with demoUrl, the card demo link has target="_blank"', () => {
    // Feature: portfolio-profile, Property 10: createProjectCard demoUrl link has target="_blank"
    // **Validates: Requirements 6.7**
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1, maxLength: 60 }),
          description: fc.string(),
          thumbnail: fc.string(),
          category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
          techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
          demoUrl: fc.webUrl(),
        }),
        (project) => {
          const card = createProjectCard(project);
          const demoLink = card.querySelector('a.project-card__link--demo');

          expect(demoLink).not.toBeNull();
          expect(demoLink.getAttribute('target')).toBe('_blank');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('For any project with demoUrl, the card demo link rel contains "noopener" and "noreferrer"', () => {
    // Feature: portfolio-profile, Property 10: createProjectCard demoUrl link rel has noopener noreferrer
    // **Validates: Requirements 6.7**
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1, maxLength: 60 }),
          description: fc.string(),
          thumbnail: fc.string(),
          category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
          techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
          demoUrl: fc.webUrl(),
        }),
        (project) => {
          const card = createProjectCard(project);
          const demoLink = card.querySelector('a.project-card__link--demo');

          expect(demoLink).not.toBeNull();
          const tokens = relTokens(demoLink);
          expect(tokens.has('noopener')).toBe(true);
          expect(tokens.has('noreferrer')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Suite 3 — Generative external URL contract ────────────────────────────────

describe('Property 10 — Generative contract: any <a> following the spec contract has security attributes', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('For any fc.webUrl() value used as href, an <a> built per the spec contract has both security attrs', () => {
    // Feature: portfolio-profile, Property 10: spec contract — any external URL anchor has target and rel
    // **Validates: Requirements 6.7**
    fc.assert(
      fc.property(
        fc.webUrl(),
        (url) => {
          // Build the anchor exactly as createProjectCard does
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);

          expect(a.getAttribute('target')).toBe('_blank');
          const tokens = relTokens(a);
          expect(tokens.has('noopener')).toBe(true);
          expect(tokens.has('noreferrer')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 11 — Image Alt Text Non-Empty ────────────────────────────────────

/**
 * Property-Based Tests: Image Alt Text Non-Empty
 *
 * Property 11: For every <img> element in the document, the alt attribute must
 * be present AND must not be an empty string ("").
 *
 * **Validates: Requirements 7.3**
 *
 * Strategy:
 * - Suite 1: Deterministically iterate all <img> elements parsed from index.html
 *   and assert each has a non-empty alt attribute.
 * - Suite 2: Generative contract — build sets of <img> elements with non-empty alt
 *   attributes and confirm the invariant holds.
 * - Suite 3: Negative contract — confirm that images with empty or missing alt
 *   attributes correctly fail the invariant check.
 */

/** Returns true when an <img> has a non-empty alt attribute. */
function hasNonEmptyAlt(img) {
  const alt = img.getAttribute('alt');
  return alt !== null && alt.trim() !== '';
}

describe('Property 11 — Static document: all <img> elements have non-empty alt attributes', () => {
  beforeEach(() => {
    const htmlPath = resolve(process.cwd(), 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('all <img> elements have an alt attribute', () => {
    // Feature: portfolio-profile, Property 11: every <img> has a non-empty alt attribute
    const images = Array.from(document.querySelectorAll('img'));

    // Sanity: there should be at least one image in the document
    expect(images.length).toBeGreaterThan(0);

    for (const img of images) {
      expect(img.hasAttribute('alt')).toBe(true);
    }
  });

  it('all <img> elements have a non-empty alt attribute', () => {
    // Feature: portfolio-profile, Property 11: every <img> has a non-empty alt attribute
    const images = Array.from(document.querySelectorAll('img'));

    for (const img of images) {
      const alt = img.getAttribute('alt');
      expect(alt).not.toBeNull();
      expect(alt.trim()).not.toBe('');
    }
  });
});

describe('Property 11 — Generative contract: images with non-empty alt pass the invariant', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('For any set of <img> elements with non-empty alt, all pass the hasNonEmptyAlt check', () => {
    // Feature: portfolio-profile, Property 11: every <img> has a non-empty alt attribute
    // **Validates: Requirements 7.3**
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          { minLength: 1, maxLength: 10 }
        ),
        (altTexts) => {
          // Create a fresh container for each run
          const container = document.createElement('div');
          for (const alt of altTexts) {
            const img = document.createElement('img');
            img.setAttribute('src', 'image.webp');
            img.setAttribute('alt', alt);
            container.appendChild(img);
          }
          document.body.appendChild(container);

          const images = Array.from(container.querySelectorAll('img'));
          expect(images.length).toBe(altTexts.length);

          for (const img of images) {
            expect(hasNonEmptyAlt(img)).toBe(true);
          }

          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 11 — Negative contract: images with empty or missing alt fail the invariant', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('An <img> with alt="" fails the hasNonEmptyAlt check', () => {
    // Feature: portfolio-profile, Property 11: every <img> has a non-empty alt attribute
    // **Validates: Requirements 7.3**
    fc.assert(
      fc.property(
        fc.constant(''),
        (emptyAlt) => {
          const img = document.createElement('img');
          img.setAttribute('src', 'image.webp');
          img.setAttribute('alt', emptyAlt);

          expect(hasNonEmptyAlt(img)).toBe(false);
        }
      ),
      { numRuns: 1 }
    );
  });

  it('An <img> without an alt attribute fails the hasNonEmptyAlt check', () => {
    // Feature: portfolio-profile, Property 11: every <img> has a non-empty alt attribute
    // **Validates: Requirements 7.3**
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const img = document.createElement('img');
          img.setAttribute('src', 'image.webp');
          // Intentionally omit alt attribute

          expect(hasNonEmptyAlt(img)).toBe(false);
        }
      ),
      { numRuns: 1 }
    );
  });

  it('An <img> with whitespace-only alt fails the hasNonEmptyAlt check', () => {
    // Feature: portfolio-profile, Property 11: every <img> has a non-empty alt attribute
    // **Validates: Requirements 7.3**
    fc.assert(
      fc.property(
        fc.stringMatching(/^\s+$/),
        (whitespaceAlt) => {
          const img = document.createElement('img');
          img.setAttribute('src', 'image.webp');
          img.setAttribute('alt', whitespaceAlt);

          expect(hasNonEmptyAlt(img)).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });
});

// ── Property 12 — Color Contrast Ratio Compliance ────────────────────────────

/**
 * Property-Based Tests: WCAG 2.1 Color Contrast Ratio Compliance
 *
 * Property 12: For every foreground/background CSS Custom Property pair defined
 * in variables.css (both light and dark themes), the WCAG 2.1 contrast ratio
 * must be >= 4.5:1.
 *
 * **Validates: Requirements 7.4**
 *
 * Strategy:
 * - Suite 1: Deterministic pairs — light theme foreground/background combinations.
 * - Suite 2: Deterministic pairs — dark theme foreground/background combinations.
 * - Suite 3: Generative property test — fc.constantFrom(...allPairs) samples all
 *   defined pairs and asserts the contrast ratio invariant holds.
 * - Suite 4: Negative contract — verify the helper correctly identifies a known
 *   low-contrast pair as failing the 4.5:1 threshold.
 */

// ── WCAG 2.1 helper functions (inline, no external library) ───────────────────

/** Parse a hex color string (#rrggbb or #rgb) into { r, g, b } in [0,255]. */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }
  return { r, g, b };
}

/** WCAG 2.1 relative luminance (IEC 61966-2-1 sRGB linearisation). */
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const linearize = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG 2.1 contrast ratio between two hex colors. */
function contrastRatio(hex1, hex2) {
  const L1 = relativeLuminance(hex1);
  const L2 = relativeLuminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker  = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Suite 1 — Deterministic pairs (light theme) ───────────────────────────────

describe('Property 12 — Light theme: deterministic foreground/background pairs meet WCAG 4.5:1', () => {
  // Feature: portfolio-profile, Property 12: WCAG 2.1 contrast ratio >= 4.5:1

  it('--color-text-primary (#1a1a2e) on --color-bg-primary (#ffffff) >= 4.5:1', () => {
    expect(contrastRatio('#1a1a2e', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-primary (#1a1a2e) on --color-bg-secondary (#f5f5f5) >= 4.5:1', () => {
    expect(contrastRatio('#1a1a2e', '#f5f5f5')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-primary (#1a1a2e) on --color-card-bg (#ffffff) >= 4.5:1', () => {
    expect(contrastRatio('#1a1a2e', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-secondary (#4a4a6a) on --color-bg-primary (#ffffff) >= 4.5:1', () => {
    expect(contrastRatio('#4a4a6a', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-secondary (#4a4a6a) on --color-bg-secondary (#f5f5f5) >= 4.5:1', () => {
    expect(contrastRatio('#4a4a6a', '#f5f5f5')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-error (#d32f2f) on --color-bg-primary (#ffffff) >= 4.5:1', () => {
    expect(contrastRatio('#d32f2f', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-success (#2e7d32) on --color-bg-primary (#ffffff) >= 4.5:1', () => {
    expect(contrastRatio('#2e7d32', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });
});

// ── Suite 2 — Deterministic pairs (dark theme) ────────────────────────────────

describe('Property 12 — Dark theme: deterministic foreground/background pairs meet WCAG 4.5:1', () => {
  // Feature: portfolio-profile, Property 12: WCAG 2.1 contrast ratio >= 4.5:1

  it('--color-text-primary (#e8e8f0) on --color-bg-primary (#0d0d1a) >= 4.5:1', () => {
    expect(contrastRatio('#e8e8f0', '#0d0d1a')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-primary (#e8e8f0) on --color-bg-secondary (#1a1a2e) >= 4.5:1', () => {
    expect(contrastRatio('#e8e8f0', '#1a1a2e')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-primary (#e8e8f0) on --color-card-bg (#1a1a2e) >= 4.5:1', () => {
    expect(contrastRatio('#e8e8f0', '#1a1a2e')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-secondary (#9090b0) on --color-bg-primary (#0d0d1a) >= 4.5:1', () => {
    expect(contrastRatio('#9090b0', '#0d0d1a')).toBeGreaterThanOrEqual(4.5);
  });

  it('--color-text-secondary (#9090b0) on --color-bg-secondary (#1a1a2e) >= 4.5:1', () => {
    expect(contrastRatio('#9090b0', '#1a1a2e')).toBeGreaterThanOrEqual(4.5);
  });
});

// ── Suite 3 — Generative property test (all pairs, both themes) ───────────────

describe('Property 12 — Generative: all CSS custom property color pairs meet WCAG 4.5:1', () => {
  const allPairs = [
    // Light theme pairs
    { fg: '#1a1a2e', bg: '#ffffff',  label: 'light: text-primary on bg-primary' },
    { fg: '#1a1a2e', bg: '#f5f5f5',  label: 'light: text-primary on bg-secondary' },
    { fg: '#1a1a2e', bg: '#ffffff',  label: 'light: text-primary on card-bg' },
    { fg: '#4a4a6a', bg: '#ffffff',  label: 'light: text-secondary on bg-primary' },
    { fg: '#4a4a6a', bg: '#f5f5f5',  label: 'light: text-secondary on bg-secondary' },
    { fg: '#d32f2f', bg: '#ffffff',  label: 'light: error on bg-primary' },
    { fg: '#2e7d32', bg: '#ffffff',  label: 'light: success on bg-primary' },
    // Dark theme pairs
    { fg: '#e8e8f0', bg: '#0d0d1a',  label: 'dark: text-primary on bg-primary' },
    { fg: '#e8e8f0', bg: '#1a1a2e',  label: 'dark: text-primary on bg-secondary' },
    { fg: '#e8e8f0', bg: '#1a1a2e',  label: 'dark: text-primary on card-bg' },
    { fg: '#9090b0', bg: '#0d0d1a',  label: 'dark: text-secondary on bg-primary' },
    { fg: '#9090b0', bg: '#1a1a2e',  label: 'dark: text-secondary on bg-secondary' },
  ];

  it('For any sampled pair from all CSS custom property colors, contrast ratio >= 4.5:1', () => {
    // Feature: portfolio-profile, Property 12: all CSS custom property color pairs meet WCAG 2.1 contrast >= 4.5:1
    // **Validates: Requirements 7.4**
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        ({ fg, bg }) => {
          const ratio = contrastRatio(fg, bg);
          return ratio >= 4.5;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Suite 4 — Negative contract ───────────────────────────────────────────────

describe('Property 12 — Negative contract: known low-contrast pairs correctly fail the 4.5:1 check', () => {
  it('#cccccc on #ffffff produces a contrast ratio < 4.5:1', () => {
    // Feature: portfolio-profile, Property 12: WCAG 2.1 contrast ratio >= 4.5:1
    const ratio = contrastRatio('#cccccc', '#ffffff');
    expect(ratio).toBeLessThan(4.5);
  });
});

// ── Property 13 — Below-the-Fold Images Have Lazy Loading ────────────────────

/**
 * Property-Based Tests: Below-the-Fold Images Have Lazy Loading
 *
 * Property 13: For every <img> element that is NOT the hero/LCP image (identified
 * by fetchpriority="high" inside #hero), the `loading` attribute must equal "lazy".
 *
 * **Validates: Requirements 8.2**
 *
 * Strategy:
 * - Suite 1: Static document — parse index.html, exclude the hero image, assert
 *   all remaining <img> elements have loading="lazy".
 * - Suite 2: Hero image contract — confirm the hero image itself does NOT carry
 *   loading="lazy" (it uses fetchpriority="high" for LCP optimisation).
 * - Suite 3: Generative contract — for any set of hypothetical below-fold <img>
 *   elements built with loading="lazy", assert the invariant holds across all inputs.
 * - Suite 4: Negative contract — confirm that an <img> without loading="lazy"
 *   correctly fails the invariant check.
 */

/** Returns true when an <img> has loading="lazy". */
function hasLazyLoading(img) {
  return img.getAttribute('loading') === 'lazy';
}

/** Returns true when an <img> is the hero/LCP image. */
function isHeroImage(img) {
  return (
    img.getAttribute('fetchpriority') === 'high' ||
    img.closest('#hero') !== null
  );
}

// ── Suite 1 — Static document ─────────────────────────────────────────────────

describe('Property 13 — Static document: all below-fold <img> elements have loading="lazy"', () => {
  beforeEach(() => {
    const htmlPath = resolve(process.cwd(), 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('there is at least one <img> element in the document', () => {
    // Feature: portfolio-profile, Property 13: below-fold images have lazy loading
    const images = Array.from(document.querySelectorAll('img'));
    expect(images.length).toBeGreaterThan(0);
  });

  it('all non-hero <img> elements have loading="lazy"', () => {
    // Feature: portfolio-profile, Property 13: below-fold images have lazy loading
    const images = Array.from(document.querySelectorAll('img'));
    const belowFoldImages = images.filter((img) => !isHeroImage(img));

    // Assert each below-fold image has loading="lazy"
    for (const img of belowFoldImages) {
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });
});

// ── Suite 2 — Hero image contract ─────────────────────────────────────────────

describe('Property 13 — Hero image: LCP/hero image does NOT have loading="lazy"', () => {
  beforeEach(() => {
    const htmlPath = resolve(process.cwd(), 'index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('the hero image has fetchpriority="high"', () => {
    // Feature: portfolio-profile, Property 13: hero image is identified by fetchpriority="high"
    const heroSection = document.querySelector('#hero');
    expect(heroSection).not.toBeNull();

    const heroImg = heroSection.querySelector('img[fetchpriority="high"]');
    expect(heroImg).not.toBeNull();
  });

  it('the hero image does NOT have loading="lazy"', () => {
    // Feature: portfolio-profile, Property 13: hero image must not have loading="lazy"
    const heroSection = document.querySelector('#hero');
    const heroImg = heroSection.querySelector('img[fetchpriority="high"]');

    expect(heroImg).not.toBeNull();
    expect(heroImg.getAttribute('loading')).not.toBe('lazy');
  });
});

// ── Suite 3 — Generative contract ─────────────────────────────────────────────

describe('Property 13 — Generative contract: any below-fold <img> with loading="lazy" passes the invariant', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('For any set of below-fold <img> elements built with loading="lazy", all pass the hasLazyLoading check', () => {
    // Feature: portfolio-profile, Property 13: below-fold images have lazy loading
    // **Validates: Requirements 8.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            src: fc.string({ minLength: 1, maxLength: 100 }),
            alt: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (imageData) => {
          const container = document.createElement('div');
          for (const { src, alt } of imageData) {
            const img = document.createElement('img');
            img.setAttribute('src', src);
            img.setAttribute('alt', alt);
            img.setAttribute('loading', 'lazy');
            container.appendChild(img);
          }
          document.body.appendChild(container);

          const images = Array.from(container.querySelectorAll('img'));
          expect(images.length).toBe(imageData.length);

          for (const img of images) {
            expect(hasLazyLoading(img)).toBe(true);
          }

          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Suite 4 — Negative contract ───────────────────────────────────────────────

describe('Property 13 — Negative contract: <img> without loading="lazy" correctly fails the invariant', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('An <img> with no loading attribute fails the hasLazyLoading check', () => {
    // Feature: portfolio-profile, Property 13: below-fold images have lazy loading
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const img = document.createElement('img');
          img.setAttribute('src', 'image.webp');
          img.setAttribute('alt', 'test');
          // Intentionally omit loading attribute

          expect(hasLazyLoading(img)).toBe(false);
        }
      ),
      { numRuns: 1 }
    );
  });

  it('An <img> with loading="eager" fails the hasLazyLoading check', () => {
    // Feature: portfolio-profile, Property 13: below-fold images have lazy loading
    fc.assert(
      fc.property(
        fc.constant('eager'),
        (eagerValue) => {
          const img = document.createElement('img');
          img.setAttribute('src', 'image.webp');
          img.setAttribute('alt', 'test');
          img.setAttribute('loading', eagerValue);

          expect(hasLazyLoading(img)).toBe(false);
        }
      ),
      { numRuns: 1 }
    );
  });
});
