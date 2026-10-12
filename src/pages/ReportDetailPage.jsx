import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import CommentSection from '../components/supervisor/CommentSection';
import { ArrowLeft, Calendar, Clock, MapPin, User, Tag, Image, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, deleteReport } = useReports();
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const report = reports.find(r => r.id === id);

  if (!report) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8 text-center">
        <p className="text-sm text-slate-500 font-medium">Laporan kegiatan tidak ditemukan.</p>
        <button
          onClick={() => navigate('/kegiatan')}
          className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan kegiatan ini?')) {
      deleteReport(report.id);
      navigate('/kegiatan');
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-12 px-5 pt-3">
      {/* Top Header Detail */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">
          {report.id}
        </span>

        <button
          type="button"
          onClick={handleDelete}
          className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
          title="Hapus Laporan"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Judul Kegiatan & Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {report.activityType === 'dalam_kantor' ? (
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Dalam Kantor
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Luar Kantor
              </span>
            )}
          </div>

          {report.status === 'reviewed' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 size={12} />
              Disetujui Atasan
            </span>
          ) : report.status === 'revision' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <AlertTriangle size={12} />
              Perlu Catatan
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Menunggu Review
            </span>
          )}
        </div>

        <h1 className="text-lg font-extrabold text-slate-900 leading-snug">
          {report.title}
        </h1>
      </div>

      {/* Foto Bukti Dukung */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs mb-3">
        <span className="text-xs font-bold text-slate-800 block mb-2">
          Foto Bukti Dukung Kegiatan:
        </span>
        {report.photo ? (
          <div
            onClick={() => setShowPhotoModal(true)}
            className="relative rounded-xl overflow-hidden cursor-pointer group bg-slate-900"
          >
            <img
              src={report.photo}
              alt="Bukti kegiatan"
              className="w-full h-56 object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow backdrop-blur-xs flex items-center gap-1">
                <Image size={14} />
                Ketuk untuk Memperbesar
              </span>
            </div>
          </div>
        ) : (
          <div className="h-32 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
            Tidak ada foto bukti dukung
          </div>
        )}
      </div>

      {/* Modal Zoom Foto */}
      {showPhotoModal && report.photo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowPhotoModal(false)}
        >
          <img
            src={report.photo}
            alt="Bukti besar"
            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
          />
          <button
            onClick={() => setShowPhotoModal(false)}
            className="mt-4 px-5 py-2 bg-white text-slate-900 font-bold text-xs rounded-full shadow"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Informasi Detail Kegiatan */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2 mb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
          Rincian Pelaksanaan
        </h3>

        <div className="flex items-center justify-between text-xs py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Calendar size={13} className="text-emerald-700" /> Tanggal
          </span>
          <span className="font-bold text-slate-800">{formatDate(report.date)}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Clock size={13} className="text-emerald-700" /> Jam Pelaksanaan
          </span>
          <span className="font-bold text-slate-800">{report.time || '-'}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <User size={13} className="text-emerald-700" /> Staf Pelapor
          </span>
          <span className="font-bold text-slate-800">{report.reporterName}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 dotted-divider">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-700" /> Lokasi
          </span>
          <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">
            {report.location || 'Lapangan Utama'}
          </span>
        </div>

        {/* Deskripsi */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 block mb-1">Catatan & Hasil:</span>
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
            {report.description || 'Tidak ada deskripsi tambahan.'}
          </div>
        </div>
      </div>

      {/* Bagian Komentar & Feedback Atasan */}
      <CommentSection report={report} />
    </div>
  );
}
