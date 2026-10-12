import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import BottomNavbar from './BottomNavbar';

export default function MobileAppShell() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col relative pb-24 shadow-xs">
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 relative flex flex-col">
          <Outlet />
        </main>

        {/* Bottom Nav */}
        <BottomNavbar />
      </div>
    </div>
  );
}
