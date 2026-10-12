import React from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import ReportCard from '../report/ReportCard';
import { PlusCircle } from 'lucide-react';

export default function RecentActivityList() {
  const { reports } = useReports();
  const recentReports = reports.slice(0, 4);

  return (
    <div className="px-5 pt-3 pb-8">
      {/* Header section sesuai gambar referensi */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Kegiatan Terkini
        </h2>
        <Link
          to="/kegiatan"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          Lihat semua
        </Link>
      </div>

      {/* Daftar Kartu Laporan */}
      {recentReports.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-xs">
          <p className="text-sm text-slate-500 font-medium">Belum ada kegiatan yang dilaporkan.</p>
          <Link
            to="/buat-laporan"
            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow hover:bg-emerald-800 transition-colors"
          >
            <PlusCircle size={15} />
            Buat Laporan Pertama
          </Link>
        </div>
      ) : (
        recentReports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))
      )}
    </div>
  );
}
