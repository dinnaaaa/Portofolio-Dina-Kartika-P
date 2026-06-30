/**
 * portfolio.test.js — Unit tests for filterProjects and createProjectCard
 */

import { filterProjects, createProjectCard } from '../../js/portfolio.js';

const sampleProjects = [
  {
    id: 'project-1',
    title: 'Project One',
    description: 'Description one.',
    thumbnail: '/img/p1.webp',
    category: 'Web App',
    techStack: ['React', 'Node.js'],
    repoUrl: 'https://github.com/user/project-one',
    demoUrl: 'https://project-one.netlify.app',
  },
  {
    id: 'project-2',
    title: 'Project Two',
    description: 'Description two.',
    thumbnail: '/img/p2.webp',
    category: 'Mobile',
    techStack: ['React Native'],
    repoUrl: 'https://github.com/user/project-two',
  },
  {
    id: 'project-3',
    title: 'Project Three',
    description: 'Description three.',
    thumbnail: '/img/p3.webp',
    category: 'Web App',
    techStack: ['Vue', 'Django'],
  },
];

// ─── filterProjects ───────────────────────────────────────────────────────────

describe('filterProjects', () => {
  it('returns all projects when category is "all"', () => {
    const result = filterProjects(sampleProjects, 'all');
    expect(result).toHaveLength(3);
    expect(result).toBe(sampleProjects); // same reference, no copy
  });

  it('returns only Web App projects when category is "Web App"', () => {
    const result = filterProjects(sampleProjects, 'Web App');
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['project-1', 'project-3']);
  });

  it('returns only Mobile projects when category is "Mobile"', () => {
    const result = filterProjects(sampleProjects, 'Mobile');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('project-2');
  });

  it('returns empty array for a category that does not exist', () => {
    const result = filterProjects(sampleProjects, 'NonExistent');
    expect(result).toEqual([]);
  });

  it('returns empty array when projects list is empty and category is "all"', () => {
    const result = filterProjects([], 'all');
    expect(result).toEqual([]);
  });

  it('returns empty array when projects list is empty and a specific category is given', () => {
    const result = filterProjects([], 'Web App');
    expect(result).toEqual([]);
  });
});

// ─── createProjectCard ────────────────────────────────────────────────────────

describe('createProjectCard', () => {
  let project1, project2, project3;

  beforeEach(() => {
    // Use fresh copies so tests are independent
    [project1, project2, project3] = sampleProjects;
  });

  it('returns an <article> element', () => {
    const card = createProjectCard(project1);
    expect(card.tagName.toLowerCase()).toBe('article');
  });

  it('contains the project title in its text content', () => {
    const card = createProjectCard(project1);
    expect(card.textContent).toContain(project1.title);
  });

  it('contains the project description in its text content', () => {
    const card = createProjectCard(project1);
    expect(card.textContent).toContain(project1.description);
  });

  it('renders all techStack items as tag elements (project-1: React, Node.js)', () => {
    const card = createProjectCard(project1);
    const tags = card.querySelectorAll('.project-card__tag');
    const tagTexts = Array.from(tags).map((t) => t.textContent);
    expect(tagTexts).toContain('React');
    expect(tagTexts).toContain('Node.js');
  });

  it('project with repoUrl and demoUrl has exactly 2 <a> links with correct hrefs', () => {
    const card = createProjectCard(project1);
    const links = card.querySelectorAll('a');
    expect(links).toHaveLength(2);
    // Use getAttribute to get the raw href value set on the element,
    // avoiding jsdom's base-URL resolution of the a.href property.
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(project1.repoUrl);
    expect(hrefs).toContain(project1.demoUrl);
  });

  it('project with only repoUrl has exactly 1 <a> link pointing to repoUrl', () => {
    const card = createProjectCard(project2);
    const links = card.querySelectorAll('a');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe(project2.repoUrl);
  });

  it('project with neither repoUrl nor demoUrl has 0 <a> links', () => {
    const card = createProjectCard(project3);
    const links = card.querySelectorAll('a');
    expect(links).toHaveLength(0);
  });
});
