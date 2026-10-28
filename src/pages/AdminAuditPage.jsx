import React from 'react';
import { useReports } from '../context/ReportContext';
import { DEPARTMENT_USERS } from '../data/seedData';
import ReportCard from '../components/report/ReportCard';
import { Users, FileCheck, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminAuditPage() {
  const { reports, totalCount, reviewedCount } = useReports();
  const navigate = useNavigate();

  const revisionReports = reports.filter(r => r.status === 'revision');
  const pendingReports = reports.filter(r => r.status === 'pending' || !r.comments || r.comments.length === 0);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `laporan_audit_dinas_perikanan_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col flex-1 pb-12 px-5 pt-3">
      {/* Header Halaman Audit */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Audit & Verifikasi Pimpinan
            </h2>
            <p className="text-[11px] text-slate-500">
              Pusat Kendali & Peninjauan Kinerja Pegawai
            </p>
          </div>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          title="Ekspor Laporan"
        >
          <Download size={14} />
          Ekspor
        </button>
      </div>

      {/* Ringkasan Status Audit */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 block font-medium">Total Arsip</span>
          <strong className="text-lg font-black text-slate-800">{totalCount}</strong>
        </div>
        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 shadow-xs text-center">
          <span className="text-[10px] text-amber-600 block font-medium">Pending Review</span>
          <strong className="text-lg font-black text-amber-700">{pendingReports.length}</strong>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shadow-xs text-center">
          <span className="text-[10px] text-emerald-600 block font-medium">Disetujui</span>
          <strong className="text-lg font-black text-emerald-700">{reviewedCount}</strong>
        </div>
      </div>
      {/* Seksion 1: Daftar Pegawai & Aktivitas */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Users size={14} className="text-emerald-700" />
            Rekapitulasi Kinerja Pegawai ({DEPARTMENT_USERS.length})
          </h3>
        </div>

        <div className="space-y-2">
          {DEPARTMENT_USERS.map(user => {
            const userReports = reports.filter(r => r.reporterName === user.name);
            const userReviewed = userReports.filter(r => r.status === 'reviewed').length;

            return (
              <div key={user.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {user.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{user.name}</h4>
                    <p className="text-[10px] text-slate-500">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800 text-xs block">{userReports.length} Kegiatan</span>
                  <span className="text-[10px] text-slate-400">{userReviewed} disetujui</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seksion 2: Laporan Perlu Perhatian / Pending / Revisi */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <FileCheck size={14} className="text-emerald-700" />
            Laporan Memerlukan Perhatian ({pendingReports.length + revisionReports.length})
          </h3>
        </div>

        {[...pendingReports, ...revisionReports].length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-2" />
            <p className="text-xs font-bold text-slate-800">Semua laporan telah ditinjau dengan baik!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Tidak ada laporan yang tertunda.</p>
          </div>
        ) : (
          [...pendingReports, ...revisionReports].map(report => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </div>
  );
}