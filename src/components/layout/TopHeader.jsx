import React, { useState } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFeed } from '../../hooks/useReports';

export default function TopHeader() {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  // Belum ada endpoint notifikasi: tampilkan komentar terbaru dari orang lain di laporan saya
  const { data } = useFeed('saya');
  const updates = (data?.pages[0]?.items ?? [])
    .map(report => ({ report, comment: report.latest_comments?.at(-1) }))
    .filter(({ comment }) => comment && comment.author?.id !== user.id);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 pt-3 pb-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="" className="w-8 h-11 object-contain shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold text-emerald-900 tracking-tight leading-tight truncate">SI KERANG KAMPAK</h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">{user.opd?.nama_opd ?? 'Kinerja Pegawai'}</p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowNotif(v => !v)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors relative border border-slate-200"
            aria-label="Komentar terbaru"
            aria-expanded={showNotif}
          >
            <Bell size={18} />
            {updates.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
              <p className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">Komentar Terbaru</p>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                {updates.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">Belum ada komentar baru di laporan Anda.</p>
                ) : (
                  updates.map(({ report, comment }) => (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => {
                        setShowNotif(false);
                        navigate(`/kegiatan/${report.id}#komentar`);
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors text-left"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                        <MessageCircle size={14} />
                        {comment.author?.nama}
                      </span>
                      <span className="block text-sm text-slate-700 line-clamp-1 mt-0.5">{report.title}</span>
                      <span className="block text-xs text-slate-500 line-clamp-2 mt-0.5 italic">"{comment.body}"</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
