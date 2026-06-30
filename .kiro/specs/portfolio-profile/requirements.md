# Requirements Document

## Introduction

Fitur ini bertujuan membangun tampilan portofolio web pribadi yang menarik, modern, dan responsif untuk Dina Kartika P. Halaman web ini berfungsi sebagai identitas profesional daring yang menampilkan profil, keahlian, proyek, dan informasi kontak kepada calon pemberi kerja, klien, maupun kolaborator.

Situs portofolio ini dibangun sebagai satu halaman (*single-page*) dengan navigasi yang mulus antar seksi, tampilan yang optimal di berbagai ukuran layar, serta estetika desain yang modern dan profesional.

## Glossary

- **Portofolio_Web**: Aplikasi web satu halaman yang menjadi identitas profesional Dina Kartika P.
- **Hero_Section**: Bagian paling atas halaman yang menampilkan foto profil, nama, dan tagline.
- **About_Section**: Bagian yang menjelaskan latar belakang, kepribadian, dan tujuan karier Dina Kartika P.
- **Skills_Section**: Bagian yang menampilkan daftar keahlian teknis dan non-teknis beserta tingkat kemahiran.
- **Portfolio_Section**: Bagian yang menampilkan kartu-kartu proyek beserta deskripsi, teknologi yang digunakan, dan tautan terkait.
- **Contact_Section**: Bagian yang menyediakan formulir kontak dan tautan ke platform profesional.
- **Navbar**: Komponen navigasi yang memudahkan pengguna berpindah antar seksi.
- **Kartu_Proyek**: Elemen UI yang merepresentasikan satu proyek dengan gambar pratinjau, judul, deskripsi, dan tautan.
- **Pengguna**: Siapapun yang mengunjungi halaman portofolio (calon pemberi kerja, klien, kolaborator).

---

## Requirements

### Requirement 1: Navigasi Halaman

**User Story:** Sebagai Pengguna, saya ingin dapat berpindah antar seksi halaman dengan mudah, sehingga saya dapat menemukan informasi yang saya cari secara cepat.

#### Acceptance Criteria

1. THE Navbar SHALL menampilkan tautan navigasi ke seluruh seksi utama: Hero, About, Skills, Portfolio, dan Contact.
2. WHEN Pengguna mengklik tautan navigasi pada Navbar, THE Portofolio_Web SHALL menggulir halaman secara mulus (*smooth scroll*) ke seksi yang dituju dalam waktu tidak lebih dari 800ms.
3. WHILE Pengguna menggulir halaman, THE Navbar SHALL tetap terlihat di bagian atas layar (*sticky*).
4. WHEN Pengguna menggulir halaman sehingga tepi atas sebuah seksi berada dalam 50% atas area viewport yang terlihat, THE Navbar SHALL menyorot tautan navigasi yang sesuai dengan seksi tersebut sebagai seksi aktif.
5. WHERE perangkat memiliki lebar layar kurang dari 768 piksel, THE Navbar SHALL menyembunyikan tautan navigasi dan menampilkan ikon menu hamburger sebagai gantinya.
6. WHEN Pengguna mengklik ikon menu hamburger, THE Navbar SHALL menampilkan panel navigasi sehingga semua tautan seksi terlihat dan dapat diklik.
7. WHEN Pengguna mengklik tautan navigasi pada panel mobile yang terbuka, THE Navbar SHALL menutup panel navigasi dan menggulir ke seksi yang dituju.

---

### Requirement 2: Hero Section (Bagian Utama)

**User Story:** Sebagai Pengguna, saya ingin melihat identitas utama Dina Kartika P. begitu membuka halaman, sehingga saya langsung mengetahui siapa pemilik portofolio ini dan apa keahlian utamanya.

#### Acceptance Criteria

1. THE Hero_Section SHALL menampilkan foto profil Dina Kartika P. dalam format lingkaran atau persegi dengan sudut membulat, dengan ukuran minimal 120×120 piksel pada semua ukuran layar.
2. THE Hero_Section SHALL menampilkan nama lengkap "Dina Kartika P." sebagai judul utama (*heading* `<h1>`) halaman.
3. THE Hero_Section SHALL menampilkan tagline atau jabatan profesional di bawah nama, dengan panjang maksimal 80 karakter.
4. THE Hero_Section SHALL menampilkan deskripsi singkat (maksimal 3 kalimat) tentang Dina Kartika P.
5. THE Hero_Section SHALL menampilkan tombol aksi utama (*call-to-action*) yang mengarahkan Pengguna ke Portfolio_Section.
6. THE Hero_Section SHALL menampilkan tombol sekunder untuk mengunduh CV yang memicu pengunduhan file PDF CV tanpa berpindah halaman.
7. THE Hero_Section SHALL menampilkan tombol tersier (opsional) atau tautan yang mengarahkan Pengguna ke Contact_Section.
8. WHEN Pengguna memuat halaman, THE Hero_Section SHALL menampilkan animasi masuk (*entrance animation*) pada foto profil, nama, tagline, deskripsi, dan tombol, dengan durasi animasi total tidak melebihi 1,5 detik.
9. WHERE perangkat memiliki lebar layar kurang dari 768 piksel, THE Hero_Section SHALL menyusun elemen foto dan teks secara vertikal (foto di atas, teks di bawah).

