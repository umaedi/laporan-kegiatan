# AGENTS.md

Panduan untuk AI coding agent (Claude Code, Codex, Cursor, dll.) dan kontributor yang bekerja di repositori ini. Baca dokumen ini sebelum mengubah kode.

## Ringkasan Proyek

**Laporan Kegiatan Pegawai OPD** adalah media sosial internal Organisasi Perangkat Daerah dengan tampilan bergaya Instagram (foto, judul/caption, komentar). Pegawai melaporkan kegiatan (boleh beberapa kali sehari), memilih visibilitas laporan (*Hanya Kepala OPD* atau *Seluruh Pegawai OPD*), lalu berdiskusi dua arah dengan Kepala OPD di kolom komentar.

| Dokumen | Isi | Baca saat… |
|---|---|---|
| [PRD.md](PRD.md) | Kebutuhan produk, peran, **matriks izin (§6)**, user stories | Menambah/mengubah fitur |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, struktur folder, skema DB, API, **policy visibilitas (§6)**, deploy | Menyentuh data, API, auth, deploy |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Token warna/tipografi, komponen, copywriting | Membuat/mengubah UI |

Jika kode bertentangan dengan dokumen, **tanyakan** atau perbarui dokumen dalam perubahan yang sama. Jangan diam-diam menyimpang.

## Status Saat Ini vs Target

- **Frontend (repo ini):** SPA React yang terhubung ke API SIAPTUBA. Konfigurasi `VITE_API_URL` ada di `.env` (salin dari `.env.example`). Semua data server lewat `src/api/*` + hook TanStack Query di `src/hooks/*`. Sesi (token JWT + profil `/me`) ada di `src/context/AuthContext.jsx`. Tidak ada lagi data laporan di `localStorage`.
- **Backend:** ✅ sudah ada sebagai **modul `LaporanKegiatan` di super app SIAPTUBA** (`fullStactDeveloper/Laravel/siaptuba`), bukan server terpisah. Kontrak API: `siaptuba/docs/laporan-kegiatan/API.md`. Jalur integrasi frontend ada di ARCHITECTURE.md §9.

## Perintah

```bash
# Frontend (root)
npm install
npm run dev        # Vite dev server
npm run build      # build produksi ke dist/
npm run lint       # oxlint — wajib bersih sebelum selesai
npm run preview

# Backend (di repo SIAPTUBA)
cd ../../Laravel/siaptuba
# Jalankan HANYA migration modul ini: banyak migration lama berstatus Pending di DB lokal
php artisan migrate --path=database/migrations/2026_11_01_100000_create_laporan_kegiatan_tables.php
php artisan test --filter=LaporanKegiatanApiTest
php artisan serve
```

Sebelum menyatakan tugas selesai: jalankan `npm run lint` dan `npm run build` (serta `php artisan test --filter=LaporanKegiatanApiTest` di SIAPTUBA jika menyentuh backend), lalu laporkan hasilnya apa adanya.

## Stack & Konvensi

- **JavaScript (ESM) + JSX**, bukan TypeScript. Jangan mengonversi ke TS tanpa diminta. Gunakan JSDoc untuk tipe penting.
- React 19 function component + hooks. React Router 7 (`react-router-dom`). Tailwind CSS v4 (`@tailwindcss/vite`, token di `src/index.css` via `@theme`). Ikon hanya dari `lucide-react`.
- **Bahasa:**
  - Teks UI: **Bahasa Indonesia** sesuai glosarium DESIGN_SYSTEM.md §5 ("Laporan", "Apresiasi", "Kepala OPD", "Ditinjau"…).
  - Identifier kode: bahasa Inggris (`visibility`, `reviewAction`), **kecuali** nilai domain yang sudah ada: `luar_kantor`, `dalam_kantor`, `kepala_opd`, `pegawai`.
  - Path rute URL: Bahasa Indonesia (`/laporan/:id`, `/buat`, `/tinjau`).
  - Komentar kode: Bahasa Indonesia singkat, hanya bila perlu menjelaskan *mengapa*.
- **Penamaan berkas:** komponen `PascalCase.jsx`, hook `useCamelCase.js`, modul lain `camelCase.js`. Satu komponen default export per berkas.
- **Enum/konstanta** domain hanya didefinisikan di `src/shared/enums.js`. Jangan menulis string `'kepala_opd'`, `'private'`, `'opd'` secara literal di banyak tempat.
- **Styling:** gunakan kelas utilitas dari token (`bg-brand-700`, `text-fg-muted`). **Dilarang** memakai hex langsung, `text-[10px]`/`text-[11px]`, atau CSS baru di `index.css` kecuali untuk token/utilitas global.
- **Format tanggal** lewat helper di `src/lib/date.js` (locale `id-ID`, zona `Asia/Jakarta`). Jangan memakai `toISOString().split('T')[0]` untuk "hari ini" karena menghasilkan tanggal UTC, bukan WIB.
- Ikuti gaya kode di sekitarnya. Jangan me-reformat berkas yang tidak terkait dengan tugas.

## Aturan Keras (Jangan Dilanggar)

