import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import { formatRelativeTime } from '../../lib/date';
import StatusBadge from '../post/StatusBadge';
import StarRating from '../post/StarRating';
import VisibilityBadge from '../post/VisibilityBadge';
import AuthImage from '../ui/AuthImage';

// Baris ringkas laporan untuk daftar di Panel Admin
export default function AdminReportRow({ report }) {
  const cover = report.photos?.[0];

  return (
    <Link
      to={`/admin/laporan/${report.id}`}
      className="flex gap-3 p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors"
    >
      {cover ? (
        <AuthImage src={cover.url} alt={report.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
          <Image size={20} />
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-5">{report.title}</p>
        <p className="flex items-center gap-1 text-xs text-slate-500 min-w-0">
          <span className="truncate">
            {report.author?.nama} · {formatRelativeTime(report.created_at)}
          </span>
          <VisibilityBadge visibility={report.visibility} iconOnly />
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={report.status} />
          {report.rating > 0 && <StarRating value={report.rating} size={12} />}
        </div>
      </div>
    </Link>
  );
}
