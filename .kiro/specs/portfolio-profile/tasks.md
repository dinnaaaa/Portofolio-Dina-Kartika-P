# Implementation Plan

## Overview

Portfolio Profile Website untuk Dina Kartika Pramudita menggunakan HTML, CSS, JavaScript, Vite, dan Vitest.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": [1]
    },
    {
      "wave": 2,
      "tasks": [2, 3]
    },
    {
      "wave": 3,
      "tasks": [4, 7]
    },
    {
      "wave": 4,
      "tasks": [5, 6]
    },
    {
      "wave": 5,
      "tasks": [8]
    }
  ]
}
```


## Tasks

- [x] 1. Project Setup
  - [x] 1.1 Initialize npm project and install Vite as a dev dependency; create `package.json` with `"dev"`, `"build"`, and `"preview"` scripts pointing to Vite
  - [x] 1.2 Create `vite.config.js` at the project root with `jsdom` test environment, `globals: true`, `setupFiles: './src/tests/setup.js'`, and fast-check global config (`numRuns: 100`)
  - [x] 1.3 Install test dependencies: `vitest`, `@vitest/coverage-v8`, `jsdom`, `fast-check` as dev dependencies
  - [x] 1.4 Create the full directory tree: `src/css/`, `src/js/`, `src/assets/images/projects/`, `src/assets/cv/`, `src/tests/unit/`, `src/tests/property/`, `src/tests/smoke/`, `public/`
  - [x] 1.5 Create `src/tests/setup.js` that imports `@testing-library/jest-dom` (if used) and configures fast-check global options (`fc.configureGlobal({ numRuns: 100 })`)
  - [x] 1.6 Create `src/css/variables.css` containing all CSS Custom Properties defined in the design (light theme defaults, dark theme overrides via `prefers-color-scheme: dark`, typography variables, spacing scale, and breakpoint variables)
  - [x] 1.7 Create `src/css/reset.css` with a modern CSS reset/normalize (box-sizing border-box, margin/padding reset, img max-width 100%)
  - [x] 1.8 Verify the dev server starts without errors (`npm run dev`) and the test runner is discoverable (`npx vitest --run`)

- [x] 2. HTML Structure
  - [x] 2.1 Create `index.html` at the project root with the full HTML5 boilerplate: `<!DOCTYPE html>`, `lang="id"`, charset UTF-8, viewport meta tag, and SEO meta tags (description, og:title, og:description, og:image, twitter:card)
  - [x] 2.2 Add `<link>` preconnect and stylesheet tags for Google Fonts (Poppins, Inter) and the compiled CSS entry point inside `<head>`
  - [x] 2.3 Add `<header>` containing `<nav>` with the site logo/name and an unordered list of anchor links to all five sections (`#hero`, `#about`, `#skills`, `#portfolio`, `#contact`); include a hamburger `<button>` with `aria-expanded` and `aria-controls` attributes for mobile
  - [x] 2.4 Add `<main>` containing five `<section>` elements with IDs `hero`, `about`, `skills`, `portfolio`, `contact`, each with an `aria-labelledby` attribute pointing to its heading
  - [x] 2.5 Populate `#hero` section: `<figure>` with circular profile `<img>` (alt text, `fetchpriority="high"`), `<h1>` with full name, `<p>` tagline (≤ 80 chars), `<p>` short description (≤ 3 sentences), and three `<a>` / `<button>` CTAs (View Portfolio, Download CV, Contact Me)
  - [x] 2.6 Populate `#about` section: `<h2>` heading, biography `<p>` (≤ 150 words), a stats block with at least 2 achievement figures (`<dl>` or styled `<div>`), and a Download CV `<a>` button with `download` attribute
  - [x] 2.7 Populate `#skills` section: `<h2>` heading, two or more subsections for hard skill categories (each with a visible `<h3>` and skill items containing icon `<span>`, label, and `<div role="progressbar" aria-valuenow aria-valuemin aria-valuemax>`), and a separate soft-skills subsection with its own `<h3>`
  - [x] 2.8 Populate `#portfolio` section: `<h2>` heading, filter tab `<button>` elements (including "Semua"), and an empty `<div id="project-grid">` that will be populated by `portfolio.js`
  - [x] 2.9 Populate `#contact` section: `<h2>` heading, a `<form id="contact-form">` with four labeled inputs (name, email, subject, message textarea), a submit button, and a social links list with `<a>` tags for LinkedIn and GitHub (each with `target="_blank" rel="noopener noreferrer"`)
  - [x] 2.10 Add `<footer>` with copyright text and repeat social links; add `<script type="module" src="/src/js/main.js" defer>` before `</body>`
  - [x] 2.11 Validate the HTML with the W3C validator logic (no duplicate IDs, all `<img>` have non-empty `alt`, all form inputs have associated `<label>`, semantic landmarks present)

