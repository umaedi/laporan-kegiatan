import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAddComment, useComments, useDeleteComment } from '../../hooks/useComments';
import { VISIBILITY } from '../../shared/enums';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import CommentItem from './CommentItem';

const MAX_LENGTH = 1000;

// Utas komentar dua arah (balasan 1 tingkat) + kolom tulis komentar
export default function CommentSection({ report, emptyMessage = 'Jadilah yang pertama memberi komentar.' }) {
  const { data: comments, isPending, isError, error, refetch } = useComments(report.id);
  const addComment = useAddComment(report.id);
  const deleteComment = useDeleteComment(report.id);

  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const trimmed = text.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trimmed) return;
    addComment.mutate(
      { body: trimmed, parentId: replyTo?.id },
      {
        onSuccess: () => {
          setText('');
          setReplyTo(null);
        }
      }
    );
  };

  const handleDelete = (comment) => {
    if (window.confirm('Hapus komentar ini?')) deleteComment.mutate(comment.id);
  };

  const placeholder =
    report.visibility === VISIBILITY.PRIVATE
      ? 'Komentar hanya terlihat oleh pembuat laporan dan Kepala Dinas…'
      : 'Tulis komentar…';

  return (
    <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
        <MessageCircle size={18} className="text-emerald-700" />
        Komentar {comments?.length > 0 && <span className="text-slate-500 font-medium">({report.comment_count})</span>}
      </h3>

      {isPending ? (
        <LoadingState label="Memuat komentar…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} title="Gagal memuat komentar" />
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">{emptyMessage}</p>
      ) : (
        <ul className="space-y-4">
          {comments.map(comment => (
            <li key={comment.id} className="space-y-3">
              <CommentItem
                comment={comment}
                onReply={comment.deleted ? undefined : () => setReplyTo(comment)}
                onDelete={() => handleDelete(comment)}
              />
              {comment.replies?.length > 0 && (
                <ul className="pl-11 space-y-3">
                  {comment.replies.map(reply => (
                    <li key={reply.id}>
                      <CommentItem comment={reply} isReply onDelete={() => handleDelete(reply)} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Kolom tulis komentar */}
      <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        {replyTo && (
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
            <span>
              Membalas <span className="font-semibold">{replyTo.author?.nama}</span>
            </span>
            <button type="button" onClick={() => setReplyTo(null)} aria-label="Batal membalas" className="p-1">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={MAX_LENGTH}
            placeholder={placeholder}
            aria-label="Tulis komentar"
            className="flex-1 text-base p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400 resize-none"
          />
          <button
            type="submit"
            disabled={!trimmed || addComment.isPending}
            aria-label="Kirim komentar"
            className="w-11 h-11 shrink-0 rounded-xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        {text.length > MAX_LENGTH - 100 && (
          <p className="text-xs text-slate-500 text-right">{text.length}/{MAX_LENGTH}</p>
        )}
        {(addComment.isError || deleteComment.isError) && (
          <p role="alert" className="text-sm text-red-700">
            {(addComment.error ?? deleteComment.error)?.message}
          </p>
        )}
      </form>
    </section>
  );
}
