import React, { useState } from 'react';
import { Bell, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';

export default function TopHeader() {
  const { pendingCount, reports } = useReports();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const navigate = useNavigate();

  // Ambil laporan yang baru saja dikomentari oleh atasan
  const commentedReports = reports.filter(r => r.comments && r.comments.length > 0);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 pt-3 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-900 tracking-tight leading-tight">
            Dinas Perikanan
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Laporan Kegiatan Pegawai
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifikasi Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifModal(!showNotifModal)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors relative border border-slate-200"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              {commentedReports.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Dropdown Notifikasi */}
            {showNotifModal && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Notifikasi Masuk</span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {commentedReports.length} update
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {commentedReports.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Belum ada komentar baru dari atasan.</p>
                  ) : (
                    commentedReports.slice(0, 4).map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setShowNotifModal(false);
                          navigate(`/kegiatan/${r.id}`);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Atasan mengomentari laporan</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-medium">{r.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic">
                          "{r.comments[r.comments.length - 1]?.text}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
