import React, { useState } from 'react';
import { Menu, Search, Bell, User, LogOut, Radio } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

export default function AppHeader() {
  const { toggleMobileSidebar } = useSidebar();
  const { user, logout, showFlash } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    setShowProfileMenu(false);
    if (showFlash) {
      showFlash('Berhasil keluar dari akun', 'info');
    }
    logout();
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 fixed top-0 left-0 right-0 z-40 lg:sticky lg:top-0 w-full px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#0284C7] hover:bg-[#E0F2FE] transition-colors outline-none cursor-pointer"
        >
          <Menu size={22} />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:flex items-center">
          <Search size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari Kapal, No. Clearance, Manifest..."
            className="w-64 md:w-80 pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-100/80 border border-slate-200/60 focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 outline-none transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right: Server Status, Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* KSOP System Online Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
          <Radio size={14} className="animate-pulse text-emerald-500" />
          <span>Sistem Online</span>
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-600 hover:text-[#0284C7] hover:bg-[#E0F2FE] transition-colors outline-none cursor-pointer"
          title="Notifikasi Inspeksi"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E91E63] ring-2 ring-white" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#0284C7]/20">
              {(user?.nama_lengkap || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left pr-1">
              <span className="text-xs font-extrabold text-slate-800 leading-tight truncate max-w-[140px]">
                {user?.nama_lengkap || user?.username || 'Petugas KSOP'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium capitalize">
                {user?.role || user?.jabatan || 'Syahbandar Utama'}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.nama_lengkap || user?.username || 'Petugas KSOP'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || (user?.username ? `@${user.username}` : 'ksop.officer@dephub.go.id')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