- [x] 3. CSS Modules
  - [x] 3.1 Create `src/css/main.css` as the entry point that `@import`s all other CSS files in order: `variables.css`, `reset.css`, `utilities.css`, `navbar.css`, `hero.css`, `about.css`, `skills.css`, `portfolio.css`, `contact.css`, `footer.css`
  - [x] 3.2 Create `src/css/utilities.css` with helper classes: `.container` (max-width 1280px, auto margins), `.btn` base styles, `.btn-primary`, `.btn-secondary`, `.btn-tertiary`, `.visually-hidden`, `.fade-in`, `.slide-up` animation classes
  - [x] 3.3 Create `src/css/navbar.css` implementing: fixed/sticky positioning at the top, z-index layering, flex layout for logo + links, `.nav__link--active` highlight style, hamburger button shown/hidden at 768px breakpoint, `.nav__panel` mobile slide-in panel with transition, and backdrop/overlay styles
  - [x] 3.4 Create `src/css/hero.css` implementing: full-viewport or tall section layout, flex/grid centering, circular profile image styles, stagger animation keyframes matching the delay table in the design (0/200/400/600/800 ms), and vertical stacked layout at `max-width: 767px`
  - [x] 3.5 Create `src/css/about.css` implementing: side-by-side layout at `min-width: 768px` (grid or flex), vertical stack at `max-width: 767px`, stats block visual differentiation (distinct background or border), and CV download button styles
  - [x] 3.6 Create `src/css/skills.css` implementing: category heading styles, skill item layout (icon + label + progress bar row), `.progress-bar__fill` with CSS transition for width animation, `[role="progressbar"]` styling, and soft-skills subsection visual separation
  - [x] 3.7 Create `src/css/portfolio.css` implementing: filter tab button styles (active state), CSS grid for project cards with `repeat(auto-fill, minmax(300px, 1fr))` (≥ 2 cols at 768px+, 1 col below), `.project-card` styles including consistent aspect-ratio thumbnail, hover effect transition ≤ 300ms (box-shadow, transform), and tag chip styles
  - [x] 3.8 Create `src/css/contact.css` implementing: form field layout (full-width inputs, label above), error message styles (color: var(--color-error)), success notification styles, social links row, `mailto:` link styles, and responsive single-column form layout
  - [x] 3.9 Create `src/css/footer.css` with footer layout, copyright text styles, and social icon links
  - [x] 3.10 Verify all CSS files use only CSS Custom Properties from `variables.css` for color values (no hardcoded hex colors outside `variables.css`), confirm dark mode overrides activate correctly via `prefers-color-scheme: dark`, and check that minimum contrast ratio ≥ 4.5:1 is met for all text/background pairs

