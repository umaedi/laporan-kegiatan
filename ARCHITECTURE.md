# ARCHITECTURE — SI KERANG KAMPAK (Laporan Kegiatan Pegawai OPD)

Dokumen ini menjelaskan arsitektur untuk kebutuhan di [PRD.md](PRD.md): frontend React di repositori ini dan backend sebagai modul di super app SIAPTUBA.

---

## 1. Ringkasan

```
Browser ──► React SPA (Vite, web mandiri) ──HTTPS + JWT──► SIAPTUBA (Laravel 13)
                                                              ├─ /api/login            (login yang sudah ada)
                                                              ├─ /api/laporan-kegiatan  (modul ini)
                                                              ├─ MySQL                 (users, opds, laporan_kegiatan_*)
                                                              └─ MinIO / s3            (foto laporan, privat)
```

- **Frontend:** repositori ini. React 19, React Router 7, Tailwind CSS 4, lucide-react, oxlint. Saat ini masih memakai data `localStorage` + login demo, dan akan dihubungkan ke API pada tahap berikutnya (§6).
- **Backend:** **modul di super app SIAPTUBA** (`fullStactDeveloper/Laravel/siaptuba`), bukan server terpisah. Rencana awal Express + Prisma + PostgreSQL dibatalkan agar modul memakai pengguna, OPD, autentikasi, penyimpanan, dan notifikasi SIAPTUBA yang sudah ada.
- **Kontrak API lengkap:** `siaptuba/docs/laporan-kegiatan/API.md`.

## 2. Keputusan

| Topik | Keputusan | Alasan |
|---|---|---|
| Backend | Modul `LaporanKegiatan` di SIAPTUBA | Satu sumber data pegawai & OPD untuk seluruh modul OPD |
| Autentikasi | `POST /api/login` SIAPTUBA (**email + password**) → JWT guard `api` | Endpoint yang sama dengan aplikasi mobile, tidak diubah |
| Cara akses | Web mandiri (bukan WebView) | Keputusan produk |
| Pegawai | User dengan `users.opd_id` di OPD tersebut | Data SIAPTUBA |
| Kepala OPD | User yang menjadi `opds.kepala_id` | Kolom definitif, tanpa menebak dari jabatan |
| Role `admin` SIAPTUBA | Tidak mendapat akses lintas OPD | Keputusan produk. Karena itu aturan akses tidak memakai Gate/Policy (`Gate::before` memberi admin semua ability) |
| Foto | Diproses ulang server (≤ 1600 px, JPEG, EXIF dihapus), selalu disimpan di **S3/MinIO**, diambil lewat **`/api/laporan-kegiatan/stream/{id}`** (auth + aturan visibilitas). Tanpa signed URL | Hanya backend yang mengakses S3. Route publik `/api/stream` tidak dipakai karena tanpa login |
| Notifikasi | `SendNotificationJob` SIAPTUBA (tabel `notifications` + FCM) | Infrastruktur yang sudah ada |

## 3. Backend di SIAPTUBA

| Lapisan | Lokasi |
|---|---|
| Route | `routes/api.php` → grup `auth:api`, prefix `laporan-kegiatan`, nama `api.laporan_kegiatan.*`. Termasuk `GET /stream/{photo}` untuk foto |
| Controller | `app/Http/Controllers/API/LaporanKegiatan/` — `LaporanKegiatanReportController` (me, feed, CRUD), `LaporanKegiatanInteraksiController` (komentar, suka, review, bintang), `LaporanKegiatanAdminController` (panel Kepala OPD), `LaporanKegiatanPhotoController` (stream foto) |
| Aturan akses | `app/Services/LaporanKegiatan/LaporanKegiatanAccess.php` — **satu-satunya** sumber aturan visibilitas |
| Logika bisnis | `app/Services/LaporanKegiatan/LaporanKegiatanService.php` — transaksi, proses foto, notifikasi |
| Bentuk JSON | `app/Services/LaporanKegiatan/LaporanKegiatanPresenter.php` |
| Model | `app/Models/LaporanKegiatan/` — `LaporanKegiatanReport`, `…Photo`, `…Comment`, `…Like` |
| Migration | `database/migrations/2026_11_01_100000_create_laporan_kegiatan_tables.php` |
| Test | `tests/Feature/LaporanKegiatan/LaporanKegiatanApiTest.php` — matriks izin + alur utama |

