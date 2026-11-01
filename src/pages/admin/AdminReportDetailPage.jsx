import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Waves, Building2 } from 'lucide-react';
import { useRateReport, useReport } from '../../hooks/useReports';
import { ACTIVITY_TYPE } from '../../shared/enums';
import PhotoCarousel from '../../components/post/PhotoCarousel';
import StatusBadge from '../../components/post/StatusBadge';
import StarRating from '../../components/post/StarRating';
import VisibilityBadge from '../../components/post/VisibilityBadge';
import CommentSection from '../../components/comment/CommentSection';
import ReviewForm from '../../components/admin/ReviewForm';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: report, isPending, isError, error, refetch } = useReport(id);
  const rateReport = useRateReport(id);

  if (isPending) return <LoadingState label="Memuat laporan…" />;

  if (isError) {
    return error.status === 404 ? (
      <div className="flex flex-col flex-1 items-center justify-center p-8 text-center">
        <p className="text-base font-bold text-slate-900">Laporan tidak ditemukan</p>
        <button
          type="button"
          onClick={() => navigate('/admin/laporan')}
          className="mt-4 h-11 px-5 rounded-xl bg-emerald-700 text-white text-sm font-semibold"
        >
          Kembali ke Semua Laporan
        </button>
      </div>
    ) : (
      <ErrorState error={error} onRetry={refetch} />
    );
  }

  const activityDate = new Date(report.activity_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const isDalamKantor = report.activity_type === ACTIVITY_TYPE.DALAM_KANTOR;

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="self-start inline-flex items-center gap-1.5 h-9 px-3 -ml-1 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <PhotoCarousel photos={report.photos} alt={report.title} />
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={report.status} />
            <VisibilityBadge visibility={report.visibility} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">{report.title}</h2>

          <ul className="space-y-1.5 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <User size={16} className="text-emerald-700 shrink-0" />
              {report.author?.nama}
              {report.author?.jabatan && <span className="text-slate-500">· {report.author.jabatan}</span>}
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-700 shrink-0" />
              {activityDate} · {report.activity_time} WIB
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
        </div>
      </article>

      {/* Nilai bintang */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4">
        <h3 className="text-sm font-bold text-slate-900">Nilai Kegiatan</h3>
        <p className="text-xs text-slate-500 mb-2">Ketuk bintang untuk memberi atau mengubah nilai.</p>
        <StarRating value={report.rating ?? 0} onChange={value => rateReport.mutate(value)} size={28} />
        {rateReport.isError && <p role="alert" className="text-sm text-red-700 mt-1">{rateReport.error.message}</p>}
      </section>

      {report.permissions.can_review && <ReviewForm report={report} />}

      <CommentSection report={report} emptyMessage="Berikan tanggapan pertama Anda untuk laporan ini." />
    </div>
  );
}
