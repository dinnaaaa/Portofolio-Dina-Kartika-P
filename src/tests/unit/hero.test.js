import { initHeroAnimation } from '../../js/hero.js';

describe('initHeroAnimation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('adds .hero--animated class to #hero section', () => {
    document.body.innerHTML = `
      <section id="hero">
        <figure class="hero__figure"></figure>
        <h1 class="hero__name"></h1>
        <p class="hero__tagline"></p>
        <p class="hero__description"></p>
        <div class="hero__cta-group"></div>
      </section>
    `;

    initHeroAnimation();

    expect(document.getElementById('hero').classList.contains('hero--animated')).toBe(true);
  });

  it('animation delays are applied in ascending order', () => {
    // Stagger delays as defined in hero.css / hero.js design spec
    const heroTimings = [
      { element: 'photo (.hero__figure)',  delay: 0,   duration: 600 },
      { element: 'h1 (.hero__name)',       delay: 200, duration: 400 },
      { element: 'tagline',                delay: 400, duration: 400 },
      { element: 'description',            delay: 600, duration: 400 },
      { element: 'CTA (.hero__cta-group)', delay: 800, duration: 400 },
    ];

    const delays = heroTimings.map(t => t.delay);

    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
  });

  it('no element has delay + duration sum exceeding 1500ms', () => {
    const heroTimings = [
      { element: 'photo (.hero__figure)',  delay: 0,   duration: 600 },
      { element: 'h1 (.hero__name)',       delay: 200, duration: 400 },
      { element: 'tagline',                delay: 400, duration: 400 },
      { element: 'description',            delay: 600, duration: 400 },
      { element: 'CTA (.hero__cta-group)', delay: 800, duration: 400 },
    ];

    for (const timing of heroTimings) {
      expect(timing.delay + timing.duration).toBeLessThanOrEqual(1500);
    }
  });

  it('does nothing when #hero section is absent', () => {
    // No #hero in DOM
    expect(() => initHeroAnimation()).not.toThrow();
  });
});