### 3.1 Model Data

```
opds 1───* users 1───* laporan_kegiatan_reports 1───* laporan_kegiatan_photos
  └ kepala_id → users                     │ 1───* laporan_kegiatan_comments (parent_id → comments, 1 tingkat)
                                          └ 1───* laporan_kegiatan_likes (unik per user)
```

| Tabel | Kolom penting |
|---|---|
| `laporan_kegiatan_reports` | `id` uuid, `user_id` uuid, `opd_id` (disalin saat dibuat), `title`, `description`, `activity_type`, `activity_at`, `location`, `visibility` (`private`/`opd`), `status` (`pending`/`reviewed`/`revision`), `rating` 1–5 + `rated_by` + `rated_at`, `like_count`, `comment_count`, `edited_at`, soft delete |
| `laporan_kegiatan_photos` | `report_id`, `file_path`, `width`, `height`, `size_kb`, `position` |
| `laporan_kegiatan_comments` | `report_id`, `user_id`, `parent_id`, `body`, `review_action` (`approved`/`revision`/null), soft delete |
| `laporan_kegiatan_likes` | `report_id`, `user_id` (unik berpasangan) |

Awalan `laporan_kegiatan_` dipakai karena tabel `kegiatan` dan endpoint `/api/kegiatan` sudah dipakai modul agenda SIAPTUBA.

### 3.2 Pemetaan dari Prototipe

| Prototipe (`localStorage`) | API |
|---|---|
| `id: 'LAP-DKP-001'` | `id` (uuid) |
| `date` + `time` | `activity_date` + `activity_time` (kirim), `activity_at` (ISO) |
| `photo` (satu URL/base64) | `photos[]` (1–5, path stream relatif) |
| `reporterId`, `reporterName`, `reporterPosition` | `author.id`, `author.nama`, `author.jabatan` |
| `likes: [userId]` | `like_count` + `liked_by_me` |
| `comments[].action` | `comments[].review_action` |
| `comments[].author` (string) | `comments[].author` (objek, termasuk `is_kepala_opd`) |
| `rating` | `rating` |
| Akun demo (NIP + `demo123`) | Akun SIAPTUBA (email + password) |

## 4. Otorisasi & Visibilitas

Diimplementasikan di `LaporanKegiatanAccess` (lihat PRD §6):

- `visibleReports(user)`: semua daftar laporan berangkat dari query ini. Kepala OPD melihat semua laporan di OPD-nya. Pegawai melihat laporannya sendiri + laporan `opd` di OPD yang sama.
- `canView` / `canComment` / `canLike`: aturan yang sama ("siapa pun yang bisa melihat bisa berkomentar dan menyukai").
- `canEdit`: hanya pembuat. `canReview`: hanya Kepala OPD di OPD yang sama. `canDeleteComment`: penulis atau Kepala OPD.
- Laporan yang tidak boleh dilihat dijawab **404**, bukan 403. `opd_id` dan peran selalu diambil dari user login di server.
- Laporan Kepala OPD selalu `opd`.
- User tanpa OPD, atau dengan `opd_id` yatim (menunjuk ke OPD yang tidak ada), ditolak 422.

Setiap perubahan aturan izin wajib disertai pembaruan PRD §6 dan test `LaporanKegiatanApiTest`.

## 5. Alur Utama

- **Membuat laporan:** `POST /api/laporan-kegiatan/reports` (multipart, `photos[]`). Dalam satu transaksi: buat laporan, proses & simpan foto, catat baris foto. Jika gagal, berkas yang sudah tersimpan dihapus.
- **Review Kepala OPD:** `POST /reports/{id}/review` → dalam satu transaksi: komentar bertanda review + status `reviewed`/`revision` + `comment_count`. Setelah itu notifikasi ke pembuat laporan.
- **Balasan:** `POST /reports/{id}/comments` dengan `parent_id` → notifikasi ke pembuat laporan dan penulis komentar induk (jika masih bisa melihat laporan). Pelaku tidak pernah menerima notifikasi atas aksinya sendiri.

