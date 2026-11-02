import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, MapPin, Waves, Building2 } from 'lucide-react';
import { useToggleLike } from '../../hooks/useReports';
import { ACTIVITY_TYPE } from '../../shared/enums';
import { formatRelativeTime } from '../../lib/date';
import { getInitials } from '../../lib/user';
import VisibilityBadge from './VisibilityBadge';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';
import PhotoCarousel from './PhotoCarousel';

export default function PostCard({ report }) {
  const navigate = useNavigate();
  const toggleLike = useToggleLike();
  const [expanded, setExpanded] = useState(false);
  const [likePulse, setLikePulse] = useState(false);

  const isLiked = report.liked_by_me;
  const latestComments = report.latest_comments ?? [];
  const isDalamKantor = report.activity_type === ACTIVITY_TYPE.DALAM_KANTOR;
  const detailPath = `/kegiatan/${report.id}`;

  const handleLike = () => {
    if (!isLiked) {
      setLikePulse(true);
      setTimeout(() => setLikePulse(false), 200);
    }
    toggleLike.mutate({ id: report.id, liked: isLiked });
  };

  // Ketuk dua kali pada foto = sukai (tidak membatalkan suka, seperti Instagram)
  const handlePhotoDoubleClick = () => {
    if (!isLiked) handleLike();
  };

  return (
    <article className="bg-white border-b border-slate-200 pb-3">
      {/* Header: avatar, nama, jabatan, waktu */}
      <header className="flex items-center gap-3 px-4 py-2.5">
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shrink-0">
          {getInitials(report.author?.nama)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{report.author?.nama}</p>
          <p className="flex items-center gap-1 text-xs text-slate-500 min-w-0">
            <span className="truncate">
              {[report.author?.jabatan, formatRelativeTime(report.created_at)].filter(Boolean).join(' · ')}
            </span>
            <span aria-hidden="true">·</span>
            <VisibilityBadge visibility={report.visibility} iconOnly />
          </p>
        </div>
        <StatusBadge status={report.status} />
      </header>

      {/* Foto kegiatan persegi 1:1, maksimal 1000 x 1000 px */}
      <PhotoCarousel photos={report.photos} alt={report.title} onDoubleClick={handlePhotoDoubleClick} />

      {/* Tombol aksi: Sukai & Komentar */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-3 pb-1">
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={isLiked}
          className={`inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-white transition-colors active:scale-[0.97] ${
            isLiked ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <Heart
            size={20}
            className={`transition-transform duration-200 ${likePulse ? 'scale-125' : 'scale-100'}`}
            fill={isLiked ? 'currentColor' : 'none'}
          />
          {isLiked ? 'Disukai' : 'Sukai'}
        </button>

        <button
          type="button"
          onClick={() => navigate(`${detailPath}#komentar`)}
          className="inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors active:scale-[0.97]"
        >
          <MessageCircle size={20} />
          Komentar
        </button>
      </div>

      <div className="px-4 space-y-1">
        {report.rating > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <StarRating value={report.rating} size={14} />
            <span>Dinilai Kepala Dinas</span>
          </div>
        )}

        {report.like_count > 0 && (
          <p className="text-sm font-semibold text-slate-900">
            Disukai {report.like_count.toLocaleString('id-ID')} orang
          </p>
        )}

        {/* Caption: judul + deskripsi */}
        <div className="text-sm text-slate-800 leading-5">
          <Link to={detailPath} className="font-semibold text-slate-900 hover:text-emerald-800">
            {report.title}
          </Link>
          {report.description && (
            <p className={`mt-0.5 text-slate-700 ${expanded ? '' : 'line-clamp-2'}`}>
              {report.description}
            </p>
          )}
          {report.description && !expanded && report.description.length > 120 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-slate-500 font-medium"
            >
              selengkapnya
            </button>
          )}
        </div>

        {/* Meta: jenis kegiatan & lokasi */}
        <p className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          {isDalamKantor ? (
            <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
              <Building2 size={14} /> Dalam Kantor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <Waves size={14} /> Luar Kantor
            </span>
          )}
          {report.location && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 min-w-0">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">{report.location}</span>
              </span>
            </>
          )}
        </p>

        {/* Pratinjau komentar */}
        {report.comment_count > latestComments.length && (
          <Link to={`${detailPath}#komentar`} className="block text-sm text-slate-500">
            Lihat semua {report.comment_count} komentar
          </Link>
        )}
        {latestComments.map(c => (
          <p key={c.id} className="text-sm text-slate-800 line-clamp-1">
            <span className="font-semibold text-slate-900">{c.author?.nama}</span> {c.body}
          </p>
        ))}
      </div>
    </article>
  );
}
