// Feature: portfolio-profile, Property 5: createProjectCard returns element containing title, description, and all techStack items
// Feature: portfolio-profile, Property 6: Project Card Link Presence Conditional
// Feature: portfolio-profile, Property 7: filterProjects(category) returns exact subset

/**
 * Property-based tests for portfolio.js
 *
 * Property 5: Project Card Content Completeness
 * Validates: Requirements 5.3
 *
 * Property 6: Project Card Link Presence Conditional
 * Validates: Requirements 5.4
 *
 * Property 7: Filter Returns Only Matching Projects
 * Validates: Requirements 5.6, 5.7
 */

import * as fc from 'fast-check';
import { createProjectCard, filterProjects } from '../../js/portfolio.js';

describe('Property 5 — Project Card Content Completeness', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Card element contains title, description, and every techStack item', () => {
    // Feature: portfolio-profile, Property 5: createProjectCard returns element containing title, description, and all techStack items
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1, maxLength: 60 }),
          description: fc.string(),
          thumbnail: fc.string(),
          category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
          techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 }),
          repoUrl: fc.option(fc.webUrl(), { nil: undefined }),
          demoUrl: fc.option(fc.webUrl(), { nil: undefined }),
        }),
        (project) => {
          const card = createProjectCard(project);

          const text = card.textContent;

          // Title must be present
          expect(text).toContain(project.title);

          // Description must be present
          expect(text).toContain(project.description);

          // Every techStack item must be present
          for (const tech of project.techStack) {
            expect(text).toContain(tech);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 6 — Project Card Link Presence Conditional', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('repo/demo <a> elements are present iff repoUrl/demoUrl are defined, with exact href values', () => {
    // Feature: portfolio-profile, Property 6: Project Card Link Presence Conditional
    // **Validates: Requirements 5.4**
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1, maxLength: 60 }),
          description: fc.string(),
          thumbnail: fc.string(),
          category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
          techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 }),
          repoUrl: fc.option(fc.webUrl(), { nil: undefined }),
          demoUrl: fc.option(fc.webUrl(), { nil: undefined }),
        }),
        (project) => {
          const card = createProjectCard(project);
          const anchors = Array.from(card.querySelectorAll('a'));

          if (project.repoUrl === undefined) {
            // No <a> with this URL should exist
            const repoAnchors = anchors.filter((a) => a.href === project.repoUrl);
            expect(repoAnchors).toHaveLength(0);
          } else {
            // Exactly one <a> with href === repoUrl must exist
            const repoAnchors = anchors.filter((a) => a.getAttribute('href') === project.repoUrl);
            expect(repoAnchors.length).toBeGreaterThanOrEqual(1);
          }

          if (project.demoUrl === undefined) {
            // No <a> with this URL should exist
            const demoAnchors = anchors.filter((a) => a.href === project.demoUrl);
            expect(demoAnchors).toHaveLength(0);
          } else {
            // Exactly one <a> with href === demoUrl must exist
            const demoAnchors = anchors.filter((a) => a.getAttribute('href') === project.demoUrl);
            expect(demoAnchors.length).toBeGreaterThanOrEqual(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Generates a valid Project object with a category drawn from a fixed set. */
const projectArb = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1, maxLength: 60 }),
  description: fc.string(),
  thumbnail: fc.string(),
  category: fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX'),
  techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 }),
  repoUrl: fc.option(fc.webUrl(), { nil: undefined }),
  demoUrl: fc.option(fc.webUrl(), { nil: undefined }),
});

/** Generates a category value — the same set used in projectArb, plus 'all'. */
const categoryArb = fc.constantFrom('Web App', 'Mobile', 'Data', 'UI/UX', 'all');

// ─── Property 7 ───────────────────────────────────────────────────────────────

describe('Property 7 — Filter Returns Only Matching Projects', () => {
  it('returns all projects when category is "all"', () => {
    // Feature: portfolio-profile, Property 7: filterProjects(projects, "all") returns full array
    fc.assert(
      fc.property(fc.array(projectArb), (projects) => {
        const result = filterProjects(projects, 'all');
        expect(result).toHaveLength(projects.length);
        // Reference equality: same objects, same order
        result.forEach((item, i) => expect(item).toBe(projects[i]));
      }),
      { numRuns: 100 }
    );
  });

  it('returns exactly the matching subset — no false inclusions, no false exclusions', () => {
    // Feature: portfolio-profile, Property 7: filterProjects(category) returns exact subset
    fc.assert(
      fc.property(fc.array(projectArb), categoryArb, (projects, category) => {
        if (category === 'all') return; // covered by the previous test

        const result = filterProjects(projects, category);
        const expected = projects.filter((p) => p.category === category);

        // Correct count
        expect(result).toHaveLength(expected.length);

        // Every returned project matches the requested category (no false inclusions)
        result.forEach((p) => expect(p.category).toBe(category));

        // Every matching project is present in the result (no false exclusions)
        expected.forEach((p) => expect(result).toContain(p));
      }),
      { numRuns: 100 }
    );
  });

  it('returns an empty array when no project matches the given category', () => {
    // Feature: portfolio-profile, Property 7: filterProjects with non-matching category yields []
    fc.assert(
      fc.property(
        // Use a category that is guaranteed not to appear in the generated projects
        fc.array(projectArb),
        (projects) => {
          const result = filterProjects(projects, '__NonExistentCategory__');
          expect(result).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('result is a subset of the original array (no invented projects)', () => {
    // Feature: portfolio-profile, Property 7: filterProjects(category) never introduces new items
    fc.assert(
      fc.property(fc.array(projectArb), categoryArb, (projects, category) => {
        const result = filterProjects(projects, category);
        result.forEach((item) => expect(projects).toContain(item));
      }),
      { numRuns: 100 }
    );
  });
});
