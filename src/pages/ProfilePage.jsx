import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import { User, Shield, RefreshCw, CheckCircle2, FileText, Phone, MapPin, Waves, Building2, UserCog, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { totalCount, reviewedCount, luarKantorCount, dalamKantorCount, resetToDefault, currentUserRole, toggleUserRole } = useReports();
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm('Kembalikan semua data ke contoh awal (data demo Dinas Perikanan)?')) {
      resetToDefault();
      alert('Data berhasil direset ke contoh awal Dinas Perikanan!');
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-12 px-5 pt-3">
      {/* Profil Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs text-center relative overflow-hidden mb-4">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${currentUserRole === 'admin' ? 'from-amber-700 to-emerald-700' : 'from-emerald-800 to-teal-600'} text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-md mb-2`}>
          {currentUserRole === 'admin' ? 'DP' : 'BP'}
        </div>
        <h2 className="text-base font-extrabold text-slate-900">
          {currentUserRole === 'admin' ? 'Dr. Dedy Palwadi Ap. Mm' : 'Bayu Pratama, S.Pi.'}
        </h2>
        <p className="text-xs text-emerald-700 font-semibold mt-0.5">
          {currentUserRole === 'admin' ? 'Kepala Dinas Perikanan (Administrator)' : 'Pengawas Perikanan / Pelaksana Teknis'}
        </p>
        <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono">
          {currentUserRole === 'admin' ? 'NIP: 19720819 199803 1 005' : 'NIP: 19930415 202012 1 002'}
        </span>

        {/* Panel Switch Role Admin / Pegawai */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserCog size={15} className="text-emerald-700" />
              Simulasi Ganti Role Akses
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${currentUserRole === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {currentUserRole === 'admin' ? 'Role: ADMIN' : 'Role: PEGAWAI'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2.5">
            Ubah mode untuk menguji tampilan & fitur sebagai Pegawai (buat laporan) atau Admin/Atasan (verifikasi & beri komentar).
          </p>
          <button
            onClick={toggleUserRole}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
              currentUserRole === 'admin'
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Shield size={14} />
            {currentUserRole === 'admin' ? 'Beralih ke Mode Pegawai' : 'Beralih ke Mode Admin (Kepala Dinas)'}
          </button>

          {/* Tombol Logout ke Halaman Login */}
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-2.5 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer border border-red-200"
          >
            <LogOut size={14} />
            <span>Keluar / Ganti Akun (Logout)</span>
          </button>
        </div>

        {/* Statistik Pelaporan Pegawai */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-left text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-medium">Total Laporan</span>
            <span className="text-base font-bold text-slate-800">{totalCount} Kegiatan</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <span className="text-[10px] text-emerald-600 block font-medium">Disetujui Atasan</span>
            <span className="text-base font-bold text-emerald-800">{reviewedCount} Laporan</span>
          </div>
        </div>

        {/* Breakdown Luar vs Dalam Kantor */}
        <div className="grid grid-cols-2 gap-2 mt-2 text-left text-xs">
          <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-1.5">
            <Waves size={14} className="text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">Luar Kantor</span>
              <strong className="text-xs text-emerald-800">{luarKantorCount} Kegiatan</strong>
            </div>
          </div>
          <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-1.5">
            <Building2 size={14} className="text-blue-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">Dalam Kantor</span>
              <strong className="text-xs text-blue-800">{dalamKantorCount} Kegiatan</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Unit Kerja Dinas Perikanan */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2 mb-4 text-xs">
        <h3 className="font-bold text-slate-900 mb-1">Informasi Unit Kerja Pegawai</h3>

        <div className="flex items-center justify-between py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium">Instansi</span>
          <span className="font-bold text-slate-800">Dinas Kelautan dan Perikanan</span>
        </div>

        <div className="flex items-center justify-between py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium">Bidang Tugas</span>
          <span className="font-bold text-slate-800">Bidang Perikanan Budidaya & Tangkap</span>
        </div>

        <div className="flex items-center justify-between py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium">Wilayah Pantauan</span>
          <span className="font-bold text-slate-800">Sentra Tambak & Pesisir Dermaga TPI</span>
        </div>

        <div className="flex items-center justify-between py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium">Kepala Dinas</span>
          <span className="font-bold text-emerald-800">Dr. DEDY PALWADI AP. MM</span>
        </div>
      </div>

      {/* Reset Data Demo */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs text-xs space-y-2">
        <h3 className="font-bold text-slate-900">Pengaturan Data & Sampel</h3>
        <p className="text-[11px] text-slate-500">
          Kembalikan data ke contoh awal kegiatan Dinas Perikanan (data simulasi).
        </p>
        <button
          onClick={handleReset}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
        >
          <RefreshCw size={14} />
          Reset Data Contoh Dinas Perikanan
        </button>
      </div>

      <div className="mt-6 text-center text-[11px] text-slate-400">
        SiLapor Perikanan Mobile • Versi 1.1.0
      </div>
    </div>
  );
}
