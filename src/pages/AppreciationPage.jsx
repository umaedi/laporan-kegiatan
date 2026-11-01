import React from 'react';
import { Award } from 'lucide-react';

// Halaman Apresiasi sementara: fitur belum tersedia
export default function AppreciationPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
        <Award size={32} />
      </div>
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
        Segera Hadir
      </span>
      <h2 className="text-lg font-bold text-slate-900">Halaman Apresiasi</h2>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">
        Fitur ini sedang disiapkan dan akan segera hadir.
      </p>
    </div>
  );
}
