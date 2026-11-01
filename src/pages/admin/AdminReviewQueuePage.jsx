import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import { useReviewQueue } from '../../hooks/useAdmin';
import AdminReportRow from '../../components/admin/AdminReportRow';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import LoadMore from '../../components/ui/LoadMore';

export default function AdminReviewQueuePage() {
  const { data, isPending, isError, error, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useReviewQueue();

  if (isPending) return <LoadingState label="Memuat antrean…" />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  const reports = data.pages.flatMap(page => page.items);
  const total = data.pages[0].meta.total;

  return (
    <div className="flex flex-col px-4 pt-4 pb-6">
      <h2 className="text-lg font-bold text-slate-900">Perlu Ditinjau</h2>
      <p className="text-sm text-slate-500 mb-4">
        {total} laporan menunggu tanggapan Anda. Laporan terlama di atas.
      </p>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16">
          <ClipboardCheck size={40} className="text-emerald-500 mb-3" />
          <p className="text-base font-bold text-slate-900">Semua laporan sudah ditinjau</p>
          <p className="text-sm text-slate-500 mt-1">Laporan baru dari pegawai akan muncul di sini.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {reports.map(r => (
              <AdminReportRow key={r.id} report={r} />
            ))}
          </div>
          <LoadMore hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
        </>
      )}
    </div>
  );
}
