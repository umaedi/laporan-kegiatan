// Nilai domain yang sama dengan backend SIAPTUBA (modul LaporanKegiatan)

export const ROLE = {
  PEGAWAI: 'pegawai',
  KEPALA_OPD: 'kepala_opd'
};

export const VISIBILITY = {
  PRIVATE: 'private', // hanya pembuat laporan & Kepala OPD
  OPD: 'opd' // seluruh pegawai di OPD yang sama
};

export const VISIBILITY_OPTIONS = [
  { id: VISIBILITY.PRIVATE, label: 'Hanya Kepala Dinas', description: 'Hanya Anda & Kepala Dinas' },
  { id: VISIBILITY.OPD, label: 'Seluruh Pegawai', description: 'Semua pegawai OPD Anda' }
];

export const ACTIVITY_TYPE = {
  LUAR_KANTOR: 'luar_kantor',
  DALAM_KANTOR: 'dalam_kantor'
};

export const REPORT_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  REVISION: 'revision'
};

export const REVIEW_ACTION = {
  APPROVED: 'approved',
  REVISION: 'revision'
};

export const MAX_PHOTOS = 5;

// Laporan boleh diisi untuk kegiatan paling lama sekian hari ke belakang (sama dengan backend)
export const MAX_DAYS_BACK = 7;

// Laporan dengan nilai bintang minimal ini dari Kepala Dinas tampil di halaman Apresiasi
export const APPRECIATION_MIN_RATING = 4;
