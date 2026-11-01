import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, Award, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', icon: Home, end: true },
  { to: '/buat-laporan', label: 'Buat Kegiatan', icon: Camera },
  { to: '/apresiasi', label: 'Apresiasi', icon: Award },
  { to: '/profil', label: 'Profil', icon: User }
];

// `items` bisa diganti, misalnya untuk navigasi Panel Admin
export default function BottomNavbar({ items = NAV_ITEMS }) {
  return (
    // Navigasi mengambang: menempel di bawah layar dengan jarak kanan, kiri, dan bawah
    <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pointer-events-none">
      <nav className="pointer-events-auto grid grid-cols-4 items-center h-16 px-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full rounded-xl transition-colors ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[11px] font-bold leading-[18px] text-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </span>
                <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
