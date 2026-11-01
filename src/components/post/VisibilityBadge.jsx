import React from 'react';
import { Lock, Users } from 'lucide-react';
import { VISIBILITY, VISIBILITY_OPTIONS } from '../../shared/enums';

// Laporan lama tanpa nilai visibilitas dianggap private (paling aman)
export default function VisibilityBadge({ visibility = VISIBILITY.PRIVATE, iconOnly = false }) {
  const isOpd = visibility === VISIBILITY.OPD;
  const Icon = isOpd ? Users : Lock;
  const label = VISIBILITY_OPTIONS.find(o => o.id === visibility)?.label ?? VISIBILITY_OPTIONS[0].label;

  if (iconOnly) {
    return (
      <span title={label} aria-label={`Visibilitas: ${label}`} className="text-slate-500 inline-flex">
        <Icon size={14} />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100">
      <Icon size={14} />
      {label}
    </span>
  );
}
