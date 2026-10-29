import React from 'react';
import { useReports } from '../../context/ReportContext';
import { DEPARTMENT_USERS } from '../../data/seedData';
import { Shield, ArrowUpRight, CheckCircle2, Clock, AlertCircle, Compass, Building, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardSummary() {
  const { reports, totalCount, pendingCount, reviewedCount, luarKantorCount, dalamKantorCount, currentUserRole } = useReports();

  if (currentUserRole !== 'admin') {
    return null;
  }

  const revisionCount = reports.filter(r => r.status === 'revision').length;

  return (
    <div className="mx-3 sm:mx-5 mt-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white shadow-xl ring-1 ring-emerald-900/50 space-y-3.5 sm:space-y-4 relative overflow-hidden">
      {/* Background Subtle Glow & Pattern */}
      <div className="absolute -right-12 -top-12 w-36 h-36 sm:w-48 sm:h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-36 h-36 sm:w-48 sm:h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Ramah Pimpinan */}
      <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3 relative z-10 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center justify-center font-bold shadow-sm">
            <Shield size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white truncate">
                Ringkasan Pimpinan Dinas
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-100 font-medium truncate">
              Dinas Kelautan dan Perikanan
            </p>
          </div>
        </div>
        <Link
          to="/audit-sistem"
          className="shrink-0 group inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-emerald-100 transition-colors bg-white/20 px-3.5 py-1.5 rounded-full border border-white/30 shadow-xs"
        >
          <span>Buka</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid Statistik Utama - Mobile 1-col/3-col responsive */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 relative z-10">
        <div className="bg-black/15 hover:bg-black/25 transition-colors rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-100/70 mb-1 gap-1">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">Arsip</span>
            <Activity size={12} className="text-emerald-200/70 shrink-0" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-white">{totalCount}</span>
        </div>

        <div className="bg-black/15 hover:bg-black/25 transition-colors rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-200/90 mb-1 gap-1">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">Pending</span>
            <Clock size={12} className="text-amber-300 shrink-0" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-amber-200">{pendingCount}</span>
        </div>

        <div className="bg-black/15 hover:bg-black/25 transition-colors rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-200/90 mb-1 gap-1">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">Reviewed</span>
            <CheckCircle2 size={12} className="text-emerald-300 shrink-0" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-emerald-200">{reviewedCount}</span>
        </div>
      </div>

      {/* Breakdown Kategori - Stacking Vertikal di Mobile, Flex Horizontal di Tablet/Desktop */}
      <div className="bg-black/15 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2 text-xs relative z-10 divide-y sm:divide-y-0 divide-emerald-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-white/10 text-emerald-200 flex items-center justify-center">
            <Compass size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-100/70 block font-medium leading-none mb-0.5">Luar Lapangan</span>
            <strong className="text-white font-bold">{luarKantorCount} Kegiatan</strong>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-emerald-700/50"></div>

        <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-white/10 text-emerald-200 flex items-center justify-center">
            <Building size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-100/70 block font-medium leading-none mb-0.5">Dalam Kantor</span>
            <strong className="text-white font-bold">{dalamKantorCount} Kegiatan</strong>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-emerald-700/50"></div>

        <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-white/10 text-emerald-200 flex items-center justify-center">
            <AlertCircle size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-100/70 block font-medium leading-none mb-0.5">Catatan / Revisi</span>
            <strong className="text-white font-bold">{revisionCount} Kasus</strong>
          </div>
        </div>
      </div>

      {/* Ringkasan Jumlah Pegawai Terdaftar */}
      <Link
        to="/audit-sistem"
        className="bg-black/15 hover:bg-black/25 transition-colors rounded-xl sm:rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs relative z-10 block group gap-2"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-white/10 text-emerald-200 flex items-center justify-center">
            <Users size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-100/70 block font-medium leading-none mb-0.5 truncate">Pegawai & Kontributor</span>
            <strong className="text-white font-bold truncate block">{DEPARTMENT_USERS.length} Orang Aktif</strong>
          </div>
        </div>
        <span className="shrink-0 text-[10px] sm:text-[11px] font-semibold text-emerald-200 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Lihat Rekap &rarr;
        </span>
      </Link>
    </div>
  );
}