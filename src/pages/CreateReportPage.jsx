import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Calendar, Clock, FileText, CheckCircle2, Building2, Waves, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCreateReport } from '../hooks/useReports';
import { ACTIVITY_TYPE, MAX_DAYS_BACK, ROLE, VISIBILITY } from '../shared/enums';
import { getTodayKey } from '../lib/date';
import PhotoPicker from '../components/report/PhotoPicker';
import VisibilityPicker from '../components/report/VisibilityPicker';

const VISIBILITY_PREF_KEY = 'pref:visibility';

// Ingat pilihan visibilitas terakhir; default private (paling aman)
function getInitialVisibility() {
  try {
    const saved = localStorage.getItem(VISIBILITY_PREF_KEY);
    if (Object.values(VISIBILITY).includes(saved)) return saved;
  } catch {
    // localStorage tidak tersedia
  }
  return VISIBILITY.PRIVATE;
}

function dateKeyDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

function currentTimeWib() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
}

const inputClass =
  'w-full text-base p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400';

function FieldError({ errors, name }) {
  const message = errors?.[name]?.[0];
  return message ? <p className="text-sm text-red-700">{message}</p> : null;
}

export default function CreateReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createReport = useCreateReport();
  const isKepala = user.role === ROLE.KEPALA_OPD;

  const [activityType, setActivityType] = useState(ACTIVITY_TYPE.LUAR_KANTOR);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayKey);
  const [time, setTime] = useState(currentTimeWib);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [visibility, setVisibility] = useState(getInitialVisibility);
  const [showToast, setShowToast] = useState(false);

  const fieldErrors = createReport.error?.errors;
  // Error per foto dari backend berbentuk "photos.0", "photos.1", ...
  const photoErrors = Object.entries(fieldErrors ?? {})
    .filter(([key]) => key === 'photos' || key.startsWith('photos.'))
    .flatMap(([, messages]) => messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || photos.length === 0) return;

    try {
      localStorage.setItem(VISIBILITY_PREF_KEY, visibility);
    } catch {
      // localStorage tidak tersedia
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('activity_type', activityType);
    formData.append('activity_date', date);
    formData.append('activity_time', time);
    formData.append('location', location.trim());
    formData.append('visibility', isKepala ? VISIBILITY.OPD : visibility);
    photos.forEach(file => formData.append('photos[]', file));

    createReport.mutate(formData, {
      onSuccess: (report) => {
        setShowToast(true);
        setTimeout(() => navigate(`/kegiatan/${report.id}`), 1200);
      }
    });
  };

  const typeButtonClass = (type) =>
    `p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-sm font-bold ${
      activityType === type
        ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30'
        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
    }`;

  return (
    <div className="flex flex-col flex-1 pb-10 px-4 pt-3">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Buat Laporan Kegiatan</h2>
          <p className="text-sm text-slate-500">{user.opd?.nama_opd}</p>
        </div>
      </div>

      {showToast && (
        <div role="status" className="mb-4 p-3 bg-emerald-800 text-white rounded-2xl flex items-center gap-2 shadow-lg">
          <CheckCircle2 size={18} className="text-emerald-300" />
          <span className="text-sm font-bold">
            {isKepala || visibility === VISIBILITY.OPD
              ? 'Laporan berhasil dibagikan ke seluruh pegawai!'
              : 'Laporan berhasil dikirim ke Kepala Dinas!'}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Jenis kegiatan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
          <span className="text-sm font-bold text-slate-800 block">
            Jenis Kegiatan <span className="text-red-500">*</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setActivityType(ACTIVITY_TYPE.LUAR_KANTOR)} className={typeButtonClass(ACTIVITY_TYPE.LUAR_KANTOR)}>
              <Waves size={20} />
              Luar Kantor
            </button>
            <button type="button" onClick={() => setActivityType(ACTIVITY_TYPE.DALAM_KANTOR)} className={typeButtonClass(ACTIVITY_TYPE.DALAM_KANTOR)}>
              <Building2 size={20} />
              Dalam Kantor
            </button>
          </div>
          <FieldError errors={fieldErrors} name="activity_type" />
        </div>

        {/* Foto */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
          <span className="text-sm font-bold text-slate-800 block">
            Foto Kegiatan <span className="text-red-500">*</span>
          </span>
          <p className="text-sm text-slate-500">Minimal 1, maksimal 5 foto (JPG, PNG, atau WEBP, masing-masing ≤ 8 MB).</p>
          <PhotoPicker photos={photos} onChange={setPhotos} />
          {photoErrors.map(message => (
            <p key={message} className="text-sm text-red-700">{message}</p>
          ))}
        </div>

        {/* Judul */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-1.5">
          <label htmlFor="title" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FileText size={16} className="text-emerald-700" />
            Judul Kegiatan <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Monitoring kualitas air tambak nila bioflok"
            className={inputClass}
          />
          <FieldError errors={fieldErrors} name="title" />
        </div>

        {/* Tanggal & jam */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-1.5">
            <label htmlFor="date" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar size={16} className="text-emerald-700" />
              Tanggal
            </label>
            <input
              id="date"
              type="date"
              required
              min={dateKeyDaysAgo(MAX_DAYS_BACK)}
              max={getTodayKey()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
            <FieldError errors={fieldErrors} name="activity_date" />
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-1.5">
            <label htmlFor="time" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Clock size={16} className="text-emerald-700" />
              Jam
            </label>
            <input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
            <FieldError errors={fieldErrors} name="activity_time" />
          </div>
        </div>

        {/* Lokasi */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-1.5">
          <label htmlFor="location" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin size={16} className="text-emerald-700" />
            Lokasi
          </label>
          <input
            id="location"
            type="text"
            maxLength={200}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={
              activityType === ACTIVITY_TYPE.LUAR_KANTOR ? 'Contoh: Dermaga TPI Muara Kasih' : 'Contoh: Ruang Rapat Lt. 2'
            }
            className={inputClass}
          />
          <FieldError errors={fieldErrors} name="location" />
        </div>

        {/* Deskripsi */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-1.5">
          <label htmlFor="description" className="text-sm font-bold text-slate-800 block">
            Deskripsi & Hasil Kegiatan
          </label>
          <textarea
            id="description"
            rows={4}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan hasil kegiatan, data pengukuran, kesepakatan tindak lanjut, atau kendala…"
            className={inputClass}
          />
          <FieldError errors={fieldErrors} name="description" />
        </div>

        {/* Visibilitas */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Eye size={16} className="text-emerald-700" />
            Siapa yang dapat melihat laporan ini?
          </span>
          {isKepala ? (
            <p className="text-sm text-slate-500">Laporan Kepala Dinas selalu terlihat oleh seluruh pegawai OPD.</p>
          ) : (
            <>
              <VisibilityPicker value={visibility} onChange={setVisibility} />
              <p className="text-sm text-slate-500">
                {visibility === VISIBILITY.OPD
                  ? 'Laporan tampil di beranda seluruh pegawai OPD dan dapat dikomentari oleh mereka.'
                  : 'Laporan dan komentarnya hanya dapat dilihat oleh Anda dan Kepala Dinas.'}
              </p>
            </>
          )}
          <FieldError errors={fieldErrors} name="visibility" />
        </div>

        {createReport.isError && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl p-3">
            {fieldErrors ? 'Periksa kembali isian yang ditandai merah.' : createReport.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={createReport.isPending || showToast || !title.trim() || photos.length === 0}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {createReport.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {createReport.isPending ? 'Mengunggah…' : 'Kirim Laporan Kegiatan'}
        </button>
      </form>
    </div>
  );
}
