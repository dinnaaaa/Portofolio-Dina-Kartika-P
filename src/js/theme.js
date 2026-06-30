/**
 * theme.js — Dark Mode Detection & Toggle
 *
 * Detects the OS-level `prefers-color-scheme: dark` media query and applies
 * `.dark-mode` to `<html>`. Listens for runtime changes so the site responds
 * immediately if the user switches their system theme while the page is open.
 */

export function initTheme() {
  const htmlEl = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(isDark) {
    if (isDark) {
      htmlEl.classList.add('dark-mode');
    } else {
      htmlEl.classList.remove('dark-mode');
    }
  }

  // Apply on load
  applyTheme(mediaQuery.matches);

  // Listen for OS-level changes
  mediaQuery.addEventListener('change', (e) => applyTheme(e.matches));
}
