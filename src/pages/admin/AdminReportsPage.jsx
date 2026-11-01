import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useAdminReports, useEmployees } from '../../hooks/useAdmin';
import { REPORT_STATUS } from '../../shared/enums';
import AdminReportRow from '../../components/admin/AdminReportRow';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import LoadMore from '../../components/ui/LoadMore';

const STATUS_FILTERS = [
  { id: 'semua', label: 'Semua' },
  { id: REPORT_STATUS.PENDING, label: 'Menunggu' },
  { id: REPORT_STATUS.REVIEWED, label: 'Ditinjau' },
  { id: REPORT_STATUS.REVISION, label: 'Tindak Lanjut' }
];

export default function AdminReportsPage() {
  // Filter disimpan di URL (?status=&pegawai=) agar bisa ditautkan dari Dasbor
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || 'semua';
  const employeeId = searchParams.get('pegawai') || '';

  const { data: employees } = useEmployees();
  const { data, isPending, isError, error, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminReports({
    status,
    userId: employeeId || undefined
  });

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'semua') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const reports = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div className="flex flex-col px-4 pt-4 pb-6">
      <h2 className="text-lg font-bold text-slate-900">Semua Laporan</h2>
      <p className="text-sm text-slate-500 mb-3">Seluruh laporan pegawai, termasuk yang hanya untuk Kepala Dinas.</p>

      {/* Filter status */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mb-3">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter('status', f.id)}
            className={`h-9 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              status === f.id ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Filter pegawai */}
      <select
        value={employeeId}
        onChange={e => setFilter('pegawai', e.target.value)}
        aria-label="Filter pegawai"
        className="h-11 px-3 mb-4 rounded-xl border border-slate-200 bg-white text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        <option value="">Semua pegawai</option>
        {(employees ?? []).map(e => (
          <option key={e.id} value={e.id}>
            {e.nama}
          </option>
        ))}
      </select>

      {isPending ? (
        <LoadingState label="Memuat laporan…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <>
          <p className="text-xs font-semibold text-slate-500 mb-2">{data.pages[0].meta.total} laporan</p>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center text-center py-12">
              <Layers size={40} className="text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-900">Tidak ada laporan</p>
              <p className="text-sm text-slate-500 mt-1">Coba ubah filter status atau pegawai.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map(r => (
                <AdminReportRow key={r.id} report={r} />
              ))}
            </div>
          )}
          <LoadMore hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
        </>
      )}
    </div>
  );
}
