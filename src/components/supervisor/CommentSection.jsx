import React, { useState } from 'react';
import { MessageSquare, ShieldCheck, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useReports } from '../../context/ReportContext';

export default function CommentSection({ report }) {
  const { addSupervisorComment, currentUserRole } = useReports();
  const comments = report.comments || [];
  
  const [commentText, setCommentText] = useState('');
  const [actionType, setActionType] = useState('approved');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addSupervisorComment(report.id, {
      author: 'Dr. DEDY PALWADI AP. MM',
      role: 'Kepala Dinas Perikanan (Admin)',
      text: commentText,
      action: actionType
    });

    setCommentText('');
    alert('Tanggapan atasan/admin berhasil dikirim!');
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mt-4">
      {/* Header section komentar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <MessageSquare size={16} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Ulasan & Catatan Atasan</h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Tanggapan resmi dari pimpinan/atasan</p>
          </div>
        </div>
      </div>

      {/* Form Input Admin untuk Verifikasi / Tanggapan */}
      {currentUserRole === 'admin' ? (
        <form onSubmit={handleSubmit} className="mt-4 p-3 sm:p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1 min-w-0">
              <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
              <span className="truncate">Panel Tindakan Admin (Kepala Dinas)</span>
            </span>
            <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-semibold self-start sm:self-auto shrink-0">
              Mode Admin Aktif
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Status Verifikasi Laporan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActionType('approved')}
                className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  actionType === 'approved'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 size={14} className="shrink-0" />
                <span className="truncate">Setujui (Approved)</span>
              </button>
              <button
                type="button"
                onClick={() => setActionType('revision')}
                className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  actionType === 'revision'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle size={14} className="shrink-0" />
                <span className="truncate">Catatan / Revisi</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tulis Tanggapan / Evaluasi Atasan
            </label>
            <textarea
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Contoh: Laporan kegiatan sudah sesuai dengan target harian lapangan. Pertahankan!"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Send size={14} className="shrink-0" />
            <span className="truncate">Kirim Tanggapan & Perbarui Status Laporan</span>
          </button>
        </form>
      ) : (
        <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
          <span>💡 Tip: Ingin mencoba memberi tanggapan admin? Beralih ke <strong>Mode Admin</strong> di halaman Profil.</span>
        </div>
      )}

      {/* Daftar Komentar & Catatan dari Atasan */}
      <div className="mt-3 space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-5 px-3 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-medium">Belum ada komentar dari atasan.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Laporan Anda sedang menunggu evaluasi atasan.</p>
          </div>
        ) : (
          comments.map(c => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2 text-xs text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 min-w-0">
                  <ShieldCheck size={15} className="text-emerald-700 shrink-0" />
                  <span className="truncate">{c.author}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{c.date}</span>
              </div>

              <p className="text-slate-800 leading-relaxed font-normal bg-white/70 p-2.5 rounded-lg border border-emerald-100/70 italic">
                "{c.text}"
              </p>

              <div>
                {c.action === 'revision' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} className="shrink-0" />
                    <span>Catatan Evaluasi / Perlu Tindak Lanjut</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} className="shrink-0" />
                    <span>Kegiatan Telah Diverifikasi & Disetujui</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
