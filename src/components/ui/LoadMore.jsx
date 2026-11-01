import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

// Muat halaman berikutnya otomatis saat mendekati bawah layar (dengan tombol cadangan)
export default function LoadMore({ hasNextPage, isFetchingNextPage, fetchNextPage }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '400px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <div ref={sentinelRef} className="flex justify-center py-6">
      {isFetchingNextPage ? (
        <Loader2 size={24} className="animate-spin text-emerald-700" aria-label="Memuat laporan berikutnya" />
      ) : (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          className="h-10 px-4 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Muat lebih banyak
        </button>
      )}
    </div>
  );
}
