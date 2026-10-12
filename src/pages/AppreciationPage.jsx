import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function AppreciationPage() {
  const { reports } = useReports();
  const [filterAction, setFilterAction] = useState('all');

  // Ambil semua laporan yang telah memiliki komentar atau apresiasi dari atasan
  const appreciatedReports = reports.filter(r => r.comments && r.comments.length > 0);

  // Kumpulkan seluruh item komentar dengan referensi laporan
  const allComments = appreciatedReports.flatMap(r => 
    r.comments.map(c => ({
      ...c,
      reportId: r.id,
      reportTitle: r.title,
      reportDate: r.date,
      reportPhoto: r.photo
    }))
  );

  const filteredComments = allComments.filter(item => {
    if (filterAction === 'approved') return item.action === 'approved';
    if (filterAction === 'revision') return item.action === 'revision';
    return true;
  });

  return (
    <div className="flex flex-col flex-1 pb-12 px-5 pt-3">
      {/* Header Halaman Apresiasi */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white rounded-2xl p-4 shadow-sm mb-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Award size={18} className="text-yellow-300" />
            </div>
            <h2 className="text-base font-extrabold tracking-tight">
              Apresiasi & Ulasan
            </h2>
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Daftar feedback positif dan persetujuan tugas dari atasan.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterAction('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${
              filterAction === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Semua ({allComments.length})
          </button>
          <button
            onClick={() => setFilterAction('approved')}
            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${
              filterAction === 'approved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Disetujui
          </button>
        </div>

      </div>

      {/* Daftar Apresiasi dari Atasan */}
      {filteredComments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 mt-2">
          <Sparkles size={32} className="text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Belum ada apresiasi.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Laporan yang Anda kirim akan segera ditinjau dan dikomentari oleh atasan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-emerald-200 transition-all text-left"
            >
              {/* Header Komentar: Nama Atasan & Tanggal */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800 block leading-tight">
                      {item.author}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {item.role || 'Atasan Lapangan'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  {item.date}
                </span>
              </div>

              {/* Kutipan Komentar Apresiasi */}
              <div className="py-2.5">
                <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/70">
                  <MessageSquare size={15} className="text-emerald-700 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-slate-800 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>
              </div>

              {/* Tautan ke Laporan Kegiatan yang Diapresiasi */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-50">
                <div className="flex items-center gap-2 truncate pr-2">
                  {item.reportPhoto && (
                    <img
                      src={item.reportPhoto}
                      alt="Thumbnail"
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                  )}
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">Untuk kegiatan:</span>
                    <span className="font-bold text-slate-800 truncate block text-[11px]">
                      {item.reportTitle}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/kegiatan/${item.reportId}`}
                  className="shrink-0 flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold text-xs py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <span>Buka</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
