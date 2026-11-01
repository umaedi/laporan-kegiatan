import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminDashboard } from '../../hooks/useAdmin';
import { formatTodayLong } from '../../lib/date';
import { getInitials } from '../../lib/user';
import AdminReportRow from '../../components/admin/AdminReportRow';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data, isPending, isError, error, refetch } = useAdminDashboard();

  if (isPending) return <LoadingState label="Memuat dasbor…" />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  const { metrics, reporting_today: reportingToday, pending_preview: pendingPreview } = data;

  const cards = [
    { title: 'Laporan Hari Ini', value: metrics.today, link: '/admin/laporan' },
    { title: 'Perlu Ditinjau', value: metrics.pending, link: '/admin/tinjau' },
    { title: 'Sudah Ditinjau', value: metrics.reviewed, link: '/admin/laporan?status=reviewed' },
    { title: 'Total Laporan', value: metrics.total, link: '/admin/laporan' }
  ];

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-6">
      <div>
        <p className="text-sm text-slate-500">{formatTodayLong()}</p>
        <h2 className="text-lg font-bold text-slate-900">Selamat datang, {user.nama}</h2>
      </div>

      {/* Metrik utama */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map(card => (
          <Link key={card.title} to={card.link} className="gradient-card block shadow-sm">
            <div className="card-body relative z-10 flex flex-col justify-between min-h-[80px]">
              <span className="text-sm font-semibold text-white/95 leading-tight">{card.title}</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-white">{card.value}</span>
                <span className="text-xs text-white/85 font-semibold">Detail &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Rekap pelaporan pegawai hari ini */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900">Pelaporan Hari Ini</h3>
          <span className="text-xs font-semibold text-slate-500">
            {reportingToday.reported_count} dari {reportingToday.employee_count} pegawai
          </span>
        </div>
        {reportingToday.employees.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada pegawai aktif di OPD ini.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reportingToday.employees.map(e => (
              <li key={e.id}>
                <Link to={`/admin/laporan?pegawai=${e.id}`} className="flex items-center gap-3 py-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shrink-0">
                    {getInitials(e.nama)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{e.nama}</p>
                    <p className="text-xs text-slate-500 truncate">{e.jabatan ?? '-'}</p>
                  </div>
                  {e.today_count > 0 ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full shrink-0">
                      {e.today_count} laporan
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full shrink-0">
                      Belum melapor
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pratinjau antrean tinjauan */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900">Perlu Ditinjau</h3>
          {metrics.pending > 0 && (
            <Link to="/admin/tinjau" className="text-sm font-semibold text-emerald-700">
              Lihat semua
            </Link>
          )}
        </div>
        {pendingPreview.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 p-4 text-center">
            Semua laporan sudah ditinjau. 🎉
          </p>
        ) : (
          <div className="space-y-2">
            {pendingPreview.map(r => (
              <AdminReportRow key={r.id} report={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