- [x] 4. JavaScript Modules
  - [x] 4.1 Create `src/js/theme.js` exporting `initTheme()`: reads `prefers-color-scheme: dark` via `window.matchMedia`, adds/removes `.dark-mode` class on `<html>`, and adds a `change` listener to respond to OS-level theme changes at runtime
  - [x] 4.2 Create `src/js/navbar.js` exporting `initNavbar()`, `smoothScrollTo(targetId, duration)`, `setActiveNavLink(activeSectionId)`, and `toggleMobileMenu(isOpen)`:
    - `smoothScrollTo`: custom easing scroll (easeInOutCubic) that completes within the given duration (default 600ms, max 800ms per Requirement 1.2)
    - `setActiveNavLink`: removes `.nav__link--active` from all nav links, adds it only to the link whose `href` ends with `#${activeSectionId}`
    - `toggleMobileMenu`: sets `aria-expanded` on the hamburger button, adds/removes an `.is-open` class on the nav panel; closes on outside click and Escape key
    - `initNavbar`: sets up IntersectionObserver (threshold 0.5) on all sections, wires up click handlers for nav links and hamburger, closes menu after mobile link click
  - [x] 4.3 Create `src/js/hero.js` exporting `initHeroAnimation()`: adds `.is-visible` or equivalent class to hero elements in sequence using `setTimeout` with delays matching the design stagger table (0, 200, 400, 600, 800 ms); total delay + duration must not exceed 1500 ms
  - [x] 4.4 Create `src/js/skills.js` exporting `initSkillsObserver()` and `animateProgressBar(bar, targetPercent, duration)`:
    - `animateProgressBar`: uses `requestAnimationFrame` to interpolate width from 0 to `targetPercent` over `duration` ms (default 1000ms); sets `style.width` and `aria-valuenow`; resolves when animation completes
    - `initSkillsObserver`: creates an `IntersectionObserver` that triggers `animateProgressBar` for each `.progress-bar__fill` element once when the skills section enters the viewport; `unobserve` after first trigger
  - [x] 4.5 Create `src/js/portfolio.js` exporting `initPortfolioFilter(projects)`, `filterProjects(projects, category)`, and `createProjectCard(project)`:
    - `filterProjects`: pure function — returns `projects` unchanged if `category === 'all'`, otherwise returns only items where `project.category === category`
    - `createProjectCard`: creates and returns an `<article>` element with thumbnail `<img>` (lazy loading, onerror fallback), `<h3>` title, description `<p>`, tech stack tag `<span>` elements, conditional repo/demo `<a>` links (only rendered when URL is defined); all external links get `target="_blank" rel="noopener noreferrer"`
    - `initPortfolioFilter`: renders all project cards into `#project-grid`, wires up filter button click handlers to call `filterProjects` and re-render with a CSS transition class toggle; active filter button gets `.filter-btn--active`
  - [x] 4.6 Create `src/js/contact.js` exporting `initContactForm()`, `validateContactForm(data)`, and `isValidEmail(email)`:
    - `isValidEmail`: returns `false` if string has no `@`, more than one `@`, no characters before `@`, or no dot in the domain part after `@`; returns `true` for valid format
    - `validateContactForm`: returns `{ isValid, errors }` where `errors` is a map of field names to Indonesian error strings per the design spec; trims whitespace before checking emptiness
    - `initContactForm`: prevents default submit, calls `validateContactForm`, displays per-field error messages below each input (without page refresh), on success shows a toast notification within 2 seconds, then submits to Formspree or uses `mailto:` fallback
  - [x] 4.7 Create `src/js/main.js` as the entry point: imports and calls `initTheme()`, `initNavbar()`, `initHeroAnimation()`, `initSkillsObserver()`, `initPortfolioFilter(projectsData)`, and `initContactForm()` inside a `DOMContentLoaded` listener; also imports the projects data array and calls `handleCVDownload` on page load
  - [x] 4.8 Add the `handleCVDownload(cvUrl)` function (as specified in design Error Handling section) to `src/js/main.js` or a dedicated `src/js/cv.js`; performs a HEAD request on load and disables the CV button with an accessible error message if unavailable
  - [x] 4.9 Add a static `projectsData` array in `src/js/portfolio.js` or a dedicated `src/data/projects.js` with at least 3 sample `Project` objects covering at least 2 different categories, each with valid `id`, `title`, `description`, `thumbnail`, `category`, and `techStack`; include at least one project with `repoUrl` and one without to exercise the conditional link logic

