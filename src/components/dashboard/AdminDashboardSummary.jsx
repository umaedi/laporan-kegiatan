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
    <div className="mx-5 mt-4 p-5 rounded-3xl bg-slate-900 text-white shadow-xl ring-1 ring-slate-800 space-y-4 relative overflow-hidden">
      {/* Background Subtle Glow & Pattern */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Minimalis Modern */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Shield size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pusat Kontrol Pimpinan
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Dinas Kelautan dan Perikanan
            </p>
          </div>
        </div>
        <Link
          to="/audit-sistem"
          className="group inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
        >
          <span>Audit Sistem</span>
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid Statistik Utama - Style Neo-Modern Clean */}
      <div className="grid grid-cols-3 gap-2.5 relative z-10">
        <div className="bg-slate-800/60 hover:bg-slate-800 transition-colors rounded-2xl p-3 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">Total Arsip</span>
            <Activity size={13} className="text-slate-500" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">{totalCount}</span>
        </div>

        <div className="bg-amber-500/10 hover:bg-amber-500/15 transition-colors rounded-2xl p-3 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400/80 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">Pending</span>
            <Clock size={13} className="text-amber-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-amber-300">{pendingCount}</span>
        </div>

        <div className="bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors rounded-2xl p-3 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400/80 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">Reviewed</span>
            <CheckCircle2 size={13} className="text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-emerald-300">{reviewedCount}</span>
        </div>
      </div>

      {/* Breakdown Kategori Modern Line */}
      <div className="bg-slate-800/40 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Compass size={14} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Luar Lapangan</span>
            <strong className="text-slate-200 font-bold">{luarKantorCount} Kegiatan</strong>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-700/60"></div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Building size={14} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Dalam Kantor</span>
            <strong className="text-slate-200 font-bold">{dalamKantorCount} Kegiatan</strong>
          </div>
        </div>

        <div className="w-px h-8 bg-slate-700/60"></div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertCircle size={14} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Catatan / Revisi</span>
            <strong className="text-slate-200 font-bold">{revisionCount} Kasus</strong>
          </div>
        </div>
      </div>
      {/* Ringkasan Jumlah Pegawai Terdaftar (Clean Action Banner) */}
      <Link
        to="/audit-sistem"
        className="bg-slate-800/40 hover:bg-slate-800 transition-colors rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs relative z-10 block group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Users size={14} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Pegawai & Kontributor</span>
            <strong className="text-slate-200 font-bold">{DEPARTMENT_USERS.length} Orang Aktif</strong>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Lihat Rekap &rarr;
        </span>
      </Link>
    </div>
  );
}