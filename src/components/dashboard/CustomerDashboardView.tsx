import React, { useState, useMemo } from 'react';
import { Booking } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import { useAuth } from '../../lib/auth/authContext';
import { BOOKING_STATUS_CONFIG } from '../../lib/booking/stateMachine';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  User,
  Tag,
  Plus,
  Home,
  ShieldCheck,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface CustomerDashboardViewProps {
  onTrackBooking: (bookingId: string) => void;
  onPayBooking: (booking: Booking) => void;
  onNewBooking: () => void;
}

type TabType = 'orders' | 'addresses' | 'coupons';
type FilterTab = 'all' | 'unpaid' | 'active' | 'completed';

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  onTrackBooking,
  onPayBooking,
  onNewBooking,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orderFilter, setOrderFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allBookings = useMemo(() => {
    return dbStore.getBookings().map((b) => dbStore.populateBookingRelations(b));
  }, []);

  const addresses = useMemo(() => {
    return dbStore.getAddresses(user?.id);
  }, [user?.id]);

  const coupons = useMemo(() => {
    return dbStore.getCoupons().filter((c) => c.is_active);
  }, []);

  const myBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (orderFilter === 'unpaid' && b.status !== 'PENDING_PAYMENT') return false;
      if (
        orderFilter === 'active' &&
        !['CONFIRMED', 'SEARCHING_CLEANER', 'CLEANER_ASSIGNED', 'CLEANER_ON_THE_WAY', 'CLEANER_ARRIVED', 'IN_PROGRESS'].includes(b.status)
      ) {
        return false;
      }
      if (orderFilter === 'completed' && b.status !== 'COMPLETED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = b.booking_number.toLowerCase().includes(q);
        const matchSrv = b.service?.name.toLowerCase().includes(q);
        const matchAddr = b.address?.address.toLowerCase().includes(q);
        return matchNum || matchSrv || matchAddr;
      }

      return true;
    });
  }, [allBookings, orderFilter, searchQuery]);

  const unpaidCount = allBookings.filter((b) => b.status === 'PENDING_PAYMENT').length;
  const activeCount = allBookings.filter((b) =>
    ['CONFIRMED', 'SEARCHING_CLEANER', 'CLEANER_ASSIGNED', 'CLEANER_ON_THE_WAY', 'CLEANER_ARRIVED', 'IN_PROGRESS'].includes(b.status)
  ).length;
  const completedCount = allBookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-700/20">
              {user?.full_name ? user.full_name.charAt(0) : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {user?.full_name || 'Pelanggan Bersih.in'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Akun Pelanggan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.email} • {user?.phone || '081234567890'} • Wilayah Kab. Penajam Paser Utara
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onNewBooking}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Pesan Layanan Baru</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Sedang Berjalan
              </span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                {activeCount}
              </span>
              <span className="text-[10px] text-slate-500">Penugasan & proses kebersihan</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Menunggu Pembayaran
              </span>
              <span className={`text-2xl font-black mt-0.5 block ${unpaidCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {unpaidCount}
              </span>
              <span className="text-[10px] text-slate-500">Siap bayar via QRIS / VA</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pesanan Selesai
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
                {completedCount}
              </span>
              <span className="text-[10px] text-slate-500">Hunian & kantor bersih tuntas</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Pesanan Saya ({allBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Alamat Saya ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'coupons'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Kupon & Diskon ({coupons.length})</span>
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'unpaid', label: `Perlu Bayar ${unpaidCount ? `(${unpaidCount})` : ''}` },
                  { id: 'active', label: `Aktif ${activeCount ? `(${activeCount})` : ''}` },
                  { id: 'completed', label: 'Selesai' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id as FilterTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      orderFilter === tab.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nomor / layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Tidak ada pesanan ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Belum ada pesanan kebersihan di kategori ini. Buat reservasi dengan mudah untuk rumah atau kantor Anda di PPU.
                </p>
                <Button variant="primary" size="sm" onClick={onNewBooking}>
                  Pesan Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((b) => {
                  const meta = BOOKING_STATUS_CONFIG[b.status];
                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-800">
                            #{b.booking_number}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta?.badgeBg} ${meta?.badgeText}`}
                          >
                            {meta?.label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {b.property_type} • {b.property_area} m²
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-slate-900">
                            {b.service?.name || 'Pembersihan Rumah Berkala'}
                          </h4>
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              {b.scheduled_date} ({b.start_time} - {b.end_time} WITA)
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              Kec. {b.address?.district || 'Penajam'}, PPU
                            </span>
                          </div>
                        </div>

                        {b.cleaner && (
                          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                            <img
                              src={b.cleaner.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                              alt={b.cleaner.full_name}
                              className="w-5 h-5 rounded-full object-cover border border-slate-200"
                            />
                            <span>
                              Petugas Cleaner: <strong>{b.cleaner.full_name}</strong>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Total Bayar
                          </span>
                          <span className="text-base font-black text-emerald-600">
                            Rp {b.total_price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {b.status === 'PENDING_PAYMENT' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => onPayBooking(b)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-xs shadow-xs"
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1" />
                              Bayar
                            </Button>
                          )}

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onTrackBooking(b.id)}
                            className="text-xs"
                          >
                            Lacak
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative"
                >
                  {addr.is_default && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Alamat Utama
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <strong className="text-xs font-black text-slate-900">{addr.label}</strong>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {addr.address}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {addr.kelurahan ? `${addr.kelurahan}, ` : ''}Kec. {addr.district || 'Penajam'}, Kab. {addr.city} {addr.postal_code}
                  </p>
                  <div className="text-[11px] text-slate-600 pt-1">
                    Penerima: <strong>{addr.recipient_name}</strong> ({addr.phone})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {coupons.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-white p-5 rounded-2xl border border-dashed border-emerald-300 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                      {cp.code}
                    </span>
                    <strong className="block text-xs font-bold text-slate-900 pt-1">
                      {cp.type === 'PERCENTAGE' ? `Diskon ${cp.value}%` : `Potongan Rp ${cp.value.toLocaleString('id-ID')}`}
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      Min. Transaksi Rp {cp.minimum_transaction.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100/60 px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800/40">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                100% Karyawan Internal Resmi
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              Standar Kebersihan Konsisten Tanpa Pihak Ketiga
            </h3>
            <p className="text-xs text-emerald-100/80 max-w-xl">
              Seluruh petugas kebersihan berstatus staf karyawan tetap Bersih.in, bersertifikat BNSP, diverifikasi SKCK Kepolisian, dan terikat SOP ketat demi keamanan hunian Anda di Penajam Paser Utara.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onNewBooking}
            className="bg-white text-emerald-950 hover:bg-emerald-50 shrink-0 font-bold text-xs"
          >
            <span>Pesan Cleaning Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
