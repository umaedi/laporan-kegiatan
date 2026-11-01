import React, { useEffect, useMemo, useRef } from 'react';
import { Camera, Image, Plus, X } from 'lucide-react';
import { MAX_PHOTOS } from '../../shared/enums';

// Pilih 1-5 foto dari kamera atau galeri. `photos` berisi objek File yang dikirim apa adanya ke server.
export default function PhotoPicker({ photos, onChange }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const previews = useMemo(() => photos.map(file => URL.createObjectURL(file)), [photos]);
  useEffect(() => () => previews.forEach(url => URL.revokeObjectURL(url)), [previews]);

  const remaining = MAX_PHOTOS - photos.length;

  const handleFiles = (e) => {
    const files = Array.from(e.target.files ?? []).slice(0, remaining);
    if (files.length) onChange([...photos, ...files]);
    e.target.value = '';
  };

  const removeAt = (index) => onChange(photos.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" ref={cameraInputRef} onChange={handleFiles} className="hidden" />
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple ref={galleryInputRef} onChange={handleFiles} className="hidden" />

      {photos.length === 0 ? (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-1.5">
              <Camera size={20} />
            </div>
            <span className="text-sm font-bold">Buka Kamera</span>
            <span className="text-xs text-emerald-700">Foto langsung</span>
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-1.5">
              <Image size={20} />
            </div>
            <span className="text-sm font-bold">Pilih Galeri</span>
            <span className="text-xs text-slate-500">Hingga {MAX_PHOTOS} foto</span>
          </button>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {previews.map((url, index) => (
            <div key={url} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-200">
              <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 rounded bg-black/60 text-white text-xs font-semibold">Sampul</span>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Hapus foto ${index + 1}`}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              aria-label="Tambah foto"
              className="w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 flex flex-col items-center justify-center hover:bg-slate-50"
            >
              <Plus size={20} />
              <span className="text-xs">{photos.length}/{MAX_PHOTOS}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
