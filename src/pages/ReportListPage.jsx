import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import ReportCard from '../components/report/ReportCard';
import { Search, Filter, Plus, ArrowLeft } from 'lucide-react';

export default function ReportListPage() {
  const { reports, todayString } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterParam = searchParams.get('filter') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logika
  const filteredReports = reports.filter(r => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchLoc = (r.location || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    // 3. Tab filter
    if (filterParam === 'luar_kantor') {
      return r.activityType === 'luar_kantor';
    }
    if (filterParam === 'dalam_kantor') {
      return r.activityType === 'dalam_kantor';
    }
    if (filterParam === 'today') {
      return r.date === todayString;
    }
    if (filterParam === 'pending') {
      return r.status === 'pending' || !r.comments || r.comments.length === 0;
    }
    if (filterParam === 'reviewed') {
      return r.status === 'reviewed' && r.comments && r.comments.length > 0;
    }

    return true;
  });

  return (
    <div className="flex flex-col flex-1 pb-10 px-5 pt-3">
      {/* Header Halaman */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Daftar Kegiatan
        </h2>
        <Link
          to="/buat-laporan"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Plus size={14} />
          Lapor Baru
        </Link>
      </div>

      {/* Input Pencarian */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kegiatan, lokasi, kata kunci..."
          className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Filter Tabs Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-2">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'luar_kantor', label: 'Luar Kantor' },
          { key: 'dalam_kantor', label: 'Dalam Kantor' },
          { key: 'today', label: 'Hari Ini' },
          { key: 'pending', label: 'Menunggu Review' },
          { key: 'reviewed', label: 'Sudah Ditinjau' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSearchParams({ filter: tab.key })}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
              filterParam === tab.key
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info Jumlah Kegiatan */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-0.5">
        <span>Menampilkan <strong className="text-slate-800">{filteredReports.length}</strong> kegiatan</span>
      </div>

      {/* List Kartu Laporan */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 mt-2">
          <p className="text-xs text-slate-400 font-medium">Tidak ada kegiatan yang sesuai dengan filter.</p>
        </div>
      ) : (
        <div>
          {filteredReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
