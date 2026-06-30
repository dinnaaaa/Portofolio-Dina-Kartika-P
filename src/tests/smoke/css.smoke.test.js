import { readFileSync } from 'fs';
import { resolve } from 'path';

const cssDir = resolve(process.cwd(), 'src/css');

const readCSS = (filename) =>
  readFileSync(resolve(cssDir, filename), 'utf-8');

describe('CSS source files smoke tests', () => {
  describe('variables.css', () => {
    let content;

    beforeAll(() => {
      content = readCSS('variables.css');
    });

    it('contains dark mode media query', () => {
      expect(content).toContain('@media (prefers-color-scheme: dark)');
    });

    it('defines --color-bg-primary custom property', () => {
      expect(content).toContain('--color-bg-primary');
    });

    it('defines --color-text-primary custom property', () => {
      expect(content).toContain('--color-text-primary');
    });

    it('defines --color-accent custom property', () => {
      expect(content).toContain('--color-accent');
    });

    it('defines --font-family-heading custom property', () => {
      expect(content).toContain('--font-family-heading');
    });

    it('defines --spacing-md custom property', () => {
      expect(content).toContain('--spacing-md');
    });
  });

  describe('navbar.css', () => {
    let content;

    beforeAll(() => {
      content = readCSS('navbar.css');
    });

    it('contains transition properties', () => {
      expect(content).toContain('transition:');
    });
  });

  describe('portfolio.css', () => {
    let content;

    beforeAll(() => {
      content = readCSS('portfolio.css');
    });

    it('contains transition properties for hover effects', () => {
      expect(content).toContain('transition:');
    });
  });

  describe('main.css', () => {
    let content;

    beforeAll(() => {
      content = readCSS('main.css');
    });

    it('imports variables.css', () => {
      expect(content).toContain('@import');
      expect(content).toContain('variables.css');
    });

    it('imports navbar.css', () => {
      expect(content).toContain('navbar.css');
    });

    it('imports portfolio.css', () => {
      expect(content).toContain('portfolio.css');
    });

    it('imports hero.css', () => {
      expect(content).toContain('hero.css');
    });
  });
});
