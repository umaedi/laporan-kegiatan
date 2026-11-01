import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const STATUS_BADGE = {
  reviewed: { label: 'Ditinjau', icon: CheckCircle2, className: 'text-emerald-700 bg-emerald-50' },
  revision: { label: 'Perlu Tindak Lanjut', icon: AlertTriangle, className: 'text-red-700 bg-red-50' },
  pending: { label: 'Menunggu Tinjauan', icon: Clock, className: 'text-amber-700 bg-amber-50' }
};

export default function StatusBadge({ status }) {
  const badge = STATUS_BADGE[status] || STATUS_BADGE.pending;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${badge.className}`}>
      <Icon size={14} />
      {badge.label}
    </span>
  );
}
