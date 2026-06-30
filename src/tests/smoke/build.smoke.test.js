import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');

/**
 * Return all files in `dir` that end with `ext`.
 * Returns an empty array if the directory doesn't exist.
 */
function getFilesInDir(dir, ext) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(f => f.isFile() && f.name.endsWith(ext))
    .map(f => join(dir, f.name));
}

describe('Build Smoke Test', () => {
  beforeAll(() => {
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  }, 120_000); // 2-minute timeout for the production build

  it('dist/ contains at least one .js file', () => {
    const jsFiles = getFilesInDir(ASSETS, '.js');
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  it('dist/ contains at least one .css file', () => {
    const cssFiles = getFilesInDir(ASSETS, '.css');
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('JS files have no multi-line block comments', () => {
    const jsFiles = getFilesInDir(ASSETS, '.js');
    expect(jsFiles.length).toBeGreaterThan(0);

    for (const file of jsFiles) {
      const content = readFileSync(file, 'utf-8');
      // Multi-line block comments start with /* followed immediately by a newline.
      // Single-line license banners like /*! … */ on one line are intentionally kept by Vite.
      const hasMultilineComments = /\/\*[\r\n]/.test(content);
      expect(hasMultilineComments).toBe(false);
    }
  });

  it('CSS files have no multi-line block comments', () => {
    const cssFiles = getFilesInDir(ASSETS, '.css');
    expect(cssFiles.length).toBeGreaterThan(0);

    for (const file of cssFiles) {
      const content = readFileSync(file, 'utf-8');
      const hasMultilineComments = /\/\*[\r\n]/.test(content);
      expect(hasMultilineComments).toBe(false);
    }
  });

  it('dist/index.html exists and references built asset files', () => {
    const indexPath = join(DIST, 'index.html');
    expect(existsSync(indexPath)).toBe(true);

    const html = readFileSync(indexPath, 'utf-8');

    // index.html must reference at least one .js asset
    expect(html).toMatch(/\.js/);

    // index.html must reference at least one .css asset
    expect(html).toMatch(/\.css/);
  });
});
