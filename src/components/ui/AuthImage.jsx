import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ImageOff } from 'lucide-react';
import { apiBlob } from '../../api/client';

/**
 * Gambar dari endpoint stream backend (butuh token). Blob URL di-cache TanStack Query per path,
 * sehingga foto yang sama di feed, detail, dan profil hanya diunduh sekali. Blob URL dicabut saat
 * cache membuang query-nya (lihat subscriber 'photo' di App.jsx).
 */
export default function AuthImage({ src, alt, className = '' }) {
  const { data: objectUrl, isError } = useQuery({
    queryKey: ['photo', src],
    queryFn: async () => URL.createObjectURL(await apiBlob(src)),
    enabled: Boolean(src),
    // Foto tidak pernah berubah setelah diunggah
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000
  });

  if (isError) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-slate-100 text-slate-400 ${className}`} role="img" aria-label={alt}>
        <ImageOff size={24} />
        <span className="text-xs">Foto gagal dimuat</span>
      </div>
    );
  }

  if (!objectUrl) {
    return <div className={`bg-slate-200 animate-pulse ${className}`} role="img" aria-label={alt} />;
  }

  return <img src={objectUrl} alt={alt} className={className} draggable={false} />;
}
