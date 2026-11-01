import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Layers, Users, Smartphone, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminDashboard } from '../../hooks/useAdmin';
import BottomNavbar from '../layout/BottomNavbar';

// Layout Panel Kepala Dinas: semua halaman di bawah /admin
export default function AdminShell() {
  const { user, logout } = useAuth();
  const { data: dashboard } = useAdminDashboard();
  const pendingCount = dashboard?.metrics.pending ?? 0;

  const navItems = [
    { to: '/admin', label: 'Dasbor', icon: LayoutDashboard, end: true },
    { to: '/admin/tinjau', label: 'Tinjau', icon: ClipboardCheck, badge: pendingCount },
    { to: '/admin/laporan', label: 'Laporan', icon: Layers },
    { to: '/admin/pegawai', label: 'Pegawai', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col relative pb-28 shadow-xs">
        <header className="sticky top-0 z-30 bg-emerald-900 text-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-200">Panel Kepala Dinas</p>
              <h1 className="text-base font-extrabold tracking-tight truncate">{user.name}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/"
                className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
              >
                <Smartphone size={16} />
                Ke Aplikasi
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Keluar"
                title="Keluar"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>

        <BottomNavbar items={navItems} />
      </div>
    </div>
  );
}
