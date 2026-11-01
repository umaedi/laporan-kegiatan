import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useReviewReport } from '../../hooks/useReports';
import { REVIEW_ACTION } from '../../shared/enums';

// Review Kepala Dinas: setujui atau minta tindak lanjut. Komentar biasa lewat kolom komentar.
export default function ReviewForm({ report }) {
  const review = useReviewReport(report.id);
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');

  const trimmed = note.trim();

  const submit = (action, message) => {
    review.mutate(
      { action, body: trimmed || null },
      {
        onSuccess: () => {
          setNote('');
          setFeedback(message);
          setTimeout(() => setFeedback(''), 2500);
        }
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Review Kepala Dinas</h3>
        <p className="text-xs text-slate-500 mt-0.5">Review tampil di utas komentar dan mengubah status laporan.</p>
      </div>

      <textarea
        rows={3}
        value={note}
        onChange={e => setNote(e.target.value)}
        maxLength={1000}
        placeholder="Catatan review (wajib untuk tindak lanjut)…"
        aria-label="Catatan review"
        className="w-full text-base p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={review.isPending}
          onClick={() => submit(REVIEW_ACTION.APPROVED, 'Laporan disetujui')}
          className="inline-flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.97] disabled:opacity-50 transition-all"
        >
          <CheckCircle2 size={18} />
          Setujui
        </button>
        <button
          type="button"
          disabled={!trimmed || review.isPending}
          onClick={() => submit(REVIEW_ACTION.REVISION, 'Permintaan tindak lanjut terkirim')}
          className="inline-flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <AlertTriangle size={18} />
          Tindak Lanjut
        </button>
      </div>

      <p className="text-xs text-slate-500">"Setujui" boleh tanpa catatan. "Tindak Lanjut" memerlukan catatan.</p>

      {review.isError && (
        <p role="alert" className="text-sm text-red-700">{review.error.message}</p>
      )}
      {feedback && (
        <p role="status" className="text-sm font-semibold text-emerald-700">{feedback}</p>
      )}
    </div>
  );
}
