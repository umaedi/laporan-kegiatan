import React from 'react';
import { TrendingUp, CalendarDays } from 'lucide-react';

export default function AuditChartSection({ reports }) {
  // Ambil 7 hari terakhir (atau tanggal unik yang ada)
  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateString = d.toISOString().split('T')[0]; // Format YYYY-MM-DD
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    last7Days.push({ dateString, label });
  }

  // Hitung jumlah laporan per tanggal
  const chartData = last7Days.map(item => {
    const count = reports.filter(r => r.date === item.dateString).length;
    return {
      ...item,
      count
    };
  });

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tren Aktivitas 7 Hari Terakhir
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Jumlah laporan kegiatan masuk per tanggal
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 flex items-center gap-1">
          <CalendarDays size={12} />
          <span>7 Hari</span>
        </span>
      </div>

      {/* Bar Chart Sederhana Tren Harian */}
      <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32 px-1">
        {chartData.map((item, idx) => {
          const heightPercent = item.count > 0 ? Math.round((item.count / maxCount) * 100) : 4;

          return (
            <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-pointer">
              <span className="text-[10px] font-bold text-emerald-800 mb-1 opacity-80 group-hover:opacity-100">
                {item.count > 0 ? item.count : ''}
              </span>

              <div className="w-full max-w-[32px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-20 transition-all group-hover:bg-slate-200">
                <div 
                  className={`w-full transition-all duration-500 rounded-t-xl ${
                    item.count > 0 
                      ? 'bg-gradient-to-t from-emerald-800 to-teal-600 group-hover:from-emerald-900 group-hover:to-teal-500' 
                      : 'bg-slate-200'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.label}: ${item.count} laporan`}
                ></div>
              </div>

              <span className="text-[9px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
