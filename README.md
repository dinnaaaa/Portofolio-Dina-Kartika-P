# Portofolio Dina Kartika P.

Situs web portofolio pribadi **Dina Kartika P.** — dibangun sebagai *Single-Page Application* (SPA) menggunakan HTML5, CSS3, dan JavaScript ES6+ vanilla, dengan [Vite](https://vitejs.dev/) sebagai build tool. Tidak ada framework JavaScript berat; semua animasi dan interaksi ditulis menggunakan CSS Transitions/Animations dan Web API standar.

Situs ini dapat di-hosting secara statis di GitHub Pages, Netlify, maupun Vercel tanpa back-end.

---

## Pengembangan Lokal

**Prasyarat:** Node.js v20 atau lebih baru.

```bash
# 1. Install semua dependensi
npm install

# 2. Jalankan development server (dengan Hot Module Replacement)
npm run dev
```

Development server akan berjalan di `http://localhost:5173` secara default.

---

## Menjalankan Test

Proyek ini menggunakan [Vitest](https://vitest.dev/) sebagai test runner dan [fast-check](https://fast-check.dev/) untuk *property-based testing*.

```bash
# Jalankan semua test (unit + property + smoke)
npm test

# Jalankan test dengan laporan cakupan kode (coverage report)
npm run test:coverage
```

Laporan coverage akan dihasilkan di direktori `coverage/`.

---

## Build Produksi

```bash
# Build untuk produksi — output tersimpan di dist/
npm run build

# Preview hasil build secara lokal sebelum deploy
npm run preview
```

Setelah build selesai, semua aset yang telah diminifikasi (CSS dan JS) tersedia di direktori `dist/`.

---

## Deployment

### GitHub Pages (Otomatis via GitHub Actions)

Workflow CI/CD tersedia di `.github/workflows/deploy.yml`. Setiap kali ada `push` ke branch `main`, workflow akan:
1. Menginstall dependensi (`npm ci`)
2. Menjalankan semua test (`npm test`)
3. Melakukan build produksi (`npm run build`)
4. Menjalankan Lighthouse CI untuk audit performa/aksesibilitas/SEO
5. Men-deploy folder `dist/` ke GitHub Pages secara otomatis

**Cara mengaktifkan GitHub Pages:**
1. Di repositori GitHub, buka **Settings → Pages**.
2. Pada *Source*, pilih **GitHub Actions**.
3. Push ke branch `main` — deployment akan berjalan otomatis.

### Netlify

Konfigurasi tersedia di `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`

**Cara deploy ke Netlify:**
1. Login ke [netlify.com](https://app.netlify.com/) dan klik **Add new site → Import an existing project**.
2. Hubungkan repositori GitHub ini.
3. Netlify akan membaca `netlify.toml` secara otomatis — tidak perlu konfigurasi tambahan.

### Vercel

Vercel dapat digunakan dengan mengarahkan output directory ke `dist/`:
1. Login ke [vercel.com](https://vercel.com/) dan import repositori ini.
2. Pada pengaturan proyek, set **Output Directory** ke `dist`.
3. Build command: `npm run build`.

---

## Mengganti Aset Placeholder

Proyek ini menyertakan beberapa file placeholder untuk keperluan pengembangan. **Ganti semua file berikut dengan aset nyata sebelum men-deploy ke production:**

### 1. Foto Profil — `src/assets/images/profile.webp`

File saat ini adalah placeholder warna solid yang di-generate secara otomatis.

**Cara mengganti:**
1. Siapkan foto profil (format JPG atau PNG, minimal **120×120 piksel**, rasio 1:1 disarankan).
2. Konversi ke format **WebP** menggunakan [Squoosh](https://squoosh.app/) atau perintah `cwebp`:
   ```bash
   cwebp -q 82 foto-profil.jpg -o src/assets/images/profile.webp
   ```
3. Timpa file placeholder yang ada.

### 2. CV — `src/assets/cv/dina-cv.pdf`

File saat ini adalah PDF placeholder minimal.

**Cara mengganti:**
1. Ekspor CV terbaru ke format **PDF**.
2. Salin ke `src/assets/cv/dina-cv.pdf` (timpa file placeholder).
3. Verifikasi tombol "Unduh CV" di halaman berfungsi dengan benar setelah diganti.

### 3. Thumbnail Proyek — `src/assets/images/projects/`

File-file berikut adalah placeholder warna solid:
- `ecommerce-dashboard.webp`
- `weather-app.webp`
- `data-visualizer.webp`

**Cara mengganti:**
1. Siapkan screenshot atau mockup proyek (format JPG atau PNG, rasio **16:9** atau **4:3**, lebar minimal 400 piksel).
2. Konversi ke format **WebP**:
   ```bash
   cwebp -q 82 screenshot.png -o src/assets/images/projects/<slug>.webp
   ```
3. **Penting:** Nama file harus sesuai dengan nilai field `id` pada array `projectsData` di `src/js/portfolio.js`. Contoh: jika `id: "ecommerce-dashboard"`, maka nama file harus `ecommerce-dashboard.webp`.

---

## Lighthouse CI

Proyek ini menggunakan [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) untuk mengaudit kualitas build secara otomatis. Konfigurasi tersedia di `.lighthouserc.js` dengan target skor minimal:

| Kategori | Skor Minimum |
|---|---|
| Performa | 90 |
| Aksesibilitas | 90 |
| SEO | 90 |

Untuk menjalankan audit Lighthouse secara manual setelah build:

```bash
npm run build
npm run lhci
```

---

## Struktur Direktori

```
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD: test → build → deploy ke GitHub Pages
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml          # ⚠️ Perbarui <loc> dengan URL domain produksi
├── src/
│   ├── assets/
│   │   ├── cv/
│   │   │   └── dina-cv.pdf  # ⚠️ PLACEHOLDER — ganti sebelum deploy
│   │   └── images/
│   │       ├── placeholder.svg
│   │       ├── profile.webp # ⚠️ PLACEHOLDER — ganti dengan foto nyata
│   │       └── projects/    # ⚠️ PLACEHOLDER — ganti dengan screenshot proyek
│   ├── css/                 # Stylesheet per seksi
│   ├── js/                  # Modul JavaScript per komponen
│   └── tests/
│       ├── unit/            # Unit tests (Vitest + jsdom)
│       ├── property/        # Property-based tests (fast-check)
│       └── smoke/           # Smoke tests
├── scripts/                 # Utilitas generate placeholder aset
├── .lighthouserc.js         # Konfigurasi Lighthouse CI
├── netlify.toml             # Konfigurasi deployment Netlify
├── vite.config.js           # Konfigurasi Vite (build + test)
└── index.html               # Entry point HTML
```

---

## Script Utilitas

| Perintah | Keterangan |
|---|---|
| `node scripts/generate-webp.mjs` | Membuat ulang semua placeholder WebP |
| `node scripts/generate-pdf.mjs` | Membuat ulang placeholder CV PDF |
| `node scripts/generate-favicon.mjs` | Membuat ulang favicon.ico |

---

## Catatan SEO

Sebelum deployment ke production, perbarui nilai `<loc>` di `public/sitemap.xml` dengan URL domain produksi yang sebenarnya.
