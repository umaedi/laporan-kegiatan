import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Image, CheckCircle, Clock, Building2, Waves } from 'lucide-react';

export default function ReportCard({ report }) {
  const hasComments = report.comments && report.comments.length > 0;
  const latestComment = hasComments ? report.comments[report.comments.length - 1] : null;

  // Format tanggal rapi
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const isLuarKantor = report.activityType === 'luar_kantor' || !report.activityType;

  return (
    <Link
      to={`/kegiatan/${report.id}`}
      className="block bg-white rounded-2xl p-4 shadow-xs border border-slate-100 hover:shadow-md transition-shadow duration-200 mb-3.5 text-left group"
    >
      {/* Baris 1: Tanggal & Badge Jenis Kegiatan */}
      <div className="flex items-center justify-between py-1.5 dotted-divider">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Tanggal</span>
          <span className="text-xs font-bold text-slate-800 tracking-tight block mt-0.5">
            {formatDate(report.date)} {report.time ? `• ${report.time}` : ''}
          </span>
        </div>

        {isLuarKantor ? (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
            <Waves size={11} className="text-emerald-700" />
            Luar Kantor
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full text-[10px] border border-blue-200">
            <Building2 size={11} className="text-blue-700" />
            Dalam Kantor
          </span>
        )}
      </div>

      {/* Baris 2: Nama / Judul Kegiatan */}
      <div className="py-1.5 dotted-divider text-left">
        <span className="text-[11px] text-slate-400 font-medium block">Kegiatan</span>
        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 line-clamp-2 block mt-0.5 transition-colors leading-snug">
          {report.title}
        </span>
      </div>

      {/* Baris 3: Lokasi */}
      <div className="py-1.5 dotted-divider text-left">
        <span className="text-[11px] text-slate-400 font-medium block">Lokasi</span>
        <span className="text-xs text-slate-700 font-medium block mt-0.5 truncate">
          {report.location || 'Dinas Perikanan'}
        </span>
      </div>

      {/* Baris 4: Status */}
      <div className="flex items-center justify-between py-1.5 dotted-divider">
        <span className="text-[11px] text-slate-400 font-medium">Status</span>
        <div>
          {hasComments ? (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
              <CheckCircle size={12} className="text-emerald-600" />
              Sudah Ditinjau
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[11px]">
              <Clock size={12} className="text-amber-600" />
              Menunggu Review
            </span>
          )}
        </div>
      </div>

      {/* Baris 5: Pratinjau Foto & Cuplikan Deskripsi */}
      <div className="mt-3 pt-1 flex items-start gap-2.5">
        {report.photo ? (
          <div className="relative shrink-0">
            <img
              src={report.photo}
              alt="Dokumentasi perikanan"
              className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <Image size={16} />
          </div>
        )}

        <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {report.description}
        </div>
      </div>

      {/* Snippet Komentar Apresiasi Terkini Jika Ada */}
      {latestComment && (
        <div className="mt-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-[11px] text-emerald-950 flex items-start gap-1.5">
          <MessageSquare size={13} className="text-emerald-700 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-emerald-900">{latestComment.author}: </span>
            <span className="italic text-slate-700">"{latestComment.text}"</span>
          </div>
        </div>
      )}
    </Link>
  );
}
