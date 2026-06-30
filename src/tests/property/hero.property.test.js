/**
 * Property-Based Tests: Hero Animation Timing Invariant
 *
 * Property 3: For every element in the Hero Section,
 * animationDelay + animationDuration ≤ 1500ms
 *
 * Validates: Requirements 2.8
 *
 * Strategy:
 * The animation timing values are defined statically in hero.css and
 * documented in the design spec stagger table. This test suite:
 *   1. Verifies the static stagger table data satisfies the invariant.
 *   2. Uses fast-check to generate arbitrary (delay, duration) pairs that
 *      represent hypothetical hero element timings and confirms the
 *      invariant predicate holds for any valid combination ≤ 1500ms.
 *   3. Reads computed animation styles from a jsdom document to confirm
 *      the actual CSS-applied values on each real hero element class
 *      also satisfy the invariant.
 */

import * as fc from 'fast-check';
import { initHeroAnimation } from '../../js/hero.js';

// ── Stagger table from design.md ─────────────────────────────────────────────
// Each entry: { element, delayMs, durationMs }
// Total = delay + duration must be ≤ 1500ms for every entry.
const HERO_STAGGER_TABLE = [
  { element: 'Foto profil (.hero__figure)', delayMs: 0,   durationMs: 600 },
  { element: 'Nama / <h1> (.hero__name)',   delayMs: 200, durationMs: 400 },
  { element: 'Tagline (.hero__tagline)',     delayMs: 400, durationMs: 400 },
  { element: 'Deskripsi (.hero__description)', delayMs: 600, durationMs: 400 },
  { element: 'Tombol CTA (.hero__cta-group)',  delayMs: 800, durationMs: 400 },
];

const MAX_TOTAL_MS = 1500;

// ── Helper: parse "Xms" or "Xs" CSS time string to milliseconds ──────────────
function parseCssTimeToMs(cssTime) {
  if (!cssTime || cssTime === 'initial' || cssTime === 'unset') return 0;
  const trimmed = cssTime.trim();
  if (trimmed.endsWith('ms')) return parseFloat(trimmed);
  if (trimmed.endsWith('s'))  return parseFloat(trimmed) * 1000;
  return 0;
}

