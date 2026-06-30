/**
 * hero.js — Hero Entrance Animation Trigger
 *
 * Stagger delays (defined in hero.css keyframes):
 *   photo   =   0 ms, duration 600 ms
 *   h1      = 200 ms, duration 400 ms
 *   tagline = 400 ms, duration 400 ms
 *   desc    = 600 ms, duration 400 ms
 *   cta     = 800 ms, duration 400 ms
 *
 * Max delay + duration = 800 + 400 = 1200 ms < 1500 ms ✓
 *
 * CSS keyframes (`heroFadeSlideUp`) handle the actual animation via
 * `animation-delay`. This module adds `.hero--animated` to unlock them.
 */

export function initHeroAnimation() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  heroSection.classList.add('hero--animated');
}