1. **Otorisasi hanya di server, lewat `App\Services\LaporanKegiatan\LaporanKegiatanAccess` (SIAPTUBA).** Setiap query daftar laporan memakai `visibleReports($user)`, dan setiap akses tunggal memakai `canView`/`canComment`/`canEdit`/`canReview`/`canDeleteComment`. Jangan menulis ulang kondisi visibilitas di controller/service/komponen, dan jangan memindahkannya ke Gate/Policy (`Gate::before` memberi role `admin` semua ability).
2. **Aturan emas visibilitas:** siapa pun yang bisa melihat laporan bisa berkomentar dan memberi apresiasi. Pegawai hanya melihat laporannya sendiri + laporan `opd` di OPD yang sama. Kepala OPD melihat semua laporan di OPD-nya. Data lintas OPD **tidak pernah** terlihat.
3. `opd_id`, `user_id`, dan peran **selalu** berasal dari user login (JWT) di server, tidak pernah dari body/query/klien. Kepala OPD = `opds.kepala_id`.
4. Akses ke laporan yang tidak diizinkan mengembalikan **404**, bukan 403.
5. **Foto** selalu disimpan di S3/MinIO dan hanya diakses lewat endpoint `GET /api/laporan-kegiatan/stream/{id}` (auth + aturan visibilitas, backend yang membaca S3). Jangan memakai signed URL, URL S3 langsung, atau route publik `/api/stream`. Di frontend, tampilkan foto dengan komponen `AuthImage`, bukan `<img src>`. Foto diproses ulang (Intervention Image) sehingga EXIF/GPS terhapus.
6. Setiap perubahan pada aturan izin **wajib** disertai pembaruan PRD.md §6 dan test di `siaptuba/tests/Feature/LaporanKegiatan/LaporanKegiatanApiTest.php`.
7. Penjagaan rute di frontend (`RequireRole`) hanya untuk UX, bukan keamanan.
8. **Jangan pernah** meng-commit `.env`, `.env.deploy`, kredensial server, atau data pegawai asli (NIP/nama asli) di seed. Data seed harus fiktif.
9. Jangan mengubah `deploy.sh`, `ecosystem.config.cjs`, atau konfigurasi server produksi tanpa diminta secara eksplisit.
10. Jangan memakai `dangerouslySetInnerHTML` untuk konten pengguna.

## Pola yang Diharapkan

**Data fetching (frontend):**
```js
// src/hooks/useFeed.js
export function useFeed(filter) {
  return useInfiniteQuery({
    queryKey: ['feed', filter],
    queryFn: ({ pageParam }) => api.reports.feed({ filter, cursor: pageParam }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
```
- Komponen tidak memanggil `fetch` langsung. Gunakan `src/api/*` + hook di `src/hooks/*`.
- Mutasi apresiasi dan komentar memakai optimistic update + rollback.

**Modul backend (SIAPTUBA):** ikuti `siaptuba/AGENTS.md`. Controller API (validasi + respons `{ success, message, data }`) → `LaporanKegiatanService` (logika + transaksi) → model Eloquent, dengan aturan akses dari `LaporanKegiatanAccess`. Kesalahan bisnis dilempar sebagai `LaporanKegiatanException(pesan, status)`.

**Mutasi yang memengaruhi beberapa tabel** (review → komentar + status) wajib dalam satu `DB::transaction`.

## Testing

- **Wajib:** test matriks izin (pegawai pembuat / pegawai lain / kepala OPD sama / pengguna OPD lain × `private` / `opd`) untuk lihat, komentar, apresiasi, edit, review, hapus komentar, dan akses media.
- Backend: Feature test Laravel (`DatabaseTransactions`) di SIAPTUBA. Buat OPD uji dengan id yang tidak dirujuk user mana pun, karena DB lokal berisi `users.opd_id` yatim.
- Frontend: Vitest + Testing Library untuk komponen dengan logika (VisibilityPicker, CommentComposer, PostCard state).
- Bug fix disertai test yang gagal sebelum perbaikan, bila memungkinkan.

## Git

- Gunakan Conventional Commits dengan deskripsi berbahasa Indonesia, seperti riwayat yang ada:
  `feat: tambah pemilih visibilitas laporan`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`.
- Satu commit = satu perubahan logis. Jangan mencampur refactor besar dengan fitur.
- Commit/push hanya bila diminta. Kerjakan di branch fitur, bukan langsung di `main`.
- Perhatikan perubahan yang belum di-commit milik pengguna di working tree. Jangan menimpa atau me-revert perubahan tersebut.

## Definisi Selesai

- [ ] Sesuai PRD (dan dokumen diperbarui bila perilaku berubah).
- [ ] UI memakai token dan komponen dari DESIGN_SYSTEM.md, teks berbahasa Indonesia, nyaman di lebar 360px.
- [ ] Aturan visibilitas lewat policy tunggal dan test izin lulus.
- [ ] `npm run lint` dan `npm run build` bersih, `LaporanKegiatanApiTest` (SIAPTUBA) lulus.
- [ ] State loading, kosong, dan error ditangani.