## 6. Frontend

### 6.1 Rute

| Path | Halaman | Akses |
|---|---|---|
| `/masuk` | LoginPage | publik |
| `/` | FeedPage (Beranda) | login |
| `/buat` | CreateReportPage | login |
| `/laporan/:id` | ReportDetailPage | login |
| `/laporan/:id/edit` | EditReportPage | pembuat |
| `/notifikasi` | NotificationsPage | login |
| `/profil` · `/pegawai/:id` | ProfilePage | login |
| `/admin` | AdminDashboardPage: metrik, pelaporan hari ini, pratinjau antrean | kepala_opd |
| `/admin/tinjau` | AdminReviewQueuePage: laporan `pending`, terlama di atas | kepala_opd |
| `/admin/laporan` | AdminReportsPage: semua laporan, filter `?status=&pegawai=` | kepala_opd |
| `/admin/laporan/:id` | AdminReportDetailPage: detail, nilai bintang, komentar/review | kepala_opd |
| `/admin/pegawai` | AdminEmployeesPage: rekap per pegawai | kepala_opd |

`<RequireAuth>` membungkus rute yang memerlukan login, dan `<RequireAuth role="kepala_opd">` membungkus semua rute `/admin/*` (layout `AdminShell`). Penjagaan di klien hanya untuk kenyamanan UX, sedangkan keamanan tetap di server.

Navigasi bawah aplikasi pegawai (4 slot): **Beranda · Buat Kegiatan · Apresiasi · Profil**. Panel Kepala Dinas (`/admin`) memakai navigasi bawahnya sendiri: **Dasbor · Tinjau · Laporan · Pegawai**.

### 6.2 Manajemen State
- **Server state:** TanStack Query dengan key `['feed', filter]`, `['report', id]`, `['comments', id]`, `['notifications']`, `['user', id, 'reports']`, `['stats', ...]`.
- **Optimistic:** suka (toggle `liked_by_me`, `like_count`), komentar (tambah sementara dengan `id` lokal, rollback jika gagal).
- **Sesi:** login lewat `POST {VITE_API_URL}/api/login` (email + password, endpoint SIAPTUBA yang sudah ada) → simpan token JWT → `AuthContext` berisi hasil `GET /api/laporan-kegiatan/me` (termasuk `role`). Respons 401 global → hapus token, bersihkan cache, redirect ke `/masuk`.
- **Lokal:** draf form di `localStorage` (`draft:report`) dan preferensi visibilitas terakhir (`pref:visibility`).

### 6.3 Klien API
`src/api/client.js` berisi wrapper `fetch` yang menambahkan header `Authorization: Bearer <token>`, base `import.meta.env.VITE_API_URL` (URL SIAPTUBA), dan parsing respons `{ success, message, data | errors }` ke `ApiError`. Upload laporan memakai `FormData` (`photos[]`). Foto ditampilkan lewat komponen `AuthImage`: `apiBlob(photos[].url)` mengambil foto dengan header Bearer, blob URL di-cache TanStack Query (`['photo', path]`), lalu dicabut saat cache membuangnya. Token hanya dikirim ke path relatif backend.

## 7. Keamanan

