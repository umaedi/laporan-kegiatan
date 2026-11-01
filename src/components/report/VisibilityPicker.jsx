import React from 'react';
import { Lock, Users } from 'lucide-react';
import { VISIBILITY, VISIBILITY_OPTIONS } from '../../shared/enums';

const ICONS = {
  [VISIBILITY.PRIVATE]: Lock,
  [VISIBILITY.OPD]: Users
};

export default function VisibilityPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Siapa yang dapat melihat laporan ini?" className="grid grid-cols-2 gap-2">
      {VISIBILITY_OPTIONS.map(option => {
        const Icon = ICONS[option.id];
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all text-xs font-bold ${
              selected
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Icon size={20} className={selected ? 'text-emerald-200' : 'text-slate-500'} />
            <span>{option.label}</span>
            <span className={`text-xs font-normal ${selected ? 'text-emerald-100' : 'text-slate-500'}`}>
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
