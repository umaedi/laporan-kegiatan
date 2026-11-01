import React, { useState } from 'react';
import AuthImage from '../ui/AuthImage';

// Carousel foto persegi 1:1 (maks. 1000px) dengan geser horizontal & indikator titik
export default function PhotoCarousel({ photos = [], alt, onDoubleClick }) {
  const [active, setActive] = useState(0);

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    setActive(Math.round(scrollLeft / clientWidth));
  };

  return (
    <div
      className="relative w-full max-w-[1000px] aspect-square mx-auto bg-slate-100 select-none"
      onDoubleClick={onDoubleClick}
    >
      <div className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar" onScroll={handleScroll}>
        {photos.map((photo, index) => (
          <div key={photo.id} className="w-full h-full shrink-0 snap-center">
            <AuthImage
              src={photo.url}
              alt={photos.length > 1 ? `${alt} (${index + 1} dari ${photos.length})` : alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-semibold">
            {active + 1}/{photos.length}
          </span>
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5" aria-hidden="true">
            {photos.map((photo, index) => (
              <span
                key={photo.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === active ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
