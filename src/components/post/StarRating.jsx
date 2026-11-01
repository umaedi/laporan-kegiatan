import React from 'react';
import { Star } from 'lucide-react';

// Tampilan nilai bintang 1-5. Jika `onChange` diberikan, bintang bisa diketuk untuk menilai.
export default function StarRating({ value = 0, onChange, size = 16 }) {
  const interactive = typeof onChange === 'function';

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Beri nilai bintang' : `Nilai ${value} dari 5 bintang`}
    >
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= value;
        const icon = (
          <Star
            size={size}
            className={filled ? 'text-amber-400' : 'text-slate-300'}
            fill={filled ? 'currentColor' : 'none'}
          />
        );

        if (!interactive) return <span key={star}>{icon}</span>;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} bintang`}
            onClick={() => onChange(star)}
            className="p-1 rounded-md hover:bg-amber-50 active:scale-90 transition-transform"
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