---

### Requirement 3: About Section (Tentang Saya)

**User Story:** Sebagai Pengguna, saya ingin mengetahui lebih dalam tentang latar belakang Dina Kartika P., sehingga saya dapat menilai kesesuaian profil dengan kebutuhan saya.

#### Acceptance Criteria

1. THE About_Section SHALL menampilkan narasi biografi tentang Dina Kartika P. dengan panjang maksimal 150 kata, mencakup latar belakang pendidikan, minat, dan tujuan karier.
2. THE About_Section SHALL menampilkan minimal 2 statistik pencapaian (misalnya: jumlah proyek yang diselesaikan, tahun pengalaman) dalam sebuah blok visual yang secara visual berbeda dari teks biografi di sekitarnya.
3. THE About_Section SHALL menampilkan tombol unduhan CV dalam format PDF.
4. WHEN Pengguna mengklik tombol unduhan CV, THE Portofolio_Web SHALL memulai proses pengunduhan file CV tanpa menavigasi Pengguna keluar dari halaman.
5. IF file CV tidak tersedia atau gagal dimuat, THEN THE About_Section SHALL menampilkan pesan kesalahan yang informatif kepada Pengguna dan tombol unduhan SHALL tetap terlihat namun dinonaktifkan.
6. WHERE perangkat memiliki lebar layar 768 piksel atau lebih, THE About_Section SHALL menampilkan foto dan teks secara berdampingan (*side-by-side layout*).
7. WHERE perangkat memiliki lebar layar kurang dari 768 piksel, THE About_Section SHALL menyusun foto dan teks secara vertikal (foto di atas, teks di bawah).

---

### Requirement 4: Skills Section (Keahlian)

**User Story:** Sebagai Pengguna, saya ingin melihat keahlian teknis dan non-teknis Dina Kartika P., sehingga saya dapat menilai kompetensi yang dimiliki.

#### Acceptance Criteria

1. THE Skills_Section SHALL menampilkan keahlian teknis (*hard skills*) dalam minimal 2 kategori yang berbeda, dengan setiap kategori memiliki judul yang terlihat (misalnya: "Bahasa Pemrograman", "Framework", "Tools").
2. THE Skills_Section SHALL menampilkan setiap keahlian beserta ikon yang secara visual merepresentasikan nama teknologi tersebut sehingga Pengguna dapat mengidentifikasi teknologi dari ikon tanpa membaca labelnya.
3. THE Skills_Section SHALL menampilkan indikator tingkat kemahiran untuk setiap keahlian menggunakan skala numerik 0–100% yang direpresentasikan sebagai bilah progres (*progress bar*) atau bentuk visual setara.
4. WHEN elemen Skills_Section memasuki area tampilan (*viewport*) untuk pertama kalinya sejak halaman dimuat, THE Skills_Section SHALL menjalankan animasi pengisian pada indikator tingkat kemahiran dari 0% ke nilai target.
5. THE Skills_Section SHALL menampilkan keahlian non-teknis (*soft skills*) dalam subseksi yang terpisah secara visual dengan judul subseksi yang terlihat, berbeda dari subseksi keahlian teknis.

---

### Requirement 5: Portfolio Section (Proyek)

**User Story:** Sebagai Pengguna, saya ingin melihat karya dan proyek yang pernah dikerjakan oleh Dina Kartika P., sehingga saya dapat menilai kualitas dan pengalaman kerja yang dimiliki.

#### Acceptance Criteria

1. THE Portfolio_Section SHALL menampilkan daftar Kartu_Proyek dalam tata letak grid (*grid layout*) dengan minimal 2 kolom pada lebar layar 768 piksel atau lebih.
2. THE Kartu_Proyek SHALL menampilkan gambar pratinjau atau thumbnail proyek dengan rasio aspek yang konsisten antar semua kartu.
3. THE Kartu_Proyek SHALL menampilkan judul proyek, deskripsi singkat (maksimal 2 kalimat), dan daftar tag teknologi yang digunakan.
4. THE Kartu_Proyek SHALL menampilkan tautan menuju repositori kode (misalnya GitHub) dan/atau tautan demo langsung (*live demo*) apabila tersedia; IF tidak ada tautan yang tersedia, THEN tautan tersebut SHALL tidak ditampilkan.
5. WHEN Pengguna mengarahkan kursor di atas Kartu_Proyek pada perangkat dengan pointer, THE Kartu_Proyek SHALL menampilkan efek visual (*hover effect*) seperti overlay, elevasi bayangan, atau transformasi skala dalam waktu kurang dari 300ms.
6. THE Portfolio_Section SHALL menampilkan tombol atau tab filter kategori di atas grid kartu, dengan opsi "Semua" tersedia sebagai filter default.
7. WHEN Pengguna memilih sebuah filter kategori, THE Portfolio_Section SHALL menampilkan hanya Kartu_Proyek yang sesuai dengan kategori tersebut menggunakan transisi animasi dengan durasi tidak melebihi 400ms.
8. WHERE perangkat memiliki lebar layar kurang dari 768 piksel, THE Portfolio_Section SHALL menampilkan Kartu_Proyek dalam satu kolom.

