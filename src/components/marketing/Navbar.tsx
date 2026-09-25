import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, Landmark, Briefcase, LayoutDashboard, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/auth/authContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onStartBooking: () => void;
  onOpenOwnerSettings?: () => void;
  onOpenMitraRegister?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onStartBooking,
  onOpenOwnerSettings,
  onOpenMitraRegister,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                  Bersih<span className="text-emerald-600">.in</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 block -mt-1 tracking-wider uppercase">
                  Penajam Paser Utara
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'home' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => onNavigate('services')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'services' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Layanan
              </button>

              {/* Role-based Dashboard Link */}
              {isSuperAdmin ? (
                <button
                  onClick={() => onNavigate('superadmin')}
                  className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    currentView === 'superadmin'
                      ? 'text-white bg-purple-700 font-black ring-2 ring-purple-400'
                      : 'text-purple-900 bg-purple-100 hover:bg-purple-200 font-black'
                  }`}
                  title="Panel Master: Edit Layanan, Harga & Operasional"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Panel Master</span>
                </button>
              ) : user?.role === 'CLEANER' ? (
                <button
                  onClick={() => onNavigate('mitra-dashboard')}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'mitra-dashboard'
                      ? 'text-teal-700 bg-teal-50 font-black'
                      : 'text-teal-700 hover:bg-teal-50 font-bold'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>Tugas Cleaner</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('my-bookings')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'my-bookings' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Pesanan Saya
                </button>
              )}

              <button
                onClick={() => onNavigate('tracking')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'tracking' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Lacak Status
              </button>

              <button
                onClick={() => onNavigate('about')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'about' ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Tentang
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {onOpenMitraRegister && (
              <button
                onClick={onOpenMitraRegister}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-xs font-bold text-teal-800 transition-colors shadow-xs cursor-pointer"
                title="Daftar Menjadi Mitra Cleaner Resmi PPU"
              >
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                <span>Gabung Mitra Cleaner</span>
              </button>
            )}

            {isSuperAdmin && onOpenOwnerSettings && (
              <button
                onClick={onOpenOwnerSettings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-colors shadow-xs cursor-pointer"
                title="Buka Pengaturan Rekening Bank Owner & Payout"
              >
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rekening Owner</span>
              </button>
            )}

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onNavigate(
                      isSuperAdmin
                        ? 'superadmin'
                        : user.role === 'CLEANER'
                        ? 'mitra-dashboard'
                        : 'my-bookings'
                    )
                  }
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      {isSuperAdmin
                        ? 'SUPERADMIN'
                        : user.role === 'CLEANER'
                        ? 'MITRA CLEANER'
                        : 'Pelanggan'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onOpenLogin}>
                  Masuk
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenRegister}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold"
                >
                  Daftar Customer
                </Button>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={onStartBooking}
              className="gap-2 shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700"
            >
              <span>Pesan Cleaning</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="primary" size="sm" onClick={onStartBooking}>
              Pesan
            </Button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1 text-sm font-medium">
            <button
              onClick={() => { onNavigate('home'); setShowMobileMenu(false); }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => { onNavigate('services'); setShowMobileMenu(false); }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 cursor-pointer"
            >
              Layanan
            </button>

            {isSuperAdmin ? (
              <button
                onClick={() => { onNavigate('superadmin'); setShowMobileMenu(false); }}
                className="px-3 py-2.5 rounded-xl text-left bg-purple-100 font-black text-purple-900 flex items-center gap-2 border border-purple-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>Panel Master (Edit Layanan & Harga)</span>
              </button>
            ) : user?.role === 'CLEANER' ? (
              <button
                onClick={() => { onNavigate('mitra-dashboard'); setShowMobileMenu(false); }}
                className="px-3 py-2 rounded-lg text-left bg-teal-50 font-black text-teal-800 flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>Dashboard Karyawan Cleaner</span>
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('my-bookings'); setShowMobileMenu(false); }}
                className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 font-medium text-emerald-700 cursor-pointer"
              >
                Pesanan Saya
              </button>
            )}

            <button
              onClick={() => { onNavigate('tracking'); setShowMobileMenu(false); }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 font-medium text-emerald-700 cursor-pointer"
            >
              Lacak Status Pesanan
            </button>

            <button
              onClick={() => { onNavigate('about'); setShowMobileMenu(false); }}
              className="px-3 py-2 rounded-lg text-left hover:bg-slate-50 cursor-pointer"
            >
              Tentang Kami
            </button>

            {onOpenMitraRegister && (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenMitraRegister();
                }}
                className="px-3 py-2 rounded-lg text-left text-teal-700 font-bold bg-teal-50 flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>Daftar Mitra Cleaner PPU</span>
              </button>
            )}
          </div>

          {isSuperAdmin && onOpenOwnerSettings && (
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenOwnerSettings();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan Rekening Owner & Keuangan</span>
              </button>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Keluar Akun
              </button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-1/2" onClick={() => { onOpenLogin(); setShowMobileMenu(false); }}>
                  Masuk
                </Button>
                <Button variant="primary" size="sm" className="w-1/2" onClick={() => { onOpenRegister(); setShowMobileMenu(false); }}>
                  Daftar
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
