import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Memuat…', fullScreen = false }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-2 text-slate-500 ${
        fullScreen ? 'min-h-screen bg-white' : 'py-16'
      }`}
    >
      <Loader2 size={28} className="animate-spin text-emerald-700" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
