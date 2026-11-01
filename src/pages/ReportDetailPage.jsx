import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, Trash2, Waves, Building2, Heart } from 'lucide-react';
import { useDeleteReport, useReport, useToggleLike } from '../hooks/useReports';
import { ACTIVITY_TYPE, APPRECIATION_MIN_RATING } from '../shared/enums';
import CommentSection from '../components/comment/CommentSection';
import PhotoCarousel from '../components/post/PhotoCarousel';
import StatusBadge from '../components/post/StatusBadge';
import StarRating from '../components/post/StarRating';
import VisibilityBadge from '../components/post/VisibilityBadge';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: report, isPending, isError, error, refetch } = useReport(id);
  const deleteReport = useDeleteReport();
  const toggleLike = useToggleLike();

  // Tombol "Komentar" di beranda membuka halaman ini dengan #komentar
  useEffect(() => {
    if (report && location.hash === '#komentar') {
      document.getElementById('komentar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [report, location.hash]);

  if (isPending) return <LoadingState label="Memuat laporan…" />;

  if (isError) {
    // 404 juga dipakai server untuk laporan yang tidak boleh dilihat
    return error.status === 404 ? (
      <div className="flex flex-col flex-1 items-center justify-center p-8 text-center">
        <p className="text-base font-bold text-slate-900">Laporan tidak ditemukan</p>
        <p className="text-sm text-slate-500 mt-1">Laporan mungkin sudah dihapus atau tidak dibagikan kepada Anda.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 h-11 px-5 bg-emerald-700 text-white rounded-xl text-sm font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    ) : (
      <ErrorState error={error} onRetry={refetch} />
    );
  }

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan kegiatan ini?')) {
      deleteReport.mutate(report.id, { onSuccess: () => navigate('/', { replace: true }) });
    }
  };

  const activityDate = new Date(report.activity_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const isDalamKantor = report.activity_type === ACTIVITY_TYPE.DALAM_KANTOR;

  return (
    <div className="flex flex-col flex-1 pb-12 px-4 pt-3 gap-3">
      {/* Navigasi & aksi pembuat */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        {report.permissions.can_delete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteReport.isPending}
            aria-label="Hapus laporan"
            className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      {deleteReport.isError && (
        <p role="alert" className="text-sm text-red-700">{deleteReport.error.message}</p>
      )}

      <article className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <PhotoCarousel photos={report.photos} alt={report.title} />

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={report.status} />
            <VisibilityBadge visibility={report.visibility} />
          </div>

          <h1 className="text-lg font-extrabold text-slate-900 leading-snug">{report.title}</h1>

          <ul className="space-y-1.5 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <User size={16} className="text-emerald-700 shrink-0" />
              {report.author?.nama}
              {report.author?.jabatan && <span className="text-slate-500">· {report.author.jabatan}</span>}
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-700 shrink-0" />
              {activityDate}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-700 shrink-0" />
              {report.activity_time} WIB
            </li>
            <li className="flex items-center gap-2">
              {isDalamKantor ? (
                <Building2 size={16} className="text-emerald-700 shrink-0" />
              ) : (
                <Waves size={16} className="text-emerald-700 shrink-0" />
              )}
              {isDalamKantor ? 'Dalam Kantor' : 'Luar Kantor'}
            </li>
            {report.location && (
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-700 shrink-0" />
                {report.location}
              </li>
            )}
          </ul>

          {report.description && (
            <p className="text-sm text-slate-700 leading-6 whitespace-pre-wrap bg-slate-50 rounded-xl p-3">
              {report.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => toggleLike.mutate({ id: report.id, liked: report.liked_by_me })}
              aria-pressed={report.liked_by_me}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white transition-colors ${
                report.liked_by_me ? 'bg-teal-900 hover:bg-teal-950' : 'bg-teal-700 hover:bg-teal-800'
              }`}
            >
              <Heart size={18} fill={report.liked_by_me ? 'currentColor' : 'none'} />
              {report.liked_by_me ? 'Disukai' : 'Sukai'}
            </button>
            {report.like_count > 0 && (
              <span className="text-sm font-semibold text-slate-700">
                Disukai {report.like_count.toLocaleString('id-ID')} orang
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Nilai bintang dari Kepala Dinas */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-1.5">Penilaian Kepala Dinas</h2>
        {report.rating > 0 ? (
          <StarRating value={report.rating} size={20} />
        ) : (
          <p className="text-sm text-slate-500">Belum dinilai.</p>
        )}
        {report.rating >= APPRECIATION_MIN_RATING && (
          <p className="text-xs text-emerald-700 font-semibold mt-1.5">Kegiatan terbaik pilihan Kepala Dinas</p>
        )}
      </section>

      <div id="komentar" className="scroll-mt-20">
        <CommentSection report={report} />
      </div>
    </div>
  );
}
