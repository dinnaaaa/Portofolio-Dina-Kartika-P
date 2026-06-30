/**
 * skills.js — Scroll-triggered progress bar animation
 *
 * Uses IntersectionObserver to detect when the #skills section enters the
 * viewport, then animates each progress bar from 0% to its target value.
 * The animation runs once per page session.
 */

/**
 * Animates a single progress bar element from 0% to `targetPercent`.
 *
 * @param {HTMLElement} bar           - The fill element whose `style.width` is animated
 * @param {number}      targetPercent - Target width value (0–100)
 * @param {number}      [duration=1000] - Animation duration in ms
 * @returns {Promise<void>} Resolves when the animation is complete
 */
export function animateProgressBar(bar, targetPercent, duration = 1000) {
  return new Promise((resolve) => {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOutCubic easing
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentPercent = eased * targetPercent;

      bar.style.width = `${currentPercent}%`;
      bar.setAttribute('aria-valuenow', Math.round(currentPercent));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure we land exactly on the target
        bar.style.width = `${targetPercent}%`;
        bar.setAttribute('aria-valuenow', targetPercent);
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

/**
 * Sets up an IntersectionObserver on the `#skills` section.
 * When the section becomes visible, animates all progress bar fills.
 * Unobserves immediately after the first trigger.
 */
export function initSkillsObserver() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const bars = skillsSection.querySelectorAll(
          '.progress-bar__fill, .skills__bar-fill'
        );

        bars.forEach((bar) => {
          const progressbarEl =
            bar.closest('[role="progressbar"]') || bar.parentElement;

          const target = progressbarEl
            ? parseInt(progressbarEl.getAttribute('aria-valuenow') || '0', 10)
            : 0;

          bar.style.width = '0%';
          animateProgressBar(bar, target);
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(skillsSection);
}
