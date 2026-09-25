import React, { useState, useEffect, useMemo } from 'react';
import { Booking, BookingStatus } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import { BOOKING_STATUS_CONFIG, transitionBookingStatus } from '../../lib/booking/stateMachine';
import { useAuth } from '../../lib/auth/authContext';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Check,
  Truck,
  Home,
  Star,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface OrderTrackingViewProps {
  initialBookingId?: string;
  onOpenPaymentModal: (booking: Booking) => void;
  onStartNewBooking: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialBookingId,
  onOpenPaymentModal,
  onStartNewBooking,
}) => {
  const { user } = useAuth();
  const [bookingNumberInput, setBookingNumberInput] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    initialBookingId || dbStore.getBookings()[0]?.id || ''
  );
  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  useEffect(() => {
    if (initialBookingId) {
      setSelectedBookingId(initialBookingId);
    }
  }, [initialBookingId]);

  const currentBooking = useMemo(() => {
    if (!selectedBookingId) return null;
    return dbStore.getBookingById(selectedBookingId) || null;
  }, [selectedBookingId]);

  const allUserBookings = useMemo(() => {
    return dbStore.getBookings().filter((b) => b.customer_id === user?.id || !user?.id);
  }, [user?.id]);

  const statusHistory = useMemo(() => {
    if (!currentBooking) return [];
    return dbStore.getStatusHistory(currentBooking.id);
  }, [currentBooking]);

  const statusMeta = currentBooking ? BOOKING_STATUS_CONFIG[currentBooking.status] : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSearch(null);
    if (!bookingNumberInput.trim()) return;

    const found = dbStore.getBookingByNumber(bookingNumberInput.trim());
    if (found) {
      setSelectedBookingId(found.id);
    } else {
      setErrorSearch(`Nomor pesanan "${bookingNumberInput}" tidak ditemukan.`);
    }
  };

  const handleSimulateStatusChange = (nextStatus: BookingStatus, notes: string) => {
    if (!currentBooking) return;
    transitionBookingStatus(currentBooking.id, nextStatus, user?.id || 'demo-actor', notes);
    setSelectedBookingId(currentBooking.id);
  };

  const stepsList = [
    { key: 'PENDING_PAYMENT', title: 'Pesanan Dibuat', desc: 'Menunggu verifikasi pembayaran Midtrans' },
    { key: 'CONFIRMED', title: 'Pembayaran Lunas', desc: 'Dana terverifikasi di Midtrans gateway' },
    { key: 'CLEANER_ASSIGNED', title: 'Mitra Cleaner Ditugaskan', desc: 'Cleaner siap dengan SOP & chemical hotel' },
    { key: 'CLEANER_ON_THE_WAY', title: 'Mitra Menuju Lokasi', desc: 'Estimasi kedatangan sesuai slot jam WITA' },
    { key: 'IN_PROGRESS', title: 'Pembersihan Berlangsung', desc: 'Pengerjaan sesuai checklist ruang' },
    { key: 'COMPLETED', title: 'Pembersihan Selesai', desc: 'Garansi kepuasan 24 jam & laporan kerja' },
  ];

  const getCurrentStepIndex = (status: BookingStatus): number => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 0;
      case 'CONFIRMED':
      case 'SEARCHING_CLEANER':
        return 1;
      case 'CLEANER_ASSIGNED':
        return 2;
      case 'CLEANER_ON_THE_WAY':
      case 'CLEANER_ARRIVED':
        return 3;
      case 'IN_PROGRESS':
        return 4;
      case 'COMPLETED':
      case 'DISPUTED':
        return 5;
      case 'CANCELLED':
      case 'REFUND_PENDING':
      case 'REFUNDED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = currentBooking ? getCurrentStepIndex(currentBooking.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Live Order Tracker WITA
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pelacakan Status Pesanan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau perjalanan pesanan Anda secara real-time dari verifikasi pembayaran hingga mitra selesai membersihkan.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari No. Pesanan (BRS-...)"
                value={bookingNumberInput}
                onChange={(e) => setBookingNumberInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>
            <Button variant="primary" size="md" type="submit">
              Lacak
            </Button>
          </form>
        </div>

        {errorSearch && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorSearch}</span>
          </div>
        )}

        {allUserBookings.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Pesanan Lainnya:
            </span>
            {allUserBookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBookingId(b.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedBookingId === b.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                #{b.booking_number}
              </button>
            ))}
          </div>
        )}

        {!currentBooking ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <Clock className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Pesanan yang Dipilih</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Silakan lakukan pemesanan layanan kebersihan pertama Anda untuk melihat pelacakan langsung.
            </p>
            <Button variant="primary" size="md" onClick={onStartNewBooking}>
              Pesan Layanan Sekarang
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left 2 Cols */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                        #{currentBooking.booking_number}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          statusMeta?.badgeBg
                        } ${statusMeta?.badgeText}`}
                      >
                        {statusMeta?.label}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Dibuat pada{' '}
                      {new Date(currentBooking.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      WITA
                    </span>
                  </div>

                  {currentBooking.status === 'PENDING_PAYMENT' && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onOpenPaymentModal(currentBooking)}
                      className="bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold text-xs"
                    >
                      <CreditCard className="w-4 h-4 mr-1.5" />
                      Bayar Sekarang (Midtrans)
                    </Button>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-xs font-bold text-emerald-950">
                      {statusMeta?.label}
                    </strong>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                      {statusMeta?.description}
                    </p>
                  </div>
                </div>

                {/* 6-Step Visual Timeline */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                    Perjalanan Layanan Anda:
                  </h3>

                  <div className="space-y-6">
                    {stepsList.map((step, idx) => {
                      const isPast = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          {idx < stepsList.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                                isPast ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            />
                          )}

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs transition-all ${
                              isPast
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : isCurrent
                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 animate-pulse'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                          </div>

                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-sm font-bold ${
                                  isCurrent
                                    ? 'text-emerald-950 font-black'
                                    : isPast
                                    ? 'text-slate-900'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.title}
                              </h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Sedang Berlangsung
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs mt-0.5 ${
                                isCurrent ? 'text-slate-700' : isPast ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Log Riwayat Status Pemesanan
                </h3>

                <div className="space-y-3">
                  {statusHistory.length === 0 ? (
                    <div className="text-xs text-slate-400 py-2">
                      Belum ada pembaruan log status lanjutan.
                    </div>
                  ) : (
                    statusHistory.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{hist.notes}</span>
                          <span className="text-[11px] text-slate-400">
                            Diperbarui oleh: <strong>{hist.changed_by}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {new Date(hist.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          WITA
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* QA Controller */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      QA Simulation Controller
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Uji Transisi Status Langsung</span>
                </div>
                <p className="text-xs text-slate-300">
                  Gunakan tombol simulasi di bawah untuk menguji pergerakan status pesanan:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => handleSimulateStatusChange('CONFIRMED', 'Pembayaran diverifikasi via Midtrans Gateway')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 text-center"
                  >
                    💳 Bayar Lunas
                  </button>

                  <button
                    onClick={() => handleSimulateStatusChange('CLEANER_ASSIGNED', 'Mitra cleaner ditugaskan dari pool')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 text-center"
                  >
                    👤 Tugaskan Mitra
                  </button>

                  <button
                    onClick={() => handleSimulateStatusChange('CLEANER_ON_THE_WAY', 'Mitra berangkat menuju lokasi di WITA')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 text-center"
                  >
                    🛵 Mitra Jalan
                  </button>

                  <button
                    onClick={() => handleSimulateStatusChange('IN_PROGRESS', 'Mitra tiba & SOP pembersihan dimulai')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 text-center"
                  >
                    🧹 Mulai Bersih
                  </button>

                  <button
                    onClick={() => handleSimulateStatusChange('COMPLETED', 'Pembersihan tuntas, garansi 24 jam aktif')}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white text-center col-span-2 sm:col-span-2"
                  >
                    ✅ Selesai (Completed)
                  </button>

                  <button
                    onClick={() => handleSimulateStatusChange('CANCELLED', 'Pesanan dibatalkan oleh pengguna')}
                    className="p-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-xs font-bold text-rose-200 border border-rose-800 text-center col-span-2 sm:col-span-2"
                  >
                    ❌ Batalkan Pesanan
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Cleaner Card & Order Details */}
            <div className="space-y-6">
              {currentBooking.cleaner ? (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Mitra Cleaner Bertugas
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Verified Mitra
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={currentBooking.cleaner.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                      alt={currentBooking.cleaner.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {currentBooking.cleaner.full_name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>4.9 / 5.0</span>
                        <span className="text-slate-400 font-normal ml-1">
                          ({currentBooking.cleaner.cleaner_profile?.total_jobs || 148} Order Selesai)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Zona Area: Kabupaten Penajam Paser Utara (PPU)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`https://wa.me/62${(currentBooking.cleaner.phone || '085648373440').replace(/^0/, '')}?text=Halo%20${encodeURIComponent(currentBooking.cleaner.full_name)},%20saya%20pemesan%20layanan%20Bersih.in%20dengan%20nomor%20pesanan%20${currentBooking.booking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat WhatsApp
                    </a>

                    <a
                      href={`tel:${currentBooking.cleaner.phone || '085648373440'}`}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Telepon Mitra"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 border border-dashed border-slate-300 text-center space-y-2">
                  <User className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-700">Mitra Cleaner Sedang Disiapkan</h4>
                  <p className="text-[11px] text-slate-500">
                    Mitra terdekat di wilayah Anda akan otomatis ditugaskan segera setelah pembayaran lunas.
                  </p>
                  <a
                    href="https://wa.me/6285648373440?text=Halo%20CS%20Bersih.in,%20saya%20menanyakan%20status%20penugasan%20mitra%20pesanan%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline pt-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi CS via WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Rincian Pemesanan
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-slate-500">Paket Layanan</span>
                    <strong className="text-slate-900 font-bold">
                      {currentBooking.service?.name || 'Deep Cleaning Spesialis'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-slate-500">Properti</span>
                    <span className="font-semibold text-slate-800">
                      {currentBooking.property_type} ({currentBooking.property_area} m²)
                    </span>
                  </div>

                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <span className="text-slate-500">Jadwal WITA</span>
                    <div className="text-right">
                      <strong className="text-slate-900 block font-bold">
                        {currentBooking.scheduled_date}
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        {currentBooking.start_time} – {currentBooking.end_time} WITA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <span className="text-slate-500">Alamat Pengerjaan</span>
                    <div className="text-right max-w-[180px]">
                      <strong className="text-slate-900 block font-bold">
                        {currentBooking.address?.district ? `Kec. ${currentBooking.address.district}` : 'Penajam Paser Utara'}
                      </strong>
                      <span className="text-slate-500 text-[11px] line-clamp-2">
                        {currentBooking.address?.address}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Tarif Dasar Layanan</span>
                      <span>Rp {currentBooking.base_price.toLocaleString('id-ID')}</span>
                    </div>
                    {currentBooking.addon_price > 0 && (
                      <div className="flex justify-between">
                        <span>Tambahan Add-on</span>
                        <span>Rp {currentBooking.addon_price.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Biaya Transportasi Wilayah</span>
                      <span>Rp {currentBooking.transport_fee.toLocaleString('id-ID')}</span>
                    </div>
                    {currentBooking.discount_amount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Diskon Kupon Promo</span>
                        <span>-Rp {currentBooking.discount_amount.toLocaleString('id-ID')}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-black text-slate-900">
                      <span>Total Pembayaran</span>
                      <span className="text-emerald-600">
                        Rp {currentBooking.total_price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
