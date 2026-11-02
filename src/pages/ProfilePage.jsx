import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Lock, LayoutDashboard, ChevronRight, LogOut, ImageOff, Download, Share } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../hooks/useReports';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import UserAvatar from '../components/ui/UserAvatar';
import { ROLE, VISIBILITY } from '../shared/enums';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import LoadMore from '../components/ui/LoadMore';
import AuthImage from '../components/ui/AuthImage';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { canInstall, install, installed, isIos } = useInstallPrompt();
  const { data, isPending, isError, error, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useFeed('saya');

  const reports = data?.pages.flatMap(page => page.items) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

  return (
    <div className="flex flex-col flex-1 pb-12">
      {/* Identitas pegawai */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Avatar = foto wajah terbaru (presensi); inisial bila belum ada */}
          <UserAvatar user={user} className="w-20 h-20 text-2xl shadow-md" />
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-slate-900 truncate">{user.nama}</h2>
            {user.jabatan && <p className="text-sm text-emerald-700 font-semibold truncate">{user.jabatan}</p>}
            {user.nip && <p className="text-xs text-slate-500 font-mono mt-0.5">NIP {user.nip}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-xs text-slate-500 block">Total Laporan</span>
            <span className="text-lg font-bold text-slate-900">{isPending ? '…' : total}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl min-w-0">
            <span className="text-xs text-slate-500 block">OPD</span>
            <span className="text-sm font-bold text-slate-900 line-clamp-2">{user.opd?.nama_opd ?? '-'}</span>
          </div>
        </div>

        {user.kepala_opd && user.role !== ROLE.KEPALA_OPD && (
          <p className="text-sm text-slate-600 mt-3">
            Kepala OPD: <span className="font-semibold text-emerald-800">{user.kepala_opd.nama}</span>
          </p>
        )}

        {/* Akses Panel Kepala Dinas: hanya untuk Kepala Dinas */}
        {user.role === ROLE.KEPALA_OPD && (
          <Link
            to="/admin"
            className="flex items-center gap-3 bg-emerald-900 text-white rounded-2xl p-4 mt-4 hover:bg-emerald-950 transition-colors"
          >
            <LayoutDashboard size={22} className="text-emerald-200 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold">Panel Kepala Dinas</p>
              <p className="text-xs text-emerald-200">Tinjau, nilai, dan rekap laporan pegawai</p>
            </div>
            <ChevronRight size={20} className="text-emerald-200 shrink-0" />
          </Link>
        )}

        {/* Pasang sebagai aplikasi (PWA) */}
        {!installed && canInstall && (
          <button
            type="button"
            onClick={install}
            className="w-full flex items-center gap-3 bg-blue-700 text-white rounded-2xl p-4 mt-4 hover:bg-blue-800 transition-colors text-left"
          >
            <Download size={22} className="text-blue-100 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold">Pasang Aplikasi</p>
              <p className="text-xs text-blue-100">Buka SI KERANG KAMPAK langsung dari layar utama</p>
            </div>
          </button>
        )}
        {!installed && !canInstall && isIos && (
          <div className="flex items-start gap-3 bg-blue-50 text-blue-900 rounded-2xl p-4 mt-4">
            <Share size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs">
              Untuk memasang aplikasi, ketuk tombol <span className="font-semibold">Bagikan</span> di Safari lalu pilih{' '}
              <span className="font-semibold">Tambah ke Layar Utama</span>.
            </p>
          </div>
        )}
      </div>

      {/* Grid laporan saya ala Instagram */}
      {isPending ? (
        <LoadingState label="Memuat laporan Anda…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : reports.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-12">Anda belum membuat laporan kegiatan.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-0.5 mt-0.5">
            {reports.map(report => {
              const cover = report.photos[0];
              return (
                <Link key={report.id} to={`/kegiatan/${report.id}`} className="relative aspect-square bg-slate-100" aria-label={report.title}>
                  {cover ? (
                    <AuthImage src={cover.url} alt={report.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageOff size={20} />
                    </div>
                  )}
                  <span className="absolute top-1.5 right-1.5 flex gap-1 text-white drop-shadow">
                    {report.photos.length > 1 && <Copy size={14} aria-label="Beberapa foto" />}
                    {report.visibility === VISIBILITY.PRIVATE && <Lock size={14} aria-label="Hanya Kepala Dinas" />}
                  </span>
                </Link>
              );
            })}
          </div>
          <LoadMore hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
        </>
      )}

      <div className="px-4 mt-6">
        <button
          type="button"
          onClick={logout}
          className="w-full h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
        <p className="mt-6 text-center text-xs text-slate-400">SiLapor • Versi 1.2.0</p>
      </div>
    </div>
  );
}
