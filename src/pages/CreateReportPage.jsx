import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import { ACTIVITY_TYPES } from '../data/seedData';
import PhotoPicker from '../components/report/PhotoPicker';
import { ArrowLeft, Save, MapPin, Calendar, Clock, FileText, CheckCircle2, Building2, Waves } from 'lucide-react';

export default function CreateReportPage() {
  const navigate = useNavigate();
  const { addReport } = useReports();

  const [activityType, setActivityType] = useState('luar_kantor'); // 'luar_kantor' | 'dalam_kantor'
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [location, setLocation] = useState('Pokdakan Mina Sejahtera, Desa Karanganyar');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleTypeChange = (type) => {
    setActivityType(type);
    if (type === 'dalam_kantor') {
      setLocation('Ruang Rapat Utama Lt. 2 Dinas Perikanan');
    } else {
      setLocation('Kawasan Tambak Budidaya / Pelabuhan TPI');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const newReport = addReport({
      title: title.trim(),
      activityType,
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      photo: photo || (activityType === 'dalam_kantor' 
        ? 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'),
      reporterName: 'Bayu Pratama, S.Pi.',
      reporterNip: '19930415 202012 1 002'
    });

    setIsSubmitting(false);
    setShowToast(true);

    setTimeout(() => {
      navigate(`/kegiatan/${newReport.id}`);
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 pb-10 px-5 pt-3">
      {/* Header Form */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Buat Laporan Kegiatan
          </h2>
          <p className="text-xs text-slate-500">Pegawai Dinas Kelautan & Perikanan</p>
        </div>
      </div>

      {showToast && (
        <div className="mb-4 p-3 bg-emerald-800 text-white rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-300" />
          <span className="text-xs font-bold">Laporan berhasil disimpan & dikirim ke Atasan!</span>
        </div>
      )}

      {/* Form Tambah Kegiatan Pegawai */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pilihan Tipe Kegiatan: Luar Kantor vs Dalam Kantor */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            Jenis Penugasan Kegiatan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('luar_kantor')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activityType === 'luar_kantor'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Waves size={20} className={activityType === 'luar_kantor' ? 'text-emerald-200' : 'text-slate-500'} />
              <span>Luar Kantor (Lapangan)</span>
              <span className={`text-[10px] font-normal ${activityType === 'luar_kantor' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Tambak, TPI, Nelayan
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('dalam_kantor')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activityType === 'dalam_kantor'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Building2 size={20} className={activityType === 'dalam_kantor' ? 'text-emerald-200' : 'text-slate-500'} />
              <span>Dalam Kantor (Internal)</span>
              <span className={`text-[10px] font-normal ${activityType === 'dalam_kantor' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Rapat, PTSP, Dokumen
              </span>
            </button>
          </div>
        </div>

        {/* Nama / Judul Kegiatan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-700" />
            Nama Kegiatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              activityType === 'luar_kantor'
                ? 'Contoh: Monitoring Kualitas Air Tambak Nila Bioflok Pokdakan Mina'
                : 'Contoh: Rapat Koordinasi Evaluasi Realisasi Anggaran Sarpras DKP'
            }
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-800 placeholder-slate-400"
          />
        </div>


        {/* Tanggal & Waktu Pelaksanaan */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-700" />
              Tanggal
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-800"
            />
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-700" />
              Waktu
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Lokasi Kegiatan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin size={14} className="text-emerald-700" />
            Lokasi Pelaksanaan
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={
              activityType === 'luar_kantor'
                ? 'Contoh: Dermaga TPI Muara Kasih / Tambak Pokdakan'
                : 'Contoh: Ruang Rapat Lt. 2 / Loket PTSP DKP'
            }
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-800"
          />
        </div>

        {/* Unggah Bukti Dukung (Kamera / Galeri) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            Bukti Dukung Foto (Kamera / Galeri)
          </label>
          <p className="text-[11px] text-slate-500">
            Ambil foto dokumentasi kegiatan perikanan secara langsung atau pilih dari galeri.
          </p>
          <PhotoPicker photo={photo} setPhoto={setPhoto} />
        </div>

        {/* Deskripsi & Hasil Pelaksanaan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">
            Deskripsi / Notula & Hasil Kegiatan
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              activityType === 'luar_kantor'
                ? 'Tuliskan hasil pengamatan lapangan, data pengukuran kualitas air/ikan, kondisi nelayan/sarpras, atau kendala...'
                : 'Tuliskan notula pembahasan rapat, kesepakatan tindak lanjut, jumlah berkas yang divalidasi, dll...'
            }
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Tombol Simpan Laporan */}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
        >
          <Save size={18} />
          {isSubmitting ? 'Menyimpan...' : 'Kirim Laporan Kegiatan'}
        </button>
      </form>
    </div>
  );
}
