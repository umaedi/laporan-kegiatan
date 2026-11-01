import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { REVIEW_ACTION } from '../../shared/enums';
import { formatRelativeTime } from '../../lib/date';
import { getInitials } from '../../lib/user';

const REVIEW_STYLE = {
  [REVIEW_ACTION.APPROVED]: {
    label: 'Disetujui',
    icon: CheckCircle2,
    className: 'bg-emerald-50 border-emerald-600 text-emerald-800'
  },
  [REVIEW_ACTION.REVISION]: {
    label: 'Perlu Tindak Lanjut',
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-500 text-amber-800'
  }
};

export default function CommentItem({ comment, isReply = false, onReply, onDelete }) {
  if (comment.deleted) {
    return <p className="text-sm italic text-slate-400 py-1">Komentar dihapus</p>;
  }

  const review = REVIEW_STYLE[comment.review_action];
  const ReviewIcon = review?.icon;
  const author = comment.author;

  return (
    <div className={`flex gap-2.5 ${comment.pending ? 'opacity-60' : ''}`}>
      <div
        className={`${isReply ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'} rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 ${
          author?.is_kepala_opd ? 'ring-2 ring-emerald-600' : ''
        }`}
      >
        {getInitials(author?.nama)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-slate-900">{author?.nama}</span>
          {author?.is_kepala_opd && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">Kepala OPD</span>
          )}
          <span className="text-xs text-slate-500">{comment.pending ? 'mengirim…' : formatRelativeTime(comment.created_at)}</span>
        </div>

        {review ? (
          <div className={`mt-1 rounded-xl border-l-4 px-3 py-2 ${review.className}`}>
            <p className="flex items-center gap-1 text-xs font-bold">
              <ReviewIcon size={14} /> {review.label}
            </p>
            <p className="text-sm text-slate-800 mt-0.5 whitespace-pre-wrap">{comment.body}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-800 mt-0.5 whitespace-pre-wrap break-words">{comment.body}</p>
        )}

        {!comment.pending && (onReply || comment.can_delete) && (
          <div className="flex items-center gap-3 mt-1">
            {onReply && (
              <button type="button" onClick={onReply} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Balas
              </button>
            )}
            {comment.can_delete && (
              <button type="button" onClick={onDelete} className="text-xs font-semibold text-slate-500 hover:text-red-700">
                Hapus
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
