import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Award, User, Camera } from 'lucide-react';

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 relative">
        {/* Tab 1: Beranda */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] mt-1">Beranda</span>
              {isActive && <span className="w-5 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>}
            </>
          )}
        </NavLink>

        {/* Tab 2: Kegiatan */}
        <NavLink
          to="/kegiatan"
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Layers size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] mt-1">Kegiatan</span>
              {isActive && <span className="w-5 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>}
            </>
          )}
        </NavLink>

        {/* Tab 3 / Center Elevated FAB: Buat Laporan / Foto */}
        <div className="flex-1 flex justify-center">
          <NavLink
            to="/buat-laporan"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white shadow-lg fab-glow ring-4 ring-white hover:scale-105 active:scale-95 transition-all duration-200"
            title="Buat Laporan Baru"
          >
            <Camera size={26} className="text-white group-hover:scale-110 transition-transform" />
          </NavLink>
        </div>

        {/* Tab 4: Apresiasi (Menggantikan Atasan) */}
        <NavLink
          to="/apresiasi"
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Award size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] mt-1">Apresiasi</span>
              {isActive && <span className="w-5 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>}
            </>
          )}
        </NavLink>

        {/* Tab 5: Profil */}
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            `flex flex-col items-center flex-1 py-1 transition-colors ${
              isActive ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] mt-1">Profil</span>
              {isActive && <span className="w-5 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
