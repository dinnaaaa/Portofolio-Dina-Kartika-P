import { defineConfig } from 'vite';

export default defineConfig({
  // Konfigurasi build produksi
  build: {
    // Output ke direktori dist/
    outDir: 'dist',
    // Minifikasi menggunakan esbuild (bawaan Vite, tanpa dependensi tambahan)
    minify: 'esbuild',
    // Minifikasi CSS
    cssMinify: true,
    // Inline aset kecil (termasuk SVG kecil) sebagai base64 data URL
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Satu file JS utama
        entryFileNames: 'assets/main.[hash].js',
        // Chunk tambahan (jika ada dinamis import)
        chunkFileNames: 'assets/[name].[hash].js',
        // Satu file CSS utama
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/style.[hash].css';
          }
          return 'assets/[name].[hash][extname]';
        },
        // Tidak memecah bundle menjadi banyak chunk (single JS output)
        manualChunks: undefined,
      },
    },
  },

  // Konfigurasi test runner (Vitest)
  test: {
    // Simulasi DOM browser untuk pengujian komponen UI
    environment: 'jsdom',
    // Aktifkan globals (describe, it, expect, dll.) tanpa perlu import manual
    globals: true,
    // Setup file untuk konfigurasi global, termasuk fast-check numRuns: 100
    // (fc.configureGlobal({ numRuns: 100 }) dikonfigurasi di setup.js)
    setupFiles: './src/tests/setup.js',
  },
});
