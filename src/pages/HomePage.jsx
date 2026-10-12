import React from 'react';
import MetricGrid from '../components/dashboard/MetricGrid';
import RecentActivityList from '../components/dashboard/RecentActivityList';

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* 4 Kartu Metrik Gradien Toska 2-Kolom Sesuai Referensi Visual */}
      <MetricGrid />

      {/* Feed Kegiatan Terkini Sesuai Referensi Foto */}
      <RecentActivityList />
    </div>
  );
}