| Ancaman | Mitigasi |
|---|---|
| Akses laporan `private` oleh pegawai lain | Aturan tunggal `LaporanKegiatanAccess`, test matriks, 404 untuk akses yang tidak diizinkan |
| Akses lintas OPD (termasuk role `admin`) | Filter `opd_id` dari user login di setiap query. Tidak memakai Gate sehingga `Gate::before` admin tidak berlaku |
| Hotlink foto private | Bucket S3 privat. Foto hanya keluar lewat endpoint stream yang mewajibkan token dan mengecek `canView` (404 bila tidak boleh) |
| Token JWT di browser | Disimpan di `localStorage` SPA. Wajib HTTPS, dan dilarang memakai `dangerouslySetInnerHTML` untuk konten pengguna (mencegah XSS mencuri token) |
| Brute force login | Ditangani endpoint `/api/login` SIAPTUBA |
| Unggahan berbahaya | Validasi `image` + `mimes`, maksimal 8 MB, lalu di-decode & di-encode ulang lewat Intervention Image (GD) |
| Kebocoran data pribadi | EXIF/GPS terhapus saat re-encode |
| Kredensial deploy | Ganti `sshpass` + password di `deploy.sh` dengan SSH key. `.env*` tetap di `.gitignore` |

## 8. Deployment

- **Frontend:** build statis (`npm run build`) di-deploy seperti sekarang (`deploy.sh` + pm2 `serve -s dist`). Tambahkan env build `VITE_API_URL` = URL SIAPTUBA.
- **Backend:** ikut rilis SIAPTUBA. Jalankan migration modul ini saja: `php artisan migrate --path=database/migrations/2026_11_01_100000_create_laporan_kegiatan_tables.php`. Database lokal SIAPTUBA memiliki banyak migration lama berstatus *Pending*, jadi jangan jalankan `php artisan migrate` biasa.
- **CORS:** `config/cors.php` SIAPTUBA sudah mengizinkan `api/*` dari semua origin.
- **Penyimpanan:** foto laporan selalu ke disk `s3` (MinIO). Wajib mengisi `AWS_BUCKET`, `AWS_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, dan `AWS_USE_PATH_STYLE_ENDPOINT=true` di setiap lingkungan, termasuk lokal.

## 9. Status Integrasi

1. **Backend:** ✅ modul SIAPTUBA + 19 feature test.
2. **Klien API:** ✅ `src/api/client.js` (token JWT, parsing error, event 401) + `src/api/laporan.js` (satu fungsi per endpoint).
3. **Data server:** ✅ TanStack Query di `src/hooks/` (`useReports`, `useComments`, `useAdmin`), dengan optimistic update untuk suka dan komentar.
4. **Login:** ✅ email + password ke `/api/login`, sesi dari `/api/laporan-kegiatan/me`. Akun demo dihapus.
5. **Data lokal dihapus:** ✅ `ReportContext`, `seedData`, `lib/reports.js` (aturan visibilitas kini hanya di server), `ReportListPage`, `ReportCard`, komponen dashboard lama.
6. **UI baru:** ✅ carousel multi-foto, unggah hingga 5 foto, komentar dua arah dengan balasan, grid profil, dan "muat lebih banyak" otomatis.
7. **Belum:** endpoint notifikasi (lonceng di header sementara memakai komentar terbaru dari `feed?filter=saya`), edit laporan (`PATCH` sudah tersedia di API, UI belum), dan halaman Apresiasi.

## PWA (Aplikasi Terpasang)

Nama aplikasi: **SI KERANG KAMPAK** (Sistem Informasi Kehadiran, Evaluasi, Rekapitulasi dan Kinerja Pegawai yang Akuntabel).

- `public/manifest.webmanifest`: nama, warna tema, ikon `favicon.png` (192) dan `pwa.png` (512, `any` + `maskable`). `logo.png` dipakai di header dan halaman masuk.
- `public/sw.js`: didaftarkan oleh `src/lib/pwa.js` hanya di build produksi. Halaman memakai strategi *network-first* (cadangan offline dari cache), aset statis *cache-first*. Permintaan non-GET dan lintas origin (API SIAPTUBA, termasuk foto `/stream`) **tidak pernah** di-cache.
- Nama cache memuat `__BUILD_ID__` yang diganti plugin di `vite.config.js` setiap build, sehingga cache lama terhapus saat rilis baru.
- `public/serve.json`: `Cache-Control: no-cache` untuk `sw.js`, manifest, dan `index.html` (server produksi memakai `serve -s dist`).
- Tombol **Pasang Aplikasi** di halaman Profil (`useInstallPrompt`); di iOS ditampilkan petunjuk "Tambah ke Layar Utama".
