import React, { useRef } from 'react';
import { Camera, Image, Trash2, CheckCircle2 } from 'lucide-react';

const SAMPLE_PHOTOS = [
  { label: 'Budidaya Ikan / Tambak', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rapat Internal Kantor', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
  { label: 'Inspeksi Kapal & TPI', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pelayanan PTSP / Dokumen', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80' }
];

export default function PhotoPicker({ photo, setPhoto }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhoto(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      {/* 1. Direct Camera input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 2. Gallery input */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {photo ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-900 group">
          <img
            src={photo}
            alt="Bukti kegiatan"
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3">
            <span className="inline-flex items-center gap-1 text-white text-xs font-semibold bg-emerald-600/90 px-2 py-1 rounded-lg backdrop-blur-xs">
              <CheckCircle2 size={13} />
              Bukti Terpasang
            </span>
            <button
              type="button"
              onClick={() => setPhoto('')}
              className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg"
              title="Hapus Foto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Tombol Kamera Langsung */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 transition-all active:scale-98 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-1.5 shadow-sm">
                <Camera size={20} />
              </div>
              <span className="text-xs font-bold">Buka Kamera</span>
              <span className="text-[10px] text-emerald-600 font-medium">Foto Langsung</span>
            </button>

            {/* Tombol Galeri HP */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all active:scale-98 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-1.5 shadow-sm">
                <Image size={20} />
              </div>
              <span className="text-xs font-bold">Pilih Galeri</span>
              <span className="text-[10px] text-slate-500 font-medium">Dari Memori HP</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
