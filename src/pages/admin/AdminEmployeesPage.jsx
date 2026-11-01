import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../hooks/useAdmin';
import { getInitials } from '../../lib/user';
import StarRating from '../../components/post/StarRating';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminEmployeesPage() {
  const { user } = useAuth();
  const { data: employees, isPending, isError, error, refetch } = useEmployees();

  if (isPending) return <LoadingState label="Memuat rekap pegawai…" />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col px-4 pt-4 pb-6">
      <h2 className="text-lg font-bold text-slate-900">Pegawai</h2>
      <p className="text-sm text-slate-500 mb-4">
        Rekap pelaporan {employees.length} pegawai {user.opd?.nama_opd}.
      </p>

      {employees.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-12">Belum ada pegawai aktif di OPD ini.</p>
      ) : (
        <div className="space-y-2">
          {employees.map(e => (
            <Link
              key={e.id}
              to={`/admin/laporan?pegawai=${e.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shrink-0">
                  {getInitials(e.nama)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{e.nama}</p>
                  <p className="text-xs text-slate-500 truncate">{e.jabatan ?? '-'}</p>
                </div>
                <ChevronRight size={20} className="text-slate-400 shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-slate-50 rounded-xl py-2">
                  <p className="text-lg font-bold text-slate-900">{e.total}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="bg-slate-50 rounded-xl py-2">
                  <p className="text-lg font-bold text-slate-900">{e.today}</p>
                  <p className="text-xs text-slate-500">Hari Ini</p>
                </div>
                <div className="bg-slate-50 rounded-xl py-2">
                  <p className={`text-lg font-bold ${e.pending > 0 ? 'text-amber-700' : 'text-slate-900'}`}>{e.pending}</p>
                  <p className="text-xs text-slate-500">Menunggu</p>
                </div>
              </div>

              {e.average_rating !== null && (
                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
                  <StarRating value={Math.round(e.average_rating)} size={14} />
                  <span>Rata-rata {e.average_rating.toLocaleString('id-ID', { maximumFractionDigits: 1 })}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
