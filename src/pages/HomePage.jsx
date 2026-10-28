import React from 'react';
import MetricGrid from '../components/dashboard/MetricGrid';
import RecentActivityList from '../components/dashboard/RecentActivityList';
import AdminDashboardSummary from '../components/dashboard/AdminDashboardSummary';
import { useReports } from '../context/ReportContext';

export default function HomePage() {
  const { currentUserRole } = useReports();

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Jika role admin, tampilkan panel ringkasan monitoring keseluruhan sistem */}
      {currentUserRole === 'admin' ? (
        <AdminDashboardSummary />
      ) : (
        /* 4 Kartu Metrik Gradien Toska 2-Kolom Sesuai Referensi Visual (Hanya untuk Pegawai/User) */
        <MetricGrid />
      )}

      {/* Feed Kegiatan Terkini Sesuai Referensi Foto */}
      <RecentActivityList />
    </div>
  );
}
