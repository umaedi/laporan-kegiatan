import React from 'react';
import { MessageSquare, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CommentSection({ report }) {
  const comments = report.comments || [];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mt-4">
      {/* Header section komentar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ulasan & Catatan Atasan</h3>
            <p className="text-[11px] text-slate-500">Tanggapan resmi dari pimpinan/atasan</p>
          </div>
        </div>
      </div>

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck size={15} className="text-emerald-700" />
                  <span>{c.author}</span>
                </div>
                <span className="text-[10px] text-slate-400">{c.date}</span>
              </div>

              <p className="text-slate-800 leading-relaxed font-normal bg-white/70 p-2.5 rounded-lg border border-emerald-100/70 italic">
                "{c.text}"
              </p>

              <div>
                {c.action === 'revision' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} />
                    Catatan Evaluasi / Perlu Tindak Lanjut
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} />
                    Kegiatan Telah Diverifikasi & Disetujui
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
