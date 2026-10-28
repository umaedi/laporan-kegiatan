// Seed data untuk Laporan Kegiatan Pegawai Dinas Perikanan

export const ACTIVITY_TYPES = [
  { id: 'luar_kantor', label: 'Luar Kantor (Lapangan)', icon: '🌊' },
  { id: 'dalam_kantor', label: 'Dalam Kantor (Internal)', icon: '🏢' }
];

// Daftar Pegawai di Lingkungan Dinas Perikanan
export const DEPARTMENT_USERS = [
  {
    id: 'u-1',
    name: 'Bayu Pratama, S.Pi.',
    nip: '19930415 202012 1 002',
    role: 'Pengawas Perikanan / Pelaksana Teknis',
    initials: 'BP',
    division: 'Bidang Perikanan Budidaya & Tangkap'
  },
  {
    id: 'u-2',
    name: 'Siti Rahmawati, S.Kel.',
    nip: '19950822 202203 2 001',
    role: 'Penyuluh Perikanan Lapangan',
    initials: 'SR',
    division: 'Seksi Penyuluhan & Pemberdayaan Nelayan'
  },
  {
    id: 'u-3',
    name: 'Ahmad Fauzi, A.Md.',
    nip: '19911204 201903 1 003',
    role: 'Teknisi Laboratorium Kualitas Air',
    initials: 'AF',
    division: 'Unit Pelaksana Teknis Laboratorium Hama & Penyakit Ikan'
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'LAP-DKP-001',
    title: 'Monitoring Kualitas Air & Sampling Benih Ikan Nila Bioflok Pokdakan Mina Sejahtera',
    activityType: 'luar_kantor', // 'luar_kantor' | 'dalam_kantor'
    date: '2026-10-12',
    time: '08:30',
    reporterName: 'Bayu Pratama, S.Pi.',
    reporterNip: '19930415 202012 1 002',
    location: 'Pokdakan Mina Sejahtera, Desa Karanganyar',
    description: 'Melakukan pengukuran parameter kualitas air (pH: 7.2, Suhu: 28°C, DO: 5.4 ppm) pada 8 unit kolam bioflok ikan nila. Pertumbuhan bobot rata-rata ikan mencapai 120 gram/ekor dengan tingkat kelulushidupan (SR) 92%. Diberikan rekomendasi pemeliharaan flok dan pergantian aerasi berkala.',
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    status: 'reviewed',
    comments: [
      {
        id: 'c-1',
        author: 'Dr. DEDY PALWADI AP. MM',
        role: 'Kepala Dinas Perikanan',
        date: '2026-10-12 09:40',
        text: 'Laporan pemantauan lapangan sangat baik dan komprehensif. Terus dampingi kelompok pembudidaya dan pastikan bantuan pakan termonitor dengan akurat.',
        action: 'approved'
      }
    ],
    createdAt: new Date('2026-10-12T08:30:00').toISOString()
  },
  {
    id: 'LAP-DKP-002',
    title: 'Rapat Koordinasi Persiapan Penyaluran Bantuan Mesin Tempel Nelayan TA 2026',
    activityType: 'dalam_kantor',
    date: '2026-10-12',
    time: '10:00',
    reporterName: 'Bayu Pratama, S.Pi.',
    reporterNip: '19930415 202012 1 002',
    location: 'Ruang Rapat Utama Lt. 2 Dinas Perikanan',
    description: 'Menghadiri rapat pembahasan data Calon Petani Calon Lokasi (CPCL) penerima bantuan hibah 15 unit mesin perahu tempel 15 PK. Telah diverifikasi 3 koperasi nelayan yang memenuhi syarat administrasi Kusuka dan kelengkapan berkas legalitas perahu.',
    photo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    comments: [],
    createdAt: new Date('2026-10-12T10:00:00').toISOString()
  },
  {
    id: 'LAP-DKP-003',
    title: 'Pendampingan Sertifikasi Cara Budidaya Ikan Yang Baik (CBIB) di Tambak Udang',
    activityType: 'luar_kantor',
    date: '2026-10-11',
    time: '09:00',
    reporterName: 'Siti Rahmawati, S.Kel.',
    reporterNip: '19950822 202203 2 001',
    location: 'Kawasan Tambak Pesisir Pantai Timur',
    description: 'Melakukan pendampingan audit CBIB pada 2 kelompok petambak udang vaname. Pemeriksaan meliputi manajemen limbah pakan, biosecurity kawasan, serta pencatatan buku harian tambak.',
    photo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    status: 'reviewed',
    comments: [
      {
        id: 'c-2',
        author: 'Dr. DEDY PALWADI AP. MM',
        role: 'Kepala Dinas Perikanan',
        date: '2026-10-11 14:20',
        text: 'Siti Rahmawati, laporan pendampingan sangat teliti. Segera proses penerbitan sertifikat CBIB bagi kelompok yang lolos audit.',
        action: 'approved'
      }
    ],
    createdAt: new Date('2026-10-11T09:00:00').toISOString()
  },
  {
    id: 'LAP-DKP-004',
    title: 'Verifikasi Berkas Permohonan Surat Rekomendasi Pembelian BBM Bersubsidi Nelayan',
    activityType: 'dalam_kantor',
    date: '2026-10-09',
    time: '13:30',
    reporterName: 'Bayu Pratama, S.Pi.',
    reporterNip: '19930415 202012 1 002',
    location: 'Loket Pelayanan Terpadu Satu Pintu (PTSP) DKP',
    description: 'Melayani dan memverifikasi 12 berkas permohonan rekomendasi solar bersubsidi untuk kapal motor berukuran di bawah 10 GT. Seluruh dokumen BPKP, Pas Kecil, dan Surat Tanda Bukti Lapor Nelayan telah divalidasi keabsahannya.',
    photo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    status: 'reviewed',
    comments: [
      {
        id: 'c-3',
        author: 'Dr. DEDY PALWADI AP. MM',
        role: 'Kepala Dinas Perikanan',
        date: '2026-10-09 15:00',
        text: 'Pelayanan berkas izin dan rekomendasi berjalan cepat dan tertib. Surat rekomendasi telah saya tandatangani.',
        action: 'approved'
      }
    ],
    createdAt: new Date('2026-10-09T13:30:00').toISOString()
  },
  {
    id: 'LAP-DKP-005',
    title: 'Pengujian Sampel Air & Uji Laboratorium Patogen Udang Vaname',
    activityType: 'dalam_kantor',
    date: '2026-10-08',
    time: '11:00',
    reporterName: 'Ahmad Fauzi, A.Md.',
    reporterNip: '19911204 201903 1 003',
    location: 'Laboratorium Pengujian Mutu DKP',
    description: 'Melaksanakan analisis PCR sampel udang dari petambak Desa Sukamakmur untuk deteksi dini virus WSSV dan IMNV. Hasil pengujian menunjukkan negatif pada 4 sampel kolam yang diuji.',
    photo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    comments: [],
    createdAt: new Date('2026-10-08T11:00:00').toISOString()
  }
];
