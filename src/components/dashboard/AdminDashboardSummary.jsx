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
    <div className="mx-3 sm:mx-5 mt-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900 text-white shadow-xl ring-1 ring-slate-800 space-y-3 sm:space-y-4 relative overflow-hidden">
      {/* Background Subtle Glow & Pattern */}
      <div className="absolute -right-12 -top-12 w-36 h-36 sm:w-48 sm:h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-36 h-36 sm:w-48 sm:h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Minimalis Modern */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Shield size={16} className="sm:hidden" />
            <Shield size={18} className="hidden sm:block" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200 truncate">
                Kontrol Pimpinan
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
              Dinas Kelautan dan Perikanan
            </p>
          </div>
        </div>
        <Link
          to="/audit-sistem"
          className="shrink-0 group inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-500/20"
        >
          <span>Audit</span>
          <ArrowUpRight size={12} className="sm:hidden group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <ArrowUpRight size={13} className="hidden sm:block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid Statistik Utama - Mobile 1-col/3-col responsive */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 relative z-10">
        <div className="bg-slate-800/60 hover:bg-slate-800 transition-colors rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1 gap-1">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">Arsip</span>
            <Activity size={12} className="text-slate-500 shrink-0" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-white">{totalCount}</span>
        </div>

        <div className="bg-amber-500/10 hover:bg-amber-500/15 transition-colors rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400/80 mb-1 gap-1">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">Pending</span>
            <Clock size={12} className="text-amber-400 shrink-0" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-amber-300">{pendingCount}</span>
        </div>

        <div className="bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400/80 mb-1 gap-1">
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate">Reviewed</span>
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-emerald-300">{reviewedCount}</span>
        </div>
      </div>

      {/* Breakdown Kategori - Stacking Vertikal di Mobile, Flex Horizontal di Tablet/Desktop */}
      <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2 text-xs relative z-10 divide-y sm:divide-y-0 divide-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Compass size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block font-medium leading-none mb-0.5">Luar Lapangan</span>
            <strong className="text-slate-200 font-bold">{luarKantorCount} Kegiatan</strong>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-700/60"></div>

        <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Building size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block font-medium leading-none mb-0.5">Dalam Kantor</span>
            <strong className="text-slate-200 font-bold">{dalamKantorCount} Kegiatan</strong>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-700/60"></div>

        <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertCircle size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block font-medium leading-none mb-0.5">Catatan / Revisi</span>
            <strong className="text-slate-200 font-bold">{revisionCount} Kasus</strong>
          </div>
        </div>
      </div>

      {/* Ringkasan Jumlah Pegawai Terdaftar */}
      <Link
        to="/audit-sistem"
        className="bg-slate-800/40 hover:bg-slate-800 transition-colors rounded-xl sm:rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs relative z-10 block group gap-2"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Users size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block font-medium leading-none mb-0.5 truncate">Pegawai & Kontributor</span>
            <strong className="text-slate-200 font-bold truncate block">{DEPARTMENT_USERS.length} Orang Aktif</strong>
          </div>
        </div>
        <span className="shrink-0 text-[10px] sm:text-[11px] font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Lihat Rekap &rarr;
        </span>
      </Link>
    </div>
  );
}