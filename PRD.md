# PRD — Laporan Kegiatan Pegawai OPD (Media Sosial Internal OPD)

|                 |                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Status          | Draft v1                                                                                         |
| Tanggal         | 1 November 2026                                                                                  |
| Pemilik produk  | Tim Pengembang Laporan Kegiatan                                                                  |
| Dokumen terkait | [ARCHITECTURE.md](ARCHITECTURE.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [AGENTS.md](AGENTS.md) |

---

## 1. Latar Belakang

Aplikasi saat ini adalah prototipe laporan kegiatan untuk pegawai Dinas Perikanan. Pegawai sudah bisa membuat laporan (foto, judul, lokasi, deskripsi, jenis kegiatan dalam/luar kantor), dan kepala dinas bisa memberi catatan. Keterbatasannya:

- Data hanya ada di `localStorage` browser, jadi tidak bisa dipakai bersama dan hilang saat cache dibersihkan.
- Belum ada login. Identitas pegawai dan kepala dinas masih ditulis langsung di kode.
- Komunikasi hanya satu arah: atasan memberi catatan, pegawai tidak bisa membalas.
- Hanya untuk satu OPD (Dinas Perikanan).
- Belum ada pengaturan siapa yang boleh melihat sebuah laporan.

## 2. Visi Produk

Menjadikan laporan kegiatan harian sebagai **media sosial internal OPD**. Pegawai membagikan kegiatan dalam bentuk unggahan bergaya Instagram (foto, judul/caption, komentar). Kepala OPD memantau dan memberi umpan balik secara langsung. Antarpegawai bisa saling melihat, mengapresiasi, dan berdiskusi tentang kegiatan yang dibuka untuk umum di OPD.

## 3. Tujuan & Non-Tujuan

### 3.1 Tujuan

1. Pegawai bisa melaporkan kegiatan **lebih dari satu kali sehari** dengan cepat dari HP (target: kurang dari 60 detik dari membuka aplikasi sampai laporan terkirim).
2. Kepala OPD bisa melihat **seluruh** laporan pegawai di OPD-nya dan memberi komentar atau review.
3. **Komunikasi dua arah** antara pegawai dan kepala OPD dalam utas komentar setiap laporan.
4. Pegawai bisa memilih **visibilitas** setiap laporan: _Hanya Kepala OPD_ atau _Seluruh Pegawai OPD_.
5. Mendukung **banyak OPD** dalam satu sistem, dengan data antar-OPD terisolasi penuh.

### 3.2 Non-Tujuan (v1)

- Tidak ada pesan langsung (DM) atau chat di luar utas laporan.
- Tidak ada feed lintas OPD atau unggahan publik ke internet.
- Tidak ada integrasi dengan e-Kinerja/SKP, absensi, atau TTE (masuk backlog).
- Tidak ada video, story, atau siaran langsung.
- Tidak ada aplikasi native. v1 berupa web app mobile-first yang bisa dipasang sebagai PWA.

## 4. Pengguna & Peran

Sistem hanya memiliki **dua peran** di dalam aplikasi.

| Peran          | Deskripsi                                                                   | Jumlah per OPD        |
| -------------- | --------------------------------------------------------------------------- | --------------------- |
| **Pegawai**    | ASN/non-ASN di sebuah OPD yang melaporkan kegiatannya.                      | Banyak                |
| **Kepala OPD** | Pimpinan OPD (Kepala Dinas/Badan/Kantor). Memantau dan memberi umpan balik. | Tepat satu yang aktif |

Setiap pengguna terikat ke **tepat satu OPD**.

> Pengelolaan akun (membuat OPD, menambah pegawai, mengganti kepala OPD, reset kata sandi) di v1 dilakukan oleh operator sistem melalui skrip CLI/seed, **bukan** dari dalam aplikasi. Lihat Pertanyaan Terbuka Q1.

### 4.1 Persona

- **Bayu (Pegawai lapangan, 30-an):** sering di tambak dan TPI, sinyal tidak stabil, memotret langsung dari kamera HP, ingin melapor cepat dan tahu apakah atasan sudah menanggapi.
- **Dr. Dedy (Kepala Dinas, 50-an):** jadwal padat, membuka aplikasi beberapa kali sehari, butuh daftar "apa yang belum saya tanggapi" dan bisa membalas singkat.

## 5. Konsep Inti

### 5.1 Laporan Kegiatan (Post)

Setiap laporan adalah satu unggahan yang berisi:

- **Foto**: 1–5 foto (carousel), minimal 1 foto wajib.
- **Judul/caption**: wajib, maksimal 150 karakter.
- **Deskripsi**: opsional, maksimal 2.000 karakter.
- **Jenis kegiatan**: `Luar Kantor` / `Dalam Kantor`.
- **Tanggal & jam kegiatan**: default waktu saat ini, bisa diubah ke waktu lampau (maksimal 7 hari ke belakang, tidak boleh di masa depan).
- **Lokasi**: teks bebas.
- **Visibilitas**: `Hanya Kepala OPD` atau `Seluruh Pegawai OPD` (lihat 5.2).
- **Status review**: `Menunggu Tinjauan` → `Ditinjau` atau `Perlu Tindak Lanjut`.

Tidak ada batas jumlah laporan per hari.

### 5.2 Visibilitas

| Nilai     | Label UI               | Yang bisa melihat dan berkomentar |
| --------- | ---------------------- | --------------------------------- |
| `private` | 🔒 Hanya Kepala OPD    | Pembuat laporan + Kepala OPD      |
| `opd`     | 👥 Seluruh Pegawai OPD | Semua pengguna di OPD yang sama   |

Aturan:

- Default saat membuat laporan: **`private`** (paling aman). Pilihan terakhir pengguna diingat untuk laporan berikutnya.
- Pembuat laporan boleh mengubah visibilitas setelah laporan terbit.
  - `opd` → `private`: komentar dari pegawai lain tetap tersimpan tetapi ikut tersembunyi bagi pegawai lain.
  - `private` → `opd`: seluruh utas komentar (termasuk percakapan dengan Kepala OPD) ikut terlihat. UI **wajib** menampilkan konfirmasi yang menjelaskan hal ini.
- Laporan yang dibuat Kepala OPD selalu `opd`.
- **Aturan emas: siapa pun yang boleh melihat sebuah laporan boleh berkomentar di laporan itu.** Tidak ada kondisi "boleh lihat tapi tidak boleh komentar".

### 5.3 Komentar & Review

- Komentar berupa teks (maksimal 1.000 karakter), dengan balasan satu tingkat (reply ke komentar induk), seperti Instagram.
- Kepala OPD bisa menandai komentarnya sebagai **review** dengan aksi:
  - ✅ **Disetujui/Ditinjau**: status laporan menjadi `reviewed`.
  - ⚠️ **Perlu Tindak Lanjut**: status laporan menjadi `revision`.
- Komentar dari pegawai (termasuk pembuat laporan) **tidak** mengubah status.
- Pembuat laporan bisa membalas review sehingga terjadi komunikasi dua arah.
- Komentar bisa dihapus oleh penulisnya. Kepala OPD bisa menghapus komentar apa pun di OPD-nya (moderasi).

### 5.4 Sukai

- Setiap pengguna yang bisa melihat laporan bisa menekan tombol **Sukai** (ikon hati) satu kali per laporan, dan bisa membatalkannya.
- Jumlah suka ditampilkan sebagai "Disukai N orang".

### 5.5 Nilai Bintang & Halaman Apresiasi

- Kepala OPD bisa memberi **nilai bintang 1–5** pada setiap laporan di OPD-nya. Nilai bisa diubah kapan saja. Pegawai hanya bisa melihat nilai, tidak bisa memberi.
- Halaman **Apresiasi** hanya menampilkan laporan bernilai **4–5 bintang**, diurutkan dari nilai tertinggi lalu yang terbaru. Halaman ini bukan salinan feed Beranda.
- Laporan bernilai 4–5 tetap tampil di Beranda seperti biasa, dengan bintang ditampilkan di kartunya.
- Halaman Apresiasi tetap mengikuti aturan visibilitas §5.2: laporan `private` yang bernilai tinggi hanya tampil bagi pembuatnya dan Kepala OPD.

## 6. Matriks Izin

Simbol: ✅ boleh · ❌ tidak boleh · "Sendiri" = hanya milik sendiri.

| Aksi                                                | Pegawai                        | Kepala OPD                |
| --------------------------------------------------- | ------------------------------ | ------------------------- |
| Melihat laporan sendiri (semua visibilitas)         | ✅                             | ✅                        |
| Melihat laporan `opd` pegawai lain di OPD yang sama | ✅                             | ✅                        |
| Melihat laporan `private` pegawai lain              | ❌                             | ✅                        |
| Melihat laporan OPD lain                            | ❌                             | ❌                        |
| Membuat laporan                                     | ✅                             | ✅ (selalu `opd`)         |
| Mengubah/menghapus laporan                          | Sendiri                        | Sendiri                   |
| Mengubah visibilitas                                | Sendiri                        | —                         |
| Berkomentar                                         | Pada laporan yang bisa dilihat | Pada semua laporan di OPD |
| Memberi review (setujui / perlu tindak lanjut)      | ❌                             | ✅                        |
| Menghapus komentar                                  | Sendiri                        | Semua di OPD              |
| Menyukai laporan                                    | Pada laporan yang bisa dilihat | Pada semua laporan di OPD |
| Memberi nilai bintang 1–5                           | ❌                             | ✅                        |
| Melihat antrean "Perlu Ditinjau"                    | ❌                             | ✅                        |
| Melihat rekap statistik OPD                         | ❌ (hanya statistik sendiri)   | ✅                        |

Matriks ini adalah **sumber kebenaran** untuk otorisasi dan wajib ditegakkan di server (lihat ARCHITECTURE.md §6).

## 7. User Stories

### Pegawai

- **US-01** Sebagai pegawai, saya ingin masuk menggunakan NIP dan kata sandi agar laporan tercatat atas nama saya.
- **US-02** Sebagai pegawai, saya ingin memotret langsung dari kamera atau memilih dari galeri (hingga 5 foto) agar bukti kegiatan lengkap.
- **US-03** Sebagai pegawai, saya ingin memilih apakah laporan hanya untuk Kepala OPD atau untuk seluruh pegawai OPD agar saya bisa mengatur privasi.
- **US-04** Sebagai pegawai, saya ingin membuat beberapa laporan dalam sehari agar semua kegiatan terdokumentasi.
- **US-05** Sebagai pegawai, saya ingin melihat feed berisi laporan saya dan laporan rekan yang dibuka untuk OPD.
- **US-06** Sebagai pegawai, saya ingin membalas komentar Kepala OPD agar bisa menjelaskan atau menindaklanjuti.
- **US-07** Sebagai pegawai, saya ingin mendapat notifikasi saat laporan saya dikomentari, direview, atau diapresiasi.
- **US-08** Sebagai pegawai, saya ingin berkomentar dan memberi apresiasi pada laporan rekan.
- **US-09** Sebagai pegawai, saya ingin melihat profil saya dalam bentuk grid foto beserta statistik kegiatan.
- **US-10** Sebagai pegawai, saya ingin tetap bisa menyusun laporan saat sinyal lemah dan mengirimnya ketika koneksi kembali.

### Kepala OPD

- **US-20** Sebagai Kepala OPD, saya ingin melihat seluruh laporan pegawai di OPD saya dalam satu feed.
- **US-21** Sebagai Kepala OPD, saya ingin daftar laporan yang **belum saya tinjau** agar tidak ada yang terlewat.
- **US-22** Sebagai Kepala OPD, saya ingin memberi komentar biasa atau review (setujui / perlu tindak lanjut).
- **US-23** Sebagai Kepala OPD, saya ingin difilter berdasarkan pegawai, tanggal, jenis kegiatan, dan status.
- **US-24** Sebagai Kepala OPD, saya ingin melihat rekap: jumlah laporan per pegawai, per hari, dan pegawai yang belum melapor hari ini.
- **US-25** Sebagai Kepala OPD, saya ingin mendapat notifikasi saat pegawai membalas komentar saya.

## 8. Kebutuhan Fungsional

### 8.1 Autentikasi

- **FR-AUTH-1** Login dengan NIP (atau username untuk non-ASN) dan kata sandi.
- **FR-AUTH-2** Sesi bertahan 30 hari di perangkat (cookie httpOnly) dan bisa logout.
- **FR-AUTH-3** Pengguna wajib mengganti kata sandi awal saat login pertama.
- **FR-AUTH-4** Akun nonaktif tidak bisa login, dan laporannya tetap tersimpan.
- **FR-AUTH-5** Batasi percobaan login: maksimal 5 kali gagal per 15 menit per NIP/IP.

### 8.2 Feed (Beranda)

- **FR-FEED-1** Menampilkan laporan yang boleh dilihat pengguna (sesuai §6), diurutkan dari yang terbaru (`created_at` desc).
- **FR-FEED-2** Infinite scroll berbasis kursor, 10 laporan per halaman.
- **FR-FEED-3** Setiap kartu menampilkan: avatar, nama, jabatan, waktu relatif, ikon visibilitas, carousel foto, tombol apresiasi dan komentar, jumlah apresiasi, judul tebal + deskripsi terpotong ("selengkapnya"), badge status, jenis kegiatan, lokasi, maksimal 2 komentar terbaru, dan tautan "Lihat semua N komentar".
- **FR-FEED-4** Filter cepat (chip): `Semua` · `Saya` · `Luar Kantor` · `Dalam Kantor`. Khusus Kepala OPD ada tambahan `Perlu Ditinjau`.
- **FR-FEED-5** Pull-to-refresh, ditambah indikator "N laporan baru" saat ada laporan baru (polling).

### 8.3 Membuat & Mengelola Laporan

- **FR-POST-1** Formulir: foto (1–5), judul, deskripsi, jenis kegiatan, tanggal, jam, lokasi, visibilitas.
- **FR-POST-2** Foto dikompres di sisi klien (sisi terpanjang maksimal 1600px, JPEG/WebP sekitar 80%) sebelum diunggah. Ukuran maksimal per file setelah kompresi 2 MB.
- **FR-POST-3** Pemilih visibilitas berupa _segmented control_ yang selalu terlihat (tidak tersembunyi di menu) dengan teks penjelasan singkat.
- **FR-POST-4** Draf tersimpan otomatis di perangkat. Jika offline, laporan masuk antrean kirim dan dikirim otomatis saat online.
- **FR-POST-5** Pembuat laporan bisa mengedit judul, deskripsi, lokasi, jenis, waktu, dan visibilitas. Laporan yang diedit diberi label "diedit".
- **FR-POST-6** Pembuat laporan bisa menghapus laporannya (soft delete) setelah konfirmasi.
- **FR-POST-7** Halaman detail laporan menampilkan seluruh foto, metadata lengkap, dan seluruh utas komentar.

### 8.4 Komentar, Review, Apresiasi

- **FR-CMT-1** Menambah komentar dan balasan satu tingkat.
- **FR-CMT-2** Kepala OPD memiliki toggle/aksi tambahan "Kirim sebagai Review" dengan pilihan ✅ / ⚠️.
- **FR-CMT-3** Komentar review tampil dengan gaya khusus (badge dan latar berbeda).
- **FR-CMT-4** Hapus komentar sesuai §6. Komentar yang dihapus tampil sebagai "Komentar dihapus" jika memiliki balasan.
- **FR-CMT-5** Apresiasi bersifat toggle dengan _optimistic update_.

### 8.5 Notifikasi

- **FR-NTF-1** Notifikasi dalam aplikasi untuk: komentar baru di laporan saya, balasan atas komentar saya, review dari Kepala OPD, dan apresiasi (dikelompokkan: "Andi dan 3 lainnya mengapresiasi…").
- **FR-NTF-2** Kepala OPD mendapat notifikasi saat pegawai membalas komentarnya. Notifikasi untuk setiap laporan baru **tidak** dikirim (diganti badge jumlah di antrean "Perlu Ditinjau").
- **FR-NTF-3** Badge jumlah belum dibaca di navigasi, dan tandai dibaca saat dibuka.
- **FR-NTF-4** (Fase 2) Web Push melalui PWA.

### 8.6 Profil & Statistik

- **FR-PRF-1** Halaman profil: avatar, nama, NIP, jabatan, OPD, serta statistik (total, bulan ini, hari ini, sudah ditinjau, menunggu).
- **FR-PRF-2** Grid foto 3 kolom berisi laporan pengguna tersebut. Bila dilihat orang lain, grid tetap mengikuti aturan visibilitas.
- **FR-PRF-3** Mengubah avatar dan kata sandi.

### 8.7 Dasbor Kepala OPD

- **FR-DSB-1** Antrean "Perlu Ditinjau": laporan berstatus `pending`, yang terlama di atas.
- **FR-DSB-2** Rekap harian: daftar pegawai beserta jumlah laporan hari ini, dengan penanda pegawai yang belum melapor.
- **FR-DSB-3** Rekap periode (minggu/bulan): jumlah laporan per pegawai dan per jenis kegiatan.
- **FR-DSB-4** (Fase 2) Ekspor rekap ke PDF/Excel.

## 9. Kebutuhan Non-Fungsional

| Kategori       | Kebutuhan                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keamanan       | Otorisasi ditegakkan di server, termasuk untuk berkas foto. Foto laporan `private` tidak boleh bisa diakses lewat URL publik. HTTPS wajib. Kata sandi di-hash dengan argon2id/bcrypt. |
| Privasi        | Mematuhi UU No. 27/2022 tentang Pelindungan Data Pribadi. Metadata EXIF (termasuk GPS) dihapus dari foto saat diproses. NIP hanya ditampilkan kepada pengguna di OPD yang sama.       |
| Performa       | Feed pertama tampil < 2,5 detik di jaringan 4G. Thumbnail feed ≤ 150 KB. API p95 < 300 ms untuk feed dan detail.                                                                      |
| Ketersediaan   | Target 99% jam kerja. Backup database harian, backup media mingguan, retensi 30 hari.                                                                                                 |
| Kompatibilitas | Chrome Android 2 versi terakhir dan Safari iOS 16+. Tata letak mobile-first, desktop memakai kolom tengah maksimal 480px.                                                             |
| Aksesibilitas  | Target sentuh minimal 44×44px, kontras teks WCAG AA, teks isi minimal 14px, dan semua ikon tombol memiliki label.                                                                     |
| Bahasa         | Seluruh antarmuka berbahasa Indonesia, dengan format tanggal `id-ID` dan zona waktu WIB (`Asia/Jakarta`) sebagai default per OPD.                                                     |
| Audit          | Pembuatan, perubahan visibilitas, penghapusan laporan, dan review dicatat di log audit.                                                                                               |

## 10. Metrik Keberhasilan

- **Adopsi:** ≥ 80% pegawai aktif membuat minimal 1 laporan per hari kerja dalam 1 bulan setelah peluncuran.
- **Responsivitas pimpinan:** median waktu dari laporan dibuat sampai review pertama Kepala OPD < 24 jam.
- **Komunikasi dua arah:** ≥ 30% laporan yang direview memiliki balasan dari pegawai.
- **Keterlibatan:** rata-rata ≥ 2 apresiasi atau komentar dari rekan pada laporan `opd`.
- **Kualitas:** < 1% unggahan gagal terkirim (termasuk antrean offline).

## 11. Rilis Bertahap

| Fase                    | Cakupan                                                                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fase 0 — Fondasi**    | Backend API + database, autentikasi, multi-OPD, migrasi dari `localStorage`, dan seed data Dinas Perikanan.                                                                      |
| **Fase 1 — MVP Sosial** | Feed bergaya Instagram, buat laporan dengan multi-foto dan visibilitas, komentar dua arah + review, apresiasi, notifikasi dalam aplikasi, profil grid, antrean "Perlu Ditinjau". |
| **Fase 2 — Penguatan**  | PWA + Web Push, antrean offline, rekap dan ekspor PDF/Excel, filter lanjutan, pencarian.                                                                                         |
| **Fase 3 — Integrasi**  | Integrasi e-Kinerja/SKP, peran admin OPD di dalam aplikasi, dan tagar/program kegiatan.                                                                                          |

## 12. Pertanyaan Terbuka

| #   | Pertanyaan                                                                                                     | Asumsi sementara                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Q1  | Siapa yang mengelola akun (tambah/nonaktifkan pegawai, ganti kepala OPD)? Perlu peran admin di dalam aplikasi? | Operator sistem lewat skrip CLI di v1, peran admin di Fase 3.                                  |
| Q2  | Bagaimana jika ada Plt./Plh. Kepala OPD, atau sekretaris yang ikut meninjau?                                   | Hanya satu Kepala OPD aktif. Plt. diperlakukan sebagai Kepala OPD dengan mengganti akun aktif. |
| Q3  | Apakah Kepala OPD perlu melihat laporan OPD lain (misalnya Sekda/Bupati)?                                      | Tidak di v1. Data antar-OPD terisolasi penuh.                                                  |
| Q4  | Apakah laporan yang sudah direview boleh diedit atau dihapus pegawai?                                          | Boleh diedit (dengan label "diedit" dan tercatat di audit). Penghapusan tetap soft delete.     |
| Q5  | Apakah geotag lokasi otomatis diperlukan sebagai bukti kehadiran lapangan?                                     | Tidak di v1, karena EXIF GPS dihapus demi privasi. Bisa ditambahkan sebagai opsi eksplisit.    |
| Q6  | Berapa lama data dan foto disimpan?                                                                            | Selamanya selama akun ada. Kebijakan retensi menunggu ketentuan arsip daerah.                  |
