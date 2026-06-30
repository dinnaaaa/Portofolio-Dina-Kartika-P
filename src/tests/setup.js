import * as fc from 'fast-check';

// Configure fast-check global options for all property-based tests
fc.configureGlobal({ numRuns: 100 });

// Polyfill requestAnimationFrame / cancelAnimationFrame for jsdom
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  let rafId = 0;
  globalThis.requestAnimationFrame = (cb) => {
    const id = ++rafId;
    Promise.resolve().then(() => cb(performance.now()));
    return id;
  };
  globalThis.cancelAnimationFrame = () => {};
}
