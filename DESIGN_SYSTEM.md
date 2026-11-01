# DESIGN SYSTEM — Laporan Kegiatan Pegawai OPD

Bahasa visual: **feed sosial bergaya Instagram** (foto sebagai pusat perhatian, kartu tanpa bingkai, aksi ikonik) dengan **identitas institusi pemerintah** (hijau emerald, tipografi tegas, badge status yang jelas). Mobile-first, satu kolom.

Dokumen terkait: [PRD.md](PRD.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 1. Prinsip

1. **Foto dulu, teks kemudian.** Foto kegiatan adalah bukti dan konten utama, jadi tampilkan lebar penuh.
2. **Privasi selalu terlihat.** Setiap laporan dan formulir menampilkan visibilitasnya dengan jelas (🔒 / 👥). Pengguna tidak boleh ragu siapa yang bisa melihat laporannya.
3. **Status tanpa perlu membaca.** Warna + ikon + label untuk status review. Jangan hanya mengandalkan warna.
4. **Cepat dengan satu tangan.** Aksi utama berada di jangkauan ibu jari (navigasi bawah, FAB, composer komentar menempel di bawah).
5. **Tenang dan formal.** Ini alat kerja ASN, bukan hiburan: tanpa animasi berlebihan, emoji hanya sebagai penanda fungsional.

## 2. Token

Token didefinisikan sekali di `src/index.css` melalui `@theme` Tailwind v4, lalu dipakai sebagai kelas utilitas (`bg-brand-600`, `text-fg-muted`, dsb.). **Jangan menulis nilai hex langsung di komponen.**

### 2.1 Warna

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Brand — emerald (dipertahankan dari prototipe) */
  --color-brand-50:  #ecfdf5;
  --color-brand-100: #d1fae5;
  --color-brand-200: #a7f3d0;
  --color-brand-500: #10b981;
  --color-brand-600: #059669;
  --color-brand-700: #047857;   /* aksi utama */
  --color-brand-800: #065f46;   /* theme-color, header */
  --color-brand-900: #064e3b;

  /* Permukaan & teks (semantik) */
  --color-canvas:      #f1f5f9;  /* latar di luar kolom app (desktop) */
  --color-surface:     #ffffff;  /* latar app & kartu */
  --color-surface-alt: #f8fafc;  /* input, area sekunder */
  --color-border:      #e2e8f0;
  --color-fg:          #0f172a;  /* teks utama */
  --color-fg-muted:    #475569;  /* teks sekunder — lolos AA di putih */
  --color-fg-subtle:   #64748b;  /* meta/timestamp — gunakan ≥ 12px */

  /* Status review */
  --color-status-pending:     #b45309;  --color-status-pending-bg:  #fffbeb;
  --color-status-reviewed:    #047857;  --color-status-reviewed-bg: #ecfdf5;
  --color-status-revision:    #b91c1c;  --color-status-revision-bg: #fef2f2;

  /* Visibilitas */
  --color-vis-private:    #6d28d9;  --color-vis-private-bg: #f5f3ff;   /* ungu = rahasia/terbatas */
  --color-vis-opd:        #0369a1;  --color-vis-opd-bg:     #f0f9ff;   /* biru = terbuka internal */

  /* Jenis kegiatan */
  --color-act-luar:  #047857;   /* Luar Kantor  — Waves */
  --color-act-dalam: #1d4ed8;   /* Dalam Kantor — Building2 */

  /* Lain-lain */
  --color-like:   #0f766e;      /* tombol Sukai (teal-700, senada dengan brand hijau) */
  --color-danger: #dc2626;
}
```

Aturan pemakaian:
- **Satu warna aksi utama:** `brand-700` (tombol primer, link, tab aktif). `brand-800`/`900` untuk header dan teks judul brand.
- Status `revision` memakai **merah**, bukan amber, agar berbeda dari `pending` (amber).
- Gradien hanya dipakai pada kartu metrik dasbor (`.gradient-card` lama) dan FAB. Jangan dipakai untuk kartu feed.
- Mode gelap **tidak** dicakup v1. Karena semua warna sudah semantik, mode gelap nanti cukup mendefinisikan ulang token.

### 2.2 Tipografi

Font: **Plus Jakarta Sans** (400/500/600/700/800, sudah dimuat di `index.html`).

```css
@theme {
  --font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

| Token | Ukuran / line-height | Berat | Pemakaian |
|---|---|---|---|
| `text-display` | 24 / 32 | 800 | Nama OPD di header, angka metrik |
| `text-title` | 18 / 26 | 700 | Judul halaman |
| `text-heading` | 16 / 24 | 700 | Judul seksi, nama di profil |
| `text-body` | **14 / 20** | 400 | Caption, komentar, isi form (**ukuran minimum teks isi**) |
| `text-body-strong` | 14 / 20 | 600 | Nama pengguna di kartu/komentar, judul laporan di caption |
| `text-caption` | 12 / 16 | 500 | Timestamp, lokasi, jabatan, label badge |

- **Dilarang** memakai `text-[10px]` / `text-[11px]` seperti di prototipe. Ukuran minimum mutlak adalah 12px.
- Hapus `maximum-scale=1.0, user-scalable=no` dari meta viewport (`index.html`) agar pengguna bisa memperbesar tampilan (aksesibilitas). Cegah zoom otomatis iOS dengan memastikan input ≥ 16px.

### 2.3 Spasi, Radius, Bayangan

- **Skala spasi:** kelipatan 4px (`1`=4, `2`=8, `3`=12, `4`=16, `5`=20, `6`=24). Gutter horizontal halaman `px-4` (16px).
- **Radius:**
  | Token | Nilai | Pemakaian |
  |---|---|---|
  | `rounded-md` | 8px | Input, chip, badge persegi |
  | `rounded-xl` | 12px | Kartu sekunder, sheet item, thumbnail |
  | `rounded-2xl` | 16px | Bottom sheet, modal, kartu metrik |
  | `rounded-full` | — | Avatar, FAB, badge pill |
  Foto di kartu feed: **tanpa radius** (lebar penuh seperti Instagram).
- **Bayangan:** sangat terbatas. `shadow-sm` untuk navigasi menempel, `shadow-lg` untuk FAB, sheet, dan dropdown. Kartu feed tidak memakai bayangan, hanya pemisah `border-b border-border`.

### 2.4 Ikon
- **lucide-react** saja. Ukuran 24 (aksi kartu, navigasi), 20 (tombol di form/header), 16 (dalam badge/meta). `strokeWidth` 2, atau 2.5 untuk tab aktif.
- Ikon tetap: Beranda `Home` · Buat `Plus`/`Camera` · Tinjau `ClipboardCheck` · Notifikasi `Bell` · Profil `User` · Apresiasi `Heart` · Komentar `MessageCircle` · Private `Lock` · OPD `Users` · Luar Kantor `Waves` · Dalam Kantor `Building2` · Lokasi `MapPin` · Disetujui `CheckCircle2` · Perlu Tindak Lanjut `AlertTriangle` · Menunggu `Clock`.

### 2.5 Gerak
- Durasi 150ms (hover/press) dan 200–250ms (sheet, modal), dengan easing `ease-out`.
- Umpan balik tekan: `active:scale-[0.97]` untuk tombol dan FAB.
- Animasi apresiasi: ikon hati `scale 1 → 1.25 → 1` (200ms) dan isi warna `like`. Ketuk dua kali pada foto juga memberi apresiasi.
- Hormati `prefers-reduced-motion`: matikan animasi skala dan transisi geser.

## 3. Tata Letak

```
┌──────────── max-w-[480px] mx-auto ────────────┐
│ TopHeader (sticky, h-14)                      │  Logo/Nama OPD ········ 🔔
├───────────────────────────────────────────────┤
│ FilterChips (scroll horizontal)               │  Semua · Saya · Luar · Dalam · [Perlu Ditinjau]
├───────────────────────────────────────────────┤
│ PostCard                                      │
│ PostCard                                      │
│ …  (pb-24 agar tidak tertutup nav)            │
├───────────────────────────────────────────────┤
│ BottomNavbar (fixed, h-16 + safe-area)        │  🏠  📋/🔍  (＋)  🔔  👤
└───────────────────────────────────────────────┘
```

- Lebar app maksimal **480px** di tengah, dengan latar `canvas` di luar kolom (desktop).
- Navigasi bawah memakai `padding-bottom: env(safe-area-inset-bottom)`.
- Konten halaman detail: composer komentar menempel di atas navigasi bawah (navigasi disembunyikan di halaman detail dan form).

## 4. Komponen

Komponen primitif berada di `src/components/ui/`. Setiap komponen menerima `className` untuk penyesuaian, tetapi varian harus diselesaikan lewat prop, bukan override.

### 4.1 PostCard (inti)

```
┌───────────────────────────────────────────────┐
│ (●) Bayu Pratama, S.Pi.            🔒   ⋯     │ ← header 56px: Avatar 36, nama body-strong,
│     Penyuluh Perikanan · 2 jam                │   jabatan + waktu relatif caption, VisibilityBadge ikon
├───────────────────────────────────────────────┤
│                                               │
│               FOTO 1:1 (carousel)        1/3  │ ← lebar penuh, object-cover, indikator titik di bawah
│                                               │
├───────────────────────────────────────────────┤
│ ♡  💬                      [● Ditinjau]       │ ← PostActions: ikon 24 dalam target 44; StatusBadge kanan
│ 12 apresiasi                                  │
│ Monitoring Kualitas Air Pokdakan Mina…        │ ← judul body-strong
│ Melakukan pengukuran parameter kualitas…      │ ← deskripsi body, line-clamp-2 + "selengkapnya"
│ 🌊 Luar Kantor · 📍 Desa Karanganyar          │ ← meta caption fg-subtle
│ Lihat semua 4 komentar                        │ ← caption fg-muted, tautan ke detail
│ Dr. Dedy  ✅ Laporan sangat baik…              │ ← maks 2 komentar terbaru, satu baris
└───────────────────────────────────────────────┘
```
- Rasio foto **1:1** (`aspect-square`), maksimal **1000 × 1000 px** (`max-w-[1000px]`). Foto landscape/portrait di-crop `object-cover`, dan versi utuh bisa dilihat di viewer layar penuh saat ketuk.
- Menu `⋯` (hanya untuk pembuat): Edit · Ubah Visibilitas · Hapus.
- State: **skeleton** (blok abu-abu avatar, foto, dan 3 baris teks, `animate-pulse`), **foto gagal dimuat** (latar `surface-alt` + ikon `ImageOff`), dan **laporan dihapus/tidak tersedia**.

### 4.2 VisibilityPicker (form)
Segmented control dua opsi, lebar penuh, **selalu terlihat** di atas tombol Kirim.

```
Siapa yang dapat melihat laporan ini?
┌──────────────────────┬──────────────────────┐
│ 🔒 Hanya Kepala OPD   │ 👥 Seluruh Pegawai    │
│ Anda & Kepala OPD     │ Semua pegawai Dinas…  │
└──────────────────────┴──────────────────────┘
```
- Opsi terpilih memakai gaya yang sama dengan pemilih Jenis Kegiatan: `bg-emerald-800 text-white` + ikon `emerald-200`. Opsi lain `bg-slate-50 text-slate-600`. Label UI saat ini: "Hanya Kepala Dinas" / "Seluruh Pegawai".
- Implementasikan sebagai `role="radiogroup"` dengan dua `role="radio"`, bisa dinavigasi panah keyboard.
- Mengubah `private → opd` pada laporan yang sudah terbit memunculkan **ConfirmSheet**: "Seluruh komentar, termasuk dari Kepala OPD, akan dapat dilihat semua pegawai Dinas Perikanan."

### 4.3 VisibilityBadge
- Mode `icon` (header kartu): ikon 16 `Lock`/`Users` warna `vis-*` + `aria-label`.
- Mode `full` (detail): pill `bg-vis-*-bg text-vis-*` dengan label "Hanya Kepala OPD" / "Seluruh Pegawai OPD".

### 4.4 StatusBadge
| Status | Label | Ikon | Warna |
|---|---|---|---|
| `pending` | Menunggu Tinjauan | `Clock` | `status-pending` |
| `reviewed` | Ditinjau | `CheckCircle2` | `status-reviewed` |
| `revision` | Perlu Tindak Lanjut | `AlertTriangle` | `status-revision` |

Bentuk pill: `rounded-full px-2.5 py-0.5 text-caption font-semibold`, ikon 14.

### 4.5 ActivityTypeTag
Teks caption dengan ikon `Waves` (luar, `act-luar`) / `Building2` (dalam, `act-dalam`). Tag ini tidak berbentuk pill agar tidak bersaing dengan StatusBadge.

### 4.6 Komentar

**CommentItem**
```
(●) Dr. Dedy Palwadi  [Kepala OPD]          2j
    ┌─────────────────────────────────────┐
    │ ✅ Disetujui                          │ ← hanya komentar review: latar status-*-bg, border kiri 3px
    │ Laporan sangat baik dan komprehensif │
    └─────────────────────────────────────┘
    Balas · Hapus
    └─ (●) Bayu Pratama  Terima kasih Pak…  ← balasan indentasi 44px, avatar 28
```
- Komentar biasa tidak memiliki latar dan hanya berisi teks `body`.
- Badge peran "Kepala OPD" berupa pill kecil `bg-brand-50 text-brand-800`, sehingga komunikasi dua arah mudah dibedakan.
- Komentar terhapus yang punya balasan ditampilkan sebagai teks miring `fg-subtle` "Komentar dihapus".

**CommentComposer** (menempel di bawah halaman detail)
```
┌───────────────────────────────────────────────┐
│ Membalas Dr. Dedy ✕                           │ ← muncul saat membalas
│ (●) [ Tulis komentar…                ] Kirim  │
│ [✅ Setujui] [⚠️ Perlu Tindak Lanjut]          │ ← HANYA kepala_opd: chip opsional = kirim sebagai review
└───────────────────────────────────────────────┘
```
- Textarea tumbuh otomatis sampai 4 baris. Tombol Kirim nonaktif saat kosong. Penghitung karakter muncul saat > 900/1000.
- Laporan `private`: placeholder "Komentar hanya terlihat oleh Anda dan Kepala OPD" (atau "…oleh Anda dan {nama pegawai}" untuk kepala).

### 4.7 Tombol

| Varian | Gaya | Pemakaian |
|---|---|---|
| `primary` | `bg-brand-700 text-white hover:bg-brand-800` | Kirim laporan, Simpan |
| `secondary` | `bg-surface-alt text-fg border border-border` | Batal, aksi sekunder |
| `ghost` | `text-brand-700 hover:bg-brand-50` | Aksi dalam teks/toolbar |
| `danger` | `bg-danger text-white` | Hapus (selalu didahului konfirmasi) |
| `icon` | target 44×44, ikon 24, `rounded-full` | Aksi kartu, header |

Ukuran: `md` tinggi 44px (default), `lg` 52px (tombol kirim form, lebar penuh). State: `disabled` (opacity 50%, `cursor-not-allowed`), `loading` (spinner menggantikan ikon, teks tetap, `aria-busy`).

### 4.8 Input Form
- Tinggi 48px, `rounded-md`, `bg-surface-alt border border-border`, teks **16px** (mencegah zoom iOS), label `text-caption font-semibold text-fg-muted` di atas input.
- Fokus: `ring-2 ring-brand-500 border-transparent`. Error: border `danger` + pesan `text-caption text-danger` di bawah, dihubungkan lewat `aria-describedby`.

### 4.9 PhotoPicker (multi-foto)
- Kondisi kosong: dua tombol besar "Buka Kamera" / "Pilih Galeri" (dipertahankan dari prototipe).
- Setelah ada foto: baris thumbnail 72×72 `rounded-xl` yang bisa di-scroll horizontal, tombol ✕ di setiap thumbnail, petak "+" sampai 5 foto, dan progress bar unggah di setiap thumbnail.
- Foto pertama menjadi sampul dan diberi label kecil "Sampul".

### 4.10 Navigasi
- **BottomNavbar:** 5 slot. Slot tengah adalah FAB 56px `rounded-full` gradien `brand-800 → brand-600` dengan ikon `Plus` putih dan `ring-4 ring-surface`. Tab aktif memakai warna `brand-700`, ikon stroke 2.5, dan label `text-caption font-semibold`. Label selalu tampil (bukan hanya ikon).
- **Badge jumlah:** lingkaran `bg-danger text-white` minimal 18px, angka 11px bold (pengecualian ukuran yang diizinkan), "9+" untuk lebih dari 9.
- **FilterChips:** `h-9 px-4 rounded-full`. Chip aktif `bg-fg text-white`, chip tidak aktif `bg-surface-alt text-fg-muted`. Bisa di-scroll horizontal dengan `.no-scrollbar`.

### 4.11 Avatar
Ukuran 28 (balasan), 36 (kartu/komentar), 44 (composer/notifikasi), 88 (profil). Fallback berupa inisial 2 huruf di atas `bg-brand-100 text-brand-800`. Avatar Kepala OPD memiliki ring `ring-2 ring-brand-600`.

### 4.12 Bottom Sheet & Dialog
- Sheet dari bawah: `rounded-t-2xl`, handle 36×4 di atas, backdrop `bg-black/40`, tutup dengan geser atau ketuk backdrop.
- Konfirmasi destruktif memakai judul jelas, satu kalimat konsekuensi, tombol `danger` + `secondary`.

### 4.13 Profil
- Header: avatar 88, nama `heading`, jabatan + NIP `caption`, 3 statistik sebaris (Laporan · Bulan Ini · Ditinjau).
- Grid foto 3 kolom `gap-0.5`, petak `aspect-square`. Ikon kecil di pojok untuk multi-foto (`Copy`) dan laporan private (`Lock`).

### 4.14 Toast & Status Kosong
- **Toast:** muncul di atas navigasi, `rounded-xl bg-fg text-white`, otomatis hilang 3 detik, `role="status"`. Contoh: "Laporan terkirim", "Disimpan sebagai draf — akan dikirim saat online".
- **Status kosong:** ilustrasi ikon 48 `fg-subtle`, judul `heading`, satu kalimat, dan satu tombol primer. Contoh di feed: "Belum ada kegiatan hari ini" + "Buat Laporan".

## 5. Konten & Bahasa

- Bahasa Indonesia baku tapi ramah. Sapa pengguna dengan "Anda".
- Gunakan istilah yang konsisten:
  | Pakai | Hindari |
  |---|---|
  | Laporan / Laporan kegiatan | Post, unggahan, postingan |
  | Sukai (tombol), "Disukai N orang" (jumlah) | Like, Apresiasi |
  | Kepala OPD (atau jabatan aktual) | Atasan, admin, bos |
  | Ditinjau / Perlu Tindak Lanjut | Approved, revisi |
  | Hanya Kepala OPD / Seluruh Pegawai OPD | Private, publik |
- **Waktu:** relatif untuk < 7 hari ("baru saja", "5 mnt", "2 jam", "kemarin", "3 hari"), absolut setelahnya ("12 Okt 2026"). Detail laporan menampilkan waktu absolut lengkap "Senin, 12 Okt 2026 · 08.30 WIB".
- **Angka:** format `id-ID` (1.234). Jumlah 0 apresiasi tidak ditampilkan sama sekali.

## 6. Aksesibilitas (Checklist)

- [ ] Kontras teks ≥ 4.5:1 (token `fg-*` sudah memenuhi di atas `surface`).
- [ ] Target sentuh ≥ 44×44px.
- [ ] Setiap tombol ikon memiliki `aria-label` (misalnya "Beri apresiasi", "Lihat komentar").
- [ ] Foto memiliki `alt` = judul laporan.
- [ ] Status dan visibilitas dikomunikasikan lewat teks/ikon, bukan warna saja.
- [ ] Fokus keyboard terlihat (`focus-visible:ring-2 ring-brand-500`).
- [ ] Zoom pinch tidak diblokir.
- [ ] `prefers-reduced-motion` dihormati.

## 7. Migrasi dari Prototipe

| Prototipe | Menjadi |
|---|---|
| `ReportCard` (baris label/nilai bergaris putus-putus) | `PostCard` (§4.1) |
| `CommentSection` (hanya baca, "Ulasan Atasan") | `CommentList` + `CommentComposer` (§4.6) |
| Tab "Kegiatan" & "Apresiasi" di navigasi | Feed dengan FilterChips, Notifikasi, Tinjau (kepala) |
| `text-[10px]`, `text-[11px]` | `text-caption` (12px) minimal |
| Warna hex langsung (`#064e3b`, dll.) dan `:root` vars | Token `@theme` (§2) |
| `.gradient-card` | Dipertahankan hanya untuk kartu metrik di halaman Tinjau/Profil |
