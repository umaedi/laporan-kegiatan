import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useFeed } from '../hooks/useReports';
import PostCard from '../components/post/PostCard';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import LoadMore from '../components/ui/LoadMore';

export default function HomePage() {
  // Server hanya mengirim laporan yang boleh dilihat pengguna, terbaru di atas
  const { data, isPending, isError, error, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useFeed();

  if (isPending) return <LoadingState label="Memuat laporan…" />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  const feed = data.pages.flatMap(page => page.items);

  if (feed.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center px-6 py-16 text-center">
        <p className="text-base font-bold text-slate-900">Belum ada laporan kegiatan</p>
        <p className="text-sm text-slate-500 mt-1">Bagikan kegiatan pertama Anda hari ini.</p>
        <Link
          to="/buat-laporan"
          className="inline-flex items-center gap-1.5 mt-4 h-11 px-5 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition-colors"
        >
          <PlusCircle size={18} />
          Buat Laporan
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {feed.map(report => (
        <PostCard key={report.id} report={report} />
      ))}
      <LoadMore hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
    </div>
  );
}