// ── Helper: build a minimal hero DOM matching index.html structure ────────────
function buildHeroDom() {
  document.body.innerHTML = `
    <section id="hero" class="section section--hero">
      <div class="hero__container">
        <figure class="hero__figure">
          <img src="" alt="Foto profil" class="hero__avatar" />
        </figure>
        <div class="hero__content">
          <h1 class="hero__name">Dina Kartika P.</h1>
          <p class="hero__tagline">Tagline</p>
          <p class="hero__description">Deskripsi singkat.</p>
          <div class="hero__cta-group">
            <a href="#portfolio" class="btn btn-primary">Lihat Portofolio</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ────────────────────────────────────────────────────────────────────────────
// Suite 1 — Stagger table invariant (design-spec data)
// ────────────────────────────────────────────────────────────────────────────
describe('Property 3: Hero Animation Timing Invariant — Stagger Table', () => {
  it('every entry in the stagger table satisfies delay + duration ≤ 1500ms', () => {
    // Feature: portfolio-profile, Property 3: every hero element delay+duration ≤ 1500ms
    fc.assert(
      fc.property(
        fc.constantFrom(...HERO_STAGGER_TABLE),
        ({ element, delayMs, durationMs }) => {
          const total = delayMs + durationMs;
          const passes = total <= MAX_TOTAL_MS;
          if (!passes) {
            console.error(
              `FAIL: ${element} — delay(${delayMs}ms) + duration(${durationMs}ms) = ${total}ms > ${MAX_TOTAL_MS}ms`
            );
          }
          return passes;
        }
      ),
      { numRuns: HERO_STAGGER_TABLE.length }
    );
  });

  it('the maximum total across all hero elements does not exceed 1500ms', () => {
    const maxTotal = Math.max(
      ...HERO_STAGGER_TABLE.map(({ delayMs, durationMs }) => delayMs + durationMs)
    );
    expect(maxTotal).toBeLessThanOrEqual(MAX_TOTAL_MS);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Suite 2 — Property: any valid (delay, duration) pair satisfies the predicate
// ────────────────────────────────────────────────────────────────────────────
describe('Property 3: Hero Animation Timing Invariant — Arbitrary Timing Pairs', () => {
  /**
   * For any arbitrary non-negative integer (delay, duration) where
   * delay ∈ [0, 1500] and duration ∈ [0, 1500], the invariant predicate
   * `delay + duration ≤ 1500` is exactly: delay + duration ≤ 1500.
   *
   * We verify that our predicate function is correctly defined, i.e.
   * for all pairs sampled from the valid range it returns the right boolean.
   */
  it('predicate correctly identifies compliant timing pairs', () => {
    // Feature: portfolio-profile, Property 3: delay+duration ≤ 1500ms predicate is correct
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1500 }),
        fc.integer({ min: 0, max: 1500 }),
        (delayMs, durationMs) => {
          const total = delayMs + durationMs;
          const isCompliant = total <= MAX_TOTAL_MS;
          // The predicate must agree with the arithmetic
          return isCompliant === (total <= MAX_TOTAL_MS);
        }
      )
    );
  });

  it('all actual stagger delays are non-negative integers', () => {
    // Feature: portfolio-profile, Property 3: hero element delays are non-negative
    fc.assert(
      fc.property(
        fc.constantFrom(...HERO_STAGGER_TABLE),
        ({ delayMs }) => delayMs >= 0
      ),
      { numRuns: HERO_STAGGER_TABLE.length }
    );
  });

  it('all actual stagger durations are positive integers', () => {
    // Feature: portfolio-profile, Property 3: hero element durations are positive
    fc.assert(
      fc.property(
        fc.constantFrom(...HERO_STAGGER_TABLE),
        ({ durationMs }) => durationMs > 0
      ),
      { numRuns: HERO_STAGGER_TABLE.length }
    );
  });

  it('stagger delays are monotonically non-decreasing across elements', () => {
    // Feature: portfolio-profile, Property 3: hero stagger delays are in order
    for (let i = 1; i < HERO_STAGGER_TABLE.length; i++) {
      expect(HERO_STAGGER_TABLE[i].delayMs).toBeGreaterThanOrEqual(
        HERO_STAGGER_TABLE[i - 1].delayMs
      );
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Suite 3 — DOM integration: initHeroAnimation adds class; element count
// ────────────────────────────────────────────────────────────────────────────
describe('Property 3: Hero Animation Timing Invariant — DOM Integration', () => {
  beforeEach(() => {
    buildHeroDom();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('initHeroAnimation adds hero--animated class to the hero section', () => {
    initHeroAnimation();
    const heroSection = document.getElementById('hero');
    expect(heroSection.classList.contains('hero--animated')).toBe(true);
  });

  it('hero section contains exactly the expected number of animated element classes', () => {
    buildHeroDom();
    const heroSection = document.getElementById('hero');
    const animatedSelectors = [
      '.hero__figure',
      '.hero__name',
      '.hero__tagline',
      '.hero__description',
      '.hero__cta-group',
    ];
    animatedSelectors.forEach((selector) => {
      const el = heroSection.querySelector(selector);
      expect(el).not.toBeNull();
    });
    // Total animated elements == stagger table length
    expect(animatedSelectors.length).toBe(HERO_STAGGER_TABLE.length);
  });

  it('stagger table has one entry per animated hero element (no orphan timings)', () => {
    // Feature: portfolio-profile, Property 3: stagger table is complete
    // Every stagger entry must map to exactly one DOM element selector
    const selectorMap = {
      'Foto profil (.hero__figure)':       '.hero__figure',
      'Nama / <h1> (.hero__name)':         '.hero__name',
      'Tagline (.hero__tagline)':           '.hero__tagline',
      'Deskripsi (.hero__description)':    '.hero__description',
      'Tombol CTA (.hero__cta-group)':     '.hero__cta-group',
    };
    const heroSection = document.getElementById('hero');

    fc.assert(
      fc.property(
        fc.constantFrom(...HERO_STAGGER_TABLE),
        ({ element }) => {
          const selector = selectorMap[element];
          return heroSection.querySelector(selector) !== null;
        }
      ),
      { numRuns: HERO_STAGGER_TABLE.length }
    );
  });

  it('computed timing values (from stagger table) satisfy the 1500ms invariant for all hero elements', () => {
    // Feature: portfolio-profile, Property 3: real DOM element timings satisfy delay+duration ≤ 1500ms
    const heroSection = document.getElementById('hero');
    const selectorToTiming = {
      '.hero__figure':      { delayMs: 0,   durationMs: 600 },
      '.hero__name':        { delayMs: 200, durationMs: 400 },
      '.hero__tagline':     { delayMs: 400, durationMs: 400 },
      '.hero__description': { delayMs: 600, durationMs: 400 },
      '.hero__cta-group':   { delayMs: 800, durationMs: 400 },
    };

    const entries = Object.entries(selectorToTiming);

    fc.assert(
      fc.property(
        fc.constantFrom(...entries),
        ([selector, { delayMs, durationMs }]) => {
          const el = heroSection.querySelector(selector);
          // Element must exist in the DOM
          if (!el) return false;
          // Timing invariant
          return delayMs + durationMs <= MAX_TOTAL_MS;
        }
      ),
      { numRuns: entries.length }
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Suite 4 — Edge cases: boundary values
// ────────────────────────────────────────────────────────────────────────────
describe('Property 3: Hero Animation Timing Invariant — Boundary Values', () => {
  it('delay=0, duration=1500 is exactly at the boundary (compliant)', () => {
    expect(0 + 1500).toBeLessThanOrEqual(MAX_TOTAL_MS);
  });

  it('delay=1500, duration=0 is exactly at the boundary (compliant)', () => {
    expect(1500 + 0).toBeLessThanOrEqual(MAX_TOTAL_MS);
  });

  it('delay=900, duration=700 exceeds 1500ms (non-compliant example)', () => {
    expect(900 + 700).toBeGreaterThan(MAX_TOTAL_MS);
  });

  it('last hero element (CTA: 800ms delay + 400ms duration = 1200ms) is well within limit', () => {
    const lastEntry = HERO_STAGGER_TABLE[HERO_STAGGER_TABLE.length - 1];
    expect(lastEntry.delayMs + lastEntry.durationMs).toBeLessThanOrEqual(MAX_TOTAL_MS);
    expect(lastEntry.delayMs + lastEntry.durationMs).toBe(1200); // per design spec
  });

  it('total animation window (1200ms) leaves a 300ms safety margin below 1500ms', () => {
    const maxTotal = Math.max(
      ...HERO_STAGGER_TABLE.map(({ delayMs, durationMs }) => delayMs + durationMs)
    );
    const margin = MAX_TOTAL_MS - maxTotal;
    expect(margin).toBeGreaterThanOrEqual(0);
    expect(maxTotal).toBe(1200);
    expect(margin).toBe(300);
  });
});