- [x] 5. Property-Based Tests
  - [x] 5.1 Write property test for Property 1 — Active Nav Link Exclusivity
    - File: `src/tests/property/navbar.property.test.js`
    - For any valid section ID string, after `setActiveNavLink(sectionId)` is called, exactly one nav link has the active class and that link's `href` contains the given section ID
    - **Validates: Requirements 1.4**
  - [x] 5.2 Write property test for Property 2 — Mobile Menu Toggle Round-Trip
    - File: `src/tests/property/navbar.property.test.js`
    - For any boolean `isOpen`, after `toggleMobileMenu(isOpen)` the panel visibility matches `isOpen`; calling `toggleMobileMenu(true)` then `toggleMobileMenu(false)` always results in hidden state
    - **Validates: Requirements 1.6**
  - [x] 5.3 Write property test for Property 3 — Hero Animation Timing Invariant
    - File: `src/tests/property/hero.property.test.js`
    - For every element in the Hero Section, `animationDelay + animationDuration ≤ 1500ms`
    - **Validates: Requirements 2.8**
  - [x] 5.4 Write property test for Property 4 — Progress Bar Animation Correctness
    - File: `src/tests/property/skills.property.test.js`
    - For any `targetPercent` in [0, 100], after `animateProgressBar` completes the bar's final width equals `targetPercent`%
    - **Validates: Requirements 4.3, 4.4**
  - [x] 5.5 Write property test for Property 5 — Project Card Content Completeness
    - File: `src/tests/property/portfolio.property.test.js`
    - For any valid `Project` object, `createProjectCard` returns an element containing the title, description, and every item in `techStack`
    - **Validates: Requirements 5.3**
  - [x] 5.6 Write property test for Property 6 — Project Card Link Presence Conditional
    - File: `src/tests/property/portfolio.property.test.js`
    - For any `Project`, if `repoUrl`/`demoUrl` is undefined the corresponding `<a>` is absent; if defined the `<a>` exists with the exact URL as `href`
    - **Validates: Requirements 5.4**
  - [x] 5.7 Write property test for Property 7 — Filter Returns Only Matching Projects
    - File: `src/tests/property/portfolio.property.test.js`
    - For any array of projects and any category string, `filterProjects(projects, category)` returns exactly the matching subset (or all if `"all"`); no false inclusions, no false exclusions
    - **Validates: Requirements 5.6, 5.7**
  - [x] 5.8 Write property test for Property 8 — Form Validation Rejects Empty Fields
    - File: `src/tests/property/contact.property.test.js`
    - For any `ContactFormData` where one or more required fields is empty or whitespace-only, `validateContactForm` returns `isValid: false` with an error entry for each problematic field
    - **Validates: Requirements 6.3**
  - [x] 5.9 Write property test for Property 9 — Email Validation Correctness
    - File: `src/tests/property/contact.property.test.js`
    - Strings without `@` always return `false` from `isValidEmail`; strings from `fc.emailAddress()` always return `true`
    - **Validates: Requirements 6.4**
  - [x] 5.10 Write property test for Property 10 — External Links Security Attributes
    - File: `src/tests/property/accessibility.property.test.js`
    - For every `<a>` in the rendered document whose `href` starts with `http://` or `https://` and points to an external domain, `target` equals `"_blank"` and `rel` contains both `"noopener"` and `"noreferrer"`
    - **Validates: Requirements 6.7**
  - [x] 5.11 Write property test for Property 11 — Image Alt Text Non-Empty
    - File: `src/tests/property/accessibility.property.test.js`
    - For every `<img>` in the rendered document, the `alt` attribute is present and is not an empty string
    - **Validates: Requirements 7.3**
  - [x] 5.12 Write property test for Property 12 — Color Contrast Ratio Compliance
    - File: `src/tests/property/accessibility.property.test.js`
    - For every foreground/background CSS Custom Property pair defined in `variables.css` (both light and dark themes), the WCAG 2.1 contrast ratio is ≥ 4.5:1; implement the luminance formula inline
    - **Validates: Requirements 7.4**
  - [x] 5.13 Write property test for Property 13 — Below-the-Fold Images Have Lazy Loading
    - File: `src/tests/property/accessibility.property.test.js`
    - For every `<img>` that is not the hero/LCP image, the `loading` attribute equals `"lazy"`
    - **Validates: Requirements 8.2**

- [x] 6. Unit and Integration Tests
  - [x] 6.1 Create `src/tests/unit/navbar.test.js` with example-based unit tests:
    - `smoothScrollTo` with a mock DOM calls `scrollTo` or equivalent and does not exceed 800ms duration
    - `setActiveNavLink` with a known section ID correctly adds/removes active class
    - `toggleMobileMenu(false)` hides the panel and sets `aria-expanded="false"`
    - `toggleMobileMenu(true)` shows the panel and sets `aria-expanded="true"`
  - [x] 6.2 Create `src/tests/unit/hero.test.js` with example-based unit tests:
    - `initHeroAnimation` adds animation trigger classes to all expected hero elements
    - Animation delays are applied in the correct order (0, 200, 400, 600, 800 ms)
    - No element has a delay+duration sum exceeding 1500ms
  - [x] 6.3 Create `src/tests/unit/contact.test.js` with example-based unit tests:
    - `isValidEmail` returns `true` for `"test@example.com"`, `false` for `"notanemail"`, `false` for `"@nodomain"`, `false` for `"missing-at-sign"`
    - `validateContactForm` returns `{ isValid: true }` when all fields are properly filled
    - `validateContactForm` returns correct Indonesian error messages for each empty field
    - `validateContactForm` returns email-specific error for invalid email format
  - [x] 6.4 Create `src/tests/unit/portfolio.test.js` with example-based unit tests:
    - `filterProjects(sampleProjects, 'all')` returns all projects
    - `filterProjects(sampleProjects, 'Web App')` returns only Web App projects
    - `filterProjects(sampleProjects, 'NonExistent')` returns empty array
    - `createProjectCard` with a project that has both `repoUrl` and `demoUrl` produces two links with correct `href` values
    - `createProjectCard` with a project that has neither URL produces no anchor links
    - `createProjectCard` renders all `techStack` items as visible tags
  - [x] 6.5 Create `src/tests/unit/about.test.js` with example-based unit tests:
    - `handleCVDownload` with a mocked successful `fetch` HEAD does not disable the button
    - `handleCVDownload` with a mocked failed `fetch` HEAD disables the button, sets `aria-disabled="true"`, and shows an error message
  - [x] 6.6 Create `src/tests/smoke/css.smoke.test.js` that verifies:
    - The compiled CSS output contains `@media (prefers-color-scheme: dark)`
    - CSS Custom Property names from `variables.css` appear in the output
    - Transition properties are present in navbar and portfolio card rules
  - [x] 6.7 Create `src/tests/smoke/build.smoke.test.js` that verifies after `npm run build`:
    - The `dist/` directory contains at least one `.js` file and one `.css` file
    - The output JS and CSS files contain no multi-line block comments (confirming minification)
    - `dist/index.html` references the built asset files

