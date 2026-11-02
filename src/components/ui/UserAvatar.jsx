import React from 'react';
import { getInitials } from '../../lib/user';
import AuthImage from './AuthImage';

/**
 * Avatar bulat pegawai: foto wajah presensi dari `user.avatar_url` (endpoint backend ber-auth),
 * inisial nama selama memuat atau bila foto belum ada. `className` mengatur ukuran & teks.
 */
export default function UserAvatar({ user, className = 'w-9 h-9 text-sm' }) {
  const initials = (
    <div className={`rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 ${className}`}>
      {getInitials(user?.nama)}
    </div>
  );

  if (!user?.avatar_url) return initials;

  return (
    <AuthImage
      src={user.avatar_url}
      alt={`Foto ${user.nama}`}
      className={`rounded-full object-cover bg-slate-100 shrink-0 ${className}`}
      fallback={initials}
    />
  );
}
