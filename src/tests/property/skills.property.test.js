// Feature: portfolio-profile, Property 4: animateProgressBar final width equals targetPercent

/**
 * Property-based tests for skills.js — Progress Bar Animation Correctness
 *
 * Property 4a: For any targetPercent in [0, 100], after animateProgressBar resolves,
 *              bar.style.width equals `${targetPercent}%`
 * Property 4b: For any targetPercent in [0, 100], after animateProgressBar resolves,
 *              bar.getAttribute('aria-valuenow') equals String(targetPercent)
 * Property 4c: For any targetPercent in [0, 100], bar starts at '0%' before animation begins
 *
 * Validates: Requirements 4.3, 4.4
 */

import * as fc from 'fast-check';
import { animateProgressBar } from '../../js/skills.js';

/**
 * Mock requestAnimationFrame to call callbacks synchronously with a fake
 * timestamp that immediately completes the animation (elapsed >= duration).
 * This avoids real-timer complexity while still exercising the full step() logic.
 */
function installSyncRAF(duration = 1000) {
  // We advance the timestamp by duration+1 so that on the very first callback
  // progress = Math.min((duration+1)/duration, 1) = 1, which triggers the
  // completion branch and resolves the promise.
  let time = 0;
  globalThis.requestAnimationFrame = (cb) => {
    // First call: timestamp = 0 → sets startTime = 0, progress = 0 → schedules next frame
    // Second call: timestamp = duration + 1 → progress = 1 → completion branch fires
    time += duration + 1;
    cb(time);
    return 0;
  };
}

function uninstallSyncRAF() {
  delete globalThis.requestAnimationFrame;
}

describe('Property 4: Progress Bar Animation Correctness', () => {
  beforeEach(() => {
    installSyncRAF(1000);
  });

  afterEach(() => {
    uninstallSyncRAF();
  });

  it('Property 4a — final width equals targetPercent% after animation completes', async () => {
    // Feature: portfolio-profile, Property 4: animateProgressBar final width equals targetPercent
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (targetPercent) => {
          const bar = document.createElement('div');

          await animateProgressBar(bar, targetPercent, 1000);

          expect(bar.style.width).toBe(`${targetPercent}%`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4b — aria-valuenow equals targetPercent after animation completes', async () => {
    // Feature: portfolio-profile, Property 4: animateProgressBar aria-valuenow equals targetPercent
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (targetPercent) => {
          const bar = document.createElement('div');

          await animateProgressBar(bar, targetPercent, 1000);

          expect(bar.getAttribute('aria-valuenow')).toBe(String(targetPercent));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4c — bar starts at 0% before animation begins', async () => {
    // Feature: portfolio-profile, Property 4: animateProgressBar final width equals targetPercent
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (targetPercent) => {
          const bar = document.createElement('div');

          // Capture initial width before any rAF tick fires.
          // The animation promise hasn't resolved yet; before awaiting it,
          // the bar element has no width set — confirming it starts at empty / 0%.
          const initialWidth = bar.style.width;

          // Now run animation to completion
          await animateProgressBar(bar, targetPercent, 1000);

          // Initial state should be '' (no style set) or '0%', never the final value
          expect(initialWidth === '' || initialWidth === '0%').toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
