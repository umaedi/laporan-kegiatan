import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry, title = 'Gagal memuat data' }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center text-center px-6 py-14">
      <AlertCircle size={36} className="text-red-500 mb-3" />
      <p className="text-base font-bold text-slate-900">{title}</p>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">{error?.message ?? 'Terjadi kesalahan yang tidak diketahui.'}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors"
        >
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
