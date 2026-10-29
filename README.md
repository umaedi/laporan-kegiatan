# SiLapor DKP — Sistem Informasi Pelaporan & Audit Kegiatan Pegawai

Aplikasi berbasis Web Mobile (PWA / Mobile-First Responsive) yang dirancang khusus untuk lingkungan **Dinas Kelautan dan Perikanan (DKP)** guna memfasilitasi pencatatan kegiatan harian pegawai (baik di lapangan maupun internal kantor), verifikasi dan audit oleh pimpinan, serta rekapitulasi kinerja secara real-time.

---

## 🌟 Fitur Utama

### 1. Pelaporan Kegiatan Pegawai (`/buat-laporan`)
- **Dua Kategori Kegiatan**:
  - 🌊 **Luar Kantor (Lapangan)**: Untuk kegiatan monitoring tambak, penyuluhan nelayan, inspeksi TPI, dll.
  - 🏢 **Dalam Kantor (Internal)**: Untuk kegiatan rapat koordinasi, pelayanan PTSP, validasi dokumen, dll.
- **Pilih Foto Dokumentasi**: Dilengkapi galeri sampel foto kegiatan perikanan atau unggah foto mandiri.
- **Formulir Terstruktur**: Waktu, tanggal, lokasi, judul, dan deskripsi hasil kegiatan.

### 2. Pusat Kendali Audit & Verifikasi Pimpinan (`/audit-sistem`)
- **Statistik Total, Menunggu, & Disetujui**: Memantau status verifikasi laporan secara cepat.
- **Analisis Jenis Kegiatan**: Menampilkan perbandingan jumlah dan persentase antara data **Lapangan (Luar Kantor)** dan **Internal (Dalam Kantor)**.
- **Filter Tanggal**: Memfilter rekapitulasi dan arsip laporan berdasarkan tanggal spesifik kegiatan.
- **Rekapitulasi Kinerja Pegawai**: Menampilkan statistik kegiatan masing-masing pegawai di lingkungan dinas dengan tombol pintasan untuk **melihat profil akun dan riwayat laporan pegawai lain**.
- **Ekspor Data**: Mengunduh rekapitulasi laporan dalam format file `.json` untuk arsip kedinasan.

### 3. Evaluasi & Komentar Atasan (`/kegiatan/:id`)
- Pimpinan (Kepala Dinas) dapat memberikan tanggapan, penilaian, serta opsi aksi (**Disetujui** atau **Catatan/Revisi**).

### 4. Pusat Apresiasi & Umpan Balik (`/apresiasi`)
- Halaman khusus untuk melihat apresiasi dan catatan positif dari pimpinan terhadap laporan kegiatan teladan.

### 5. Profil Akun & Simulasi Role Akses (`/profil`)
- **Dua Mode Peran**:
  - **Mode Pegawai**: Menguji fitur pelaporan harian.
  - **Mode Admin (Kepala Dinas)**: Menguji pusat kendali audit, verifikasi, dan pemantauan kinerja staf.
- **Akses Profil Lain**: Admin dapat melihat profil mendetail dan daftar laporan dari setiap pegawai melalui halaman audit.

---

## 🛠️ Teknologi yang Digunakan

- **React 19** / **React DOM**
- **React Router v7** (Navigasi & Routing SPA)
- **Tailwind CSS v4** + `@tailwindcss/vite` (Styling & Responsive Layout)
- **Lucide React** (Ikon UI modern)
- **Vite** (Build tool super cepat)
- **LocalStorage API** (Penyimpanan state lokal persisten)

---

## 🚀 Cara Menjalankan Proyek (Development)

Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

1. **Clone / Buka direktori proyek**:
   ```bash
   cd /Users/frandyap/laporan-kegiatan
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Development Server)**:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses URL yang tertera di terminal (biasanya `http://localhost:5173`).

---

## 📦 Build untuk Produksi

Untuk menghasilkan file siap produksi di folder `dist`:
```bash
npm run build
```

Untuk melakukan preview build produksi secara lokal:
```bash
npm run preview
```

---

## 👥 Tim & Kontributor
* **Dinas Kelautan dan Perikanan (DKP)** — Pengembang Solusi Digital Kinerja Pegawai.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