- [x] 7. Asset Optimization
  - [x] 7.1 Add a placeholder SVG at `src/assets/images/placeholder.svg` to serve as the `onerror` fallback for broken project images; SVG should be a simple grey rectangle with a centered image icon
  - [x] 7.2 Add a placeholder profile image at `src/assets/images/profile.webp` (can be a generated or compressed WebP at ≥ 120×120px) for initial development; document in `README.md` that this should be replaced with the real photo before deployment
  - [x] 7.3 Add at least 3 sample project thumbnails as WebP files under `src/assets/images/projects/` (named matching the project slugs in `projectsData`); each must be at most 50% the size of an equivalent JPEG of the same dimensions to satisfy Requirement 8.1
  - [x] 7.4 Add a placeholder `src/assets/cv/dina-cv.pdf` (a minimal valid PDF) so the CV download and HEAD-check logic can be exercised during development; document replacement instructions in `README.md`
  - [x] 7.5 Add `loading="lazy"` to all `<img>` tags in `index.html` that are below-the-fold (all images except the hero profile photo); confirm the hero `<img>` has `fetchpriority="high"` and no `loading="lazy"`
  - [x] 7.6 Add `public/favicon.ico` (or SVG favicon), `public/robots.txt` (allowing all crawlers), and `public/sitemap.xml` (single URL entry for the site root) to satisfy Requirement 8.6 (SEO score ≥ 90)

- [x] 8. Build and Deployment Setup
  - [x] 8.1 Update `vite.config.js` to configure the production build: set `build.outDir` to `"dist"`, enable `build.minify: 'terser'` (or default esbuild), set `build.cssMinify: true`, configure `build.rollupOptions` to produce a single CSS chunk and a single JS chunk, and enable asset inlining threshold for small SVGs
  - [x] 8.2 Add a `"test"` script to `package.json` (`vitest --run`) and a `"test:coverage"` script (`vitest --run --coverage`); add a `"lint"` script if ESLint is installed
  - [x] 8.3 Create `.github/workflows/deploy.yml` (or `netlify.toml` / `vercel.json` depending on the chosen host) for CI/CD: on push to `main`, run `npm ci`, `npm test`, `npm run build`, then deploy the `dist/` folder to the static host
  - [x] 8.4 Install `@lhci/cli` as a dev dependency and create `.lighthouserc.js` (or `.lighthouserc.json`) asserting minimum scores of 90 for performance, accessibility, and SEO categories; add a `"lhci"` script to `package.json`
  - [x] 8.5 Add the Lighthouse CI step to the CI/CD workflow after the build step, running `npx lhci autorun` against the built `dist/` output served locally (using `vite preview`)
  - [x] 8.6 Create or update `README.md` with: project overview, local dev instructions (`npm install`, `npm run dev`), test instructions (`npm test`), build instructions (`npm run build`), deployment notes, and asset replacement instructions (profile photo, CV, project thumbnails)


## Notes

- Menggunakan Vite sebagai build tool.
- Menggunakan Vitest dan Fast-Check untuk testing.
- Target deployment menggunakan GitHub Pages atau Vercel.