---

### Requirement 6: Contact Section (Kontak)

**User Story:** Sebagai Pengguna, saya ingin dapat menghubungi Dina Kartika P. dengan mudah, sehingga saya dapat menyampaikan penawaran, pertanyaan, atau ajakan kolaborasi.

#### Acceptance Criteria

1. THE Contact_Section SHALL menampilkan formulir kontak dengan kolom: nama lengkap (wajib), alamat email (wajib), subjek (wajib), dan pesan (wajib).
2. WHEN Pengguna mengirimkan formulir kontak dengan semua kolom wajib terisi dan format email yang valid (mengandung karakter `@` dan domain), THE Contact_Section SHALL menampilkan notifikasi keberhasilan yang terlihat kepada Pengguna dalam waktu kurang dari 2 detik.
3. IF Pengguna mengirimkan formulir kontak dengan satu atau lebih kolom wajib yang kosong, THEN THE Contact_Section SHALL menampilkan pesan kesalahan spesifik di bawah setiap kolom yang bermasalah tanpa menyegarkan halaman.
4. IF Pengguna memasukkan format email yang tidak valid (tidak mengandung karakter `@` atau domain yang valid), THEN THE Contact_Section SHALL menampilkan pesan kesalahan spesifik di bawah kolom email tanpa menyegarkan halaman.
5. THE Contact_Section SHALL menampilkan ikon tautan menuju profil LinkedIn, GitHub, dan platform profesional lainnya yang relevan.
6. THE Contact_Section SHALL menampilkan alamat email kontak yang dapat diklik menggunakan protokol `mailto:` sehingga mengaktifkan klien email bawaan perangkat.
7. WHEN Pengguna mengklik tautan platform eksternal (LinkedIn, GitHub), THE Portofolio_Web SHALL membuka tautan tersebut di tab baru peramban menggunakan atribut `target="_blank"` dengan `rel="noopener noreferrer"`.

---

### Requirement 7: Desain Responsif dan Aksesibilitas

**User Story:** Sebagai Pengguna, saya ingin tampilan portofolio terlihat baik di semua perangkat, sehingga saya dapat mengakses informasi dengan nyaman dari komputer, tablet, maupun ponsel.

#### Acceptance Criteria

1. THE Portofolio_Web SHALL merender tampilan tanpa horizontal overflow, teks yang terpotong, atau elemen yang saling tumpang tindih pada lebar layar 320 piksel hingga 1920 piksel.
2. THE Portofolio_Web SHALL mencapai nilai *Largest Contentful Paint* (LCP) kurang dari 3 detik pada simulasi koneksi 10 Mbps menggunakan alat seperti Lighthouse atau WebPageTest.
3. THE Portofolio_Web SHALL menyediakan teks alternatif (*alt text*) yang tidak kosong dan mendeskripsikan fungsi atau konten visual dari setiap elemen gambar.
4. THE Portofolio_Web SHALL menggunakan rasio kontras warna antara teks dan latar belakang minimal 4,5:1 sesuai standar WCAG 2.1 Level AA.
5. THE Portofolio_Web SHALL mendukung navigasi penuh menggunakan keyboard (Tab, Shift+Tab, Enter) untuk semua elemen interaktif (tautan, tombol, kontrol formulir), dengan indikator fokus yang terlihat pada setiap elemen yang difokuskan.
6. WHEN Pengguna mengaktifkan preferensi tema gelap (*dark mode*) pada sistem operasi, THE Portofolio_Web SHALL menampilkan skema warna tema gelap secara otomatis menggunakan CSS media query `prefers-color-scheme: dark`.
7. THE Portofolio_Web SHALL menggunakan elemen HTML semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) yang sesuai untuk setiap bagian konten.

---

### Requirement 8: Performa dan Optimasi Aset

**User Story:** Sebagai Pengguna, saya ingin halaman portofolio memuat dengan cepat, sehingga saya tidak perlu menunggu lama untuk melihat kontennya.

#### Acceptance Criteria

1. THE Portofolio_Web SHALL mengompresi seluruh aset gambar ke format WebP, menghasilkan pengurangan ukuran file minimal 50% dibandingkan sumber aslinya dalam format JPEG atau PNG.
2. THE Portofolio_Web SHALL menerapkan *lazy loading* (atribut `loading="lazy"`) pada semua elemen gambar yang berada di luar area tampilan awal (*below the fold*).
3. WHEN proses build atau deployment dijalankan, THE Portofolio_Web SHALL meminifikasi (*minify*) seluruh file CSS dan JavaScript sehingga tidak ada whitespace atau komentar yang tidak perlu pada aset produksi.
4. THE Portofolio_Web SHALL mencapai skor Google Lighthouse minimal 90 pada kategori Performa.
5. THE Portofolio_Web SHALL mencapai skor Google Lighthouse minimal 90 pada kategori Aksesibilitas.
6. THE Portofolio_Web SHALL mencapai skor Google Lighthouse minimal 90 pada kategori SEO.
