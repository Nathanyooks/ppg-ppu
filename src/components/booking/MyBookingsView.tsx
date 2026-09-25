import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import { useAuth } from '../../lib/auth/authContext';
import { BOOKING_STATUS_CONFIG } from '../../lib/booking/stateMachine';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface MyBookingsViewProps {
  onTrackBooking: (bookingId: string) => void;
  onPayBooking: (booking: Booking) => void;
  onNewBooking: () => void;
}

type FilterTab = 'all' | 'unpaid' | 'active' | 'completed' | 'cancelled';

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onTrackBooking,
  onPayBooking,
  onNewBooking,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allBookings = useMemo(() => {
    return dbStore.getBookings().map((b) => dbStore.populateBookingRelations(b));
  }, []);

  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      if (activeTab === 'unpaid' && booking.status !== 'PENDING_PAYMENT') return false;
      if (
        activeTab === 'active' &&
        !['CONFIRMED', 'SEARCHING_CLEANER', 'CLEANER_ASSIGNED', 'CLEANER_ON_THE_WAY', 'CLEANER_ARRIVED', 'IN_PROGRESS'].includes(booking.status)
      ) {
        return false;
      }
      if (activeTab === 'completed' && booking.status !== 'COMPLETED') return false;
      if (activeTab === 'cancelled' && !['CANCELLED', 'REFUNDED'].includes(booking.status)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = booking.booking_number.toLowerCase().includes(q);
        const matchesService = booking.service?.name.toLowerCase().includes(q);
        const matchesAddress = booking.address?.address.toLowerCase().includes(q);
        return matchesNum || matchesService || matchesAddress;
      }

      return true;
    });
  }, [allBookings, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Kelola Jadwal & Riwayat
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daftar Pesanan Saya
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Semua reservasi kebersihan hunian & kantor Anda di Kabupaten Penajam Paser Utara.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={onNewBooking}>
            + Buat Pesanan Baru
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'unpaid', label: 'Menunggu Bayar' },
              { id: 'active', label: 'Sedang Berjalan' },
              { id: 'completed', label: 'Selesai' },
              { id: 'cancelled', label: 'Dibatalkan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Tidak Ada Pesanan Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada catatan pemesanan pada kategori ini. Silakan buat pesanan baru untuk mulai menggunakan layanan kami.
            </p>
            <Button variant="primary" size="md" onClick={onNewBooking}>
              Pesan Layanan Kebersihan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const meta = BOOKING_STATUS_CONFIG[booking.status];
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        #{booking.booking_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta?.badgeBg} ${meta?.badgeText}`}
                      >
                        {meta?.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {booking.property_type} ({booking.property_area} m²)
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-base text-slate-900">
                        {booking.service?.name || 'Pembersihan Rumah Berkala'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {booking.scheduled_date} ({booking.start_time} – {booking.end_time} WITA)
                        </span>

                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {booking.address?.kelurahan ? `${booking.address.kelurahan}, ` : ''}Kec. {booking.address?.district || 'Penajam'}, {booking.address?.city || 'Penajam Paser Utara'}
                        </span>
                      </div>
                    </div>

                    {booking.cleaner && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                        <img
                          src={booking.cleaner.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                          alt={booking.cleaner.full_name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span>
                          Mitra Bertugas: <strong>{booking.cleaner.full_name}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Biaya
                      </span>
                      <span className="text-lg font-black text-emerald-600">
                        Rp {booking.total_price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'PENDING_PAYMENT' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onPayBooking(booking)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5 mr-1" />
                          Bayar
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onTrackBooking(booking.id)}
                        className="text-xs"
                      >
                        Lacak Status
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
