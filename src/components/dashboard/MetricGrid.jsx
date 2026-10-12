import React from 'react';
import { useReports } from '../../context/ReportContext';
import { Link } from 'react-router-dom';

export default function MetricGrid() {
  const { totalCount, todayCount, pendingCount, reviewedCount } = useReports();

  const metrics = [
    {
      title: 'Total Kegiatan',
      value: totalCount,
      link: '/kegiatan?filter=all',
      description: 'Seluruh arsip'
    },
    {
      title: 'Kegiatan Hari Ini',
      value: todayCount,
      link: '/kegiatan?filter=today',
      description: 'Pelaporan hari ini'
    },
    {
      title: 'Menunggu Review',
      value: pendingCount,
      link: '/kegiatan?filter=pending',
      description: 'Perlu tanggapan atasan'
    },
    {
      title: 'Sudah Ditinjau',
      value: reviewedCount,
      link: '/kegiatan?filter=reviewed',
      description: 'Telah ada komentar'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-5 pt-4 pb-2">
      {metrics.map((m, idx) => (
        <Link
          key={idx}
          to={m.link}
          className="gradient-card block cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="card-body relative z-10 flex flex-col justify-between min-h-[72px]">
            <div>
              <span className="text-[12px] font-semibold text-white/95 tracking-wide block leading-tight">
                {m.title}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white tracking-tight drop-shadow-xs">
                {m.value}
              </span>
              <span className="text-[10px] text-white/85 font-semibold group-hover:text-white transition-colors">
                Detail &rarr;
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
