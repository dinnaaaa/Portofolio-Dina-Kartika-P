/**
 * main.js — Application Entry Point
 *
 * Imported by index.html as `type="module"`. Waits for DOMContentLoaded,
 * then initialises all feature modules in order.
 */

import { initTheme } from './theme.js';
import { initNavbar } from './navbar.js';
import { initHeroAnimation } from './hero.js';
import { initSkillsObserver } from './skills.js';
import { initPortfolioFilter, projectsData } from './portfolio.js';
import { initContactForm } from './contact.js';
import { handleCVDownload } from './cv.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Apply dark / light theme immediately — before paint to avoid FOUC
  initTheme();

  // 2. Sticky navbar: active link highlighting, smooth scroll, hamburger menu
  initNavbar();

  // 3. Hero entrance animation (unlocks CSS keyframes)
  initHeroAnimation();

  // 4. Skills progress bar scroll animation
  initSkillsObserver();

  // 5. Portfolio filter tabs and card rendering
  initPortfolioFilter(projectsData);

  // 6. Contact form validation and submission
  initContactForm();

  // 7. CV availability check — disables download button if PDF not found
  handleCVDownload('/src/assets/cv/dina-cv.pdf');

  // 8. Dynamic copyright year in footer
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
