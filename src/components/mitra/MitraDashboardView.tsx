import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import { useAuth } from '../../lib/auth/authContext';
import { BOOKING_STATUS_CONFIG, transitionBookingStatus } from '../../lib/booking/stateMachine';
import { getPlatformSettings } from '../../lib/constants/platformSettings';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Wallet,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Landmark,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  ExternalLink,
  Power,
  RefreshCw,
  Home,
  CheckSquare,
  Info,
  BarChart3,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { MitraPerformanceChart } from './MitraPerformanceChart';

interface MitraDashboardViewProps {
  onTrackBooking?: (bookingId: string) => void;
  onSwitchToCustomerView?: () => void;
}

export const MitraDashboardView: React.FC<MitraDashboardViewProps> = ({
  onTrackBooking,
  onSwitchToCustomerView,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'completed' | 'earnings' | 'performance'>('active');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [selectedJobForFinish, setSelectedJobForFinish] = useState<Booking | null>(null);
  const [checklist, setChecklist] = useState({
    sampahDibuang: false,
    lantaiDipell: false,
    kamarMandiBersih: false,
    peralatanDirapikan: false,
    konfirmasiPelanggan: false,
  });

  const cleanerId = user?.id || 'usr-cleaner-1';
  const platformSettings = useMemo(() => getPlatformSettings(), [refreshTrigger]);
  const commissionRate = platformSettings.mitraCommissionPercent / 100;

  const allBookings = useMemo(() => {
    return dbStore.getBookings().map((b) => dbStore.populateBookingRelations(b));
  }, [refreshTrigger]);

  const myBookings = useMemo(() => {
    return allBookings.filter((b) => b.cleaner_id === cleanerId);
  }, [allBookings, cleanerId]);

  const activeTasks = useMemo(() => {
    return myBookings.filter((b) =>
      ['CLEANER_ASSIGNED', 'CLEANER_ON_THE_WAY', 'CLEANER_ARRIVED', 'IN_PROGRESS'].includes(b.status)
    );
  }, [myBookings]);

  const completedTasks = useMemo(() => {
    return myBookings.filter((b) => b.status === 'COMPLETED');
  }, [myBookings]);

  const availableOrders = useMemo(() => {
    return allBookings.filter(
      (b) =>
        (!b.cleaner_id || b.cleaner_id === '') &&
        (b.status === 'CONFIRMED' || b.status === 'SEARCHING_CLEANER')
    );
  }, [allBookings]);

  const totalCompletedEarnings = useMemo(() => {
    return completedTasks.reduce((acc, job) => {
      const share = Math.round(job.total_price * commissionRate);
      return acc + share;
    }, 0);
  }, [completedTasks, commissionRate]);

  const activePotentialEarnings = useMemo(() => {
    return activeTasks.reduce((acc, job) => {
      return acc + Math.round(job.total_price * commissionRate);
    }, 0);
  }, [activeTasks, commissionRate]);

  const handleTransition = (bookingId: string, nextStatus: BookingStatus, label: string) => {
    transitionBookingStatus(
      bookingId,
      nextStatus,
      cleanerId,
      `Status diperbarui oleh Mitra Cleaner (${user?.full_name || 'Ahmad Fauzi'}): ${label}`
    );
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleClaimOrder = (bookingId: string) => {
    dbStore.updateBooking(bookingId, { cleaner_id: cleanerId });
    transitionBookingStatus(
      bookingId,
      'CLEANER_ASSIGNED',
      cleanerId,
      `Pekerjaan diambil oleh Mitra Cleaner (${user?.full_name || 'Ahmad Fauzi'})`
    );
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('active');
  };

  const handleOpenFinishModal = (booking: Booking) => {
    setSelectedJobForFinish(booking);
    setChecklist({
      sampahDibuang: false,
      lantaiDipell: false,
      kamarMandiBersih: false,
      peralatanDirapikan: false,
      konfirmasiPelanggan: false,
    });
  };

  const handleConfirmFinish = () => {
    if (!selectedJobForFinish) return;
    transitionBookingStatus(
      selectedJobForFinish.id,
      'COMPLETED',
      cleanerId,
      `Pekerjaan selesai 100% oleh Mitra Cleaner (${user?.full_name || 'Ahmad Fauzi'}). Checklist SOP lengkap.`
    );
    setSelectedJobForFinish(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRequestPayout = () => {
    if (totalCompletedEarnings <= 0) return;
    setPayoutAmount(totalCompletedEarnings);
    setPayoutSuccess(true);
    setTimeout(() => {
      setIsPayoutModalOpen(false);
      setPayoutSuccess(false);
    }, 2500);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cleaner Profile & Duty Status Header */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span>AF</span>
                )}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                title={isOnline ? 'Status Online' : 'Status Offline'}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {user?.full_name || 'Ahmad Fauzi (Pro Cleaner)'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mitra Resmi Bersertifikasi PPU
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <strong className="text-slate-800">4.95</strong> (230 ulasan pelanggan)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Zona Operasional: <strong>Penajam & IKN Sepaku</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Bagi Hasil {platformSettings.mitraCommissionPercent}% Bersih
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors shadow-xs cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Status Tugas: {isOnline ? 'ONLINE (Siap Terima Order)' : 'ISTIRAHAT (Offline)'}</span>
            </button>

            {onSwitchToCustomerView && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSwitchToCustomerView}
                className="text-xs"
              >
                Kembali ke Beranda
              </Button>
            )}
          </div>
        </div>

        {/* 4 Financial & Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Pendapatan Selesai</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {formatRupiah(totalCompletedEarnings)}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Bagi hasil {platformSettings.mitraCommissionPercent}% ({completedTasks.length} selesai)
              </p>
              <button
                onClick={() => setActiveTab('performance')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Lihat Grafik &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Saldo Siap Dicairkan</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-teal-700 mt-2">
              {formatRupiah(totalCompletedEarnings)}
            </p>
            <div className="mt-2">
              <button
                onClick={() => setIsPayoutModalOpen(true)}
                disabled={totalCompletedEarnings <= 0}
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 underline disabled:opacity-50 cursor-pointer"
              >
                Tarik Saldo ke Rekening &rarr;
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Tugas Aktif Berjalan</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {activeTasks.length} <span className="text-sm font-normal text-slate-500">pekerjaan</span>
            </p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              Potensi pendapatan berjalan: {formatRupiah(activePotentialEarnings)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Order Baru Tersedia di PPU</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-700 mt-2">
              {availableOrders.length} <span className="text-sm font-normal text-slate-500">order terbuka</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Siap diklaim cleaner terdekat
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Tugas Aktif ({activeTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'available'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Order Baru di PPU ({availableOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Riwayat Selesai ({completedTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'earnings'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>Rekening & Payout</span>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'performance'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Grafik & Performa</span>
            </button>
          </div>

          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
            title="Muat Ulang Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: TUGAS AKTIF */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Tidak Ada Tugas Aktif Saat Ini</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Seluruh pekerjaan Anda telah selesai. Anda bisa mengecek tab "Order Baru di PPU" untuk mengambil pekerjaan yang tersedia atau menunggu penugasan dispatch.
                </p>
                <div className="mt-4">
                  <Button size="sm" onClick={() => setActiveTab('available')}>
                    Cek Order Tersedia di PPU ({availableOrders.length})
                  </Button>
                </div>
              </div>
            ) : (
              activeTasks.map((job) => {
                const statusMeta = BOOKING_STATUS_CONFIG[job.status] || {
                  label: job.status,
                  badgeBg: 'bg-slate-100',
                  badgeText: 'text-slate-700',
                  description: '',
                };

                const cleanerShare = Math.round(job.total_price * commissionRate);

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-slate-900">
                            #{job.booking_number}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.badgeBg} ${statusMeta.badgeText}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Layanan: <strong className="text-slate-800">{job.service?.name}</strong> •{' '}
                          {job.property_type} ({job.property_area} m²)
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-500 block">Penghasilan Mitra ({platformSettings.mitraCommissionPercent}%):</span>
                        <span className="text-lg font-black text-emerald-600">
                          {formatRupiah(cleanerShare)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Total Booking: {formatRupiah(job.total_price)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-600 mb-2">Tahapan Kerja Mitra:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div
                          className={`p-2 rounded-lg border ${
                            job.status === 'CLEANER_ASSIGNED'
                              ? 'bg-teal-600 text-white border-teal-700 font-bold shadow-xs'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          1. Ditugaskan
                        </div>

                        <div
                          className={`p-2 rounded-lg border ${
                            job.status === 'CLEANER_ON_THE_WAY'
                              ? 'bg-sky-600 text-white border-sky-700 font-bold shadow-xs'
                              : job.status === 'CLEANER_ARRIVED' || job.status === 'IN_PROGRESS' || job.status === 'COMPLETED'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          2. Menuju Lokasi (OTW)
                        </div>

                        <div
                          className={`p-2 rounded-lg border ${
                            job.status === 'CLEANER_ARRIVED'
                              ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs'
                              : job.status === 'IN_PROGRESS' || job.status === 'COMPLETED'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          3. Tiba di Alamat
                        </div>

                        <div
                          className={`p-2 rounded-lg border ${
                            job.status === 'IN_PROGRESS'
                              ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-xs animate-pulse'
                              : job.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          4. Sedang Mengerjakan
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Alamat Pelanggan di PPU</span>
                        </div>
                        <p className="text-slate-700 font-medium pl-6 leading-relaxed">
                          {job.address?.address || 'Jl. Propinsi KM 1,5, Kab. Penajam Paser Utara'}
                        </p>
                        <div className="pl-6 flex flex-wrap items-center gap-2 pt-1">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            Kecamatan: {job.address?.district || 'Penajam'}
                          </span>
                          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                            Kelurahan: {job.address?.kelurahan || 'Nipah-Nipah'}
                          </span>
                        </div>

                        <div className="pl-6 pt-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              (job.address?.address || '') + ' ' + (job.address?.district || '') + ' Penajam Paser Utara'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Buka Petunjuk Arah Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Jadwal & Kontak Pelanggan</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <p className="text-slate-800 font-semibold">
                            🗓️ {job.scheduled_date} • ⏰ {job.start_time} - {job.end_time} WITA
                          </p>
                          <p className="text-slate-600">
                            Nama Pemesan: <strong>{job.customer?.full_name || 'Budi Santoso'}</strong>
                          </p>
                          <p className="text-slate-600">
                            No. Telepon: <strong>{job.customer?.phone || '0812-3456-7890'}</strong>
                          </p>

                          {job.customer_notes && (
                            <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2 text-[11px]">
                              <strong>Catatan Pelanggan:</strong> "{job.customer_notes}"
                            </p>
                          )}

                          <div className="pt-2 flex items-center gap-2">
                            <a
                              href={`https://wa.me/62${(job.customer?.phone || '81234567890').replace(/^0/, '')}?text=${encodeURIComponent(
                                `Halo Bapak/Ibu ${job.customer?.full_name || ''}, saya ${user?.full_name || 'Mitra Bersih.in'} yang bertugas membersihkan hunian Anda untuk pesanan #${job.booking_number}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Hubungi via WhatsApp</span>
                            </a>

                            <a
                              href={`tel:${job.customer?.phone || '081234567890'}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Telepon</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {statusMeta.description}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {job.status === 'CLEANER_ASSIGNED' && (
                          <button
                            onClick={() =>
                              handleTransition(job.id, 'CLEANER_ON_THE_WAY', 'Mitra menuju alamat pelanggan')
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm shadow-sky-600/30 cursor-pointer"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Mulai Berangkat (OTW) 🛵</span>
                          </button>
                        )}

                        {job.status === 'CLEANER_ON_THE_WAY' && (
                          <button
                            onClick={() =>
                              handleTransition(job.id, 'CLEANER_ARRIVED', 'Mitra telah tiba di alamat')
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm shadow-indigo-600/30 cursor-pointer"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Konfirmasi Sudah Sampai di Lokasi 📍</span>
                          </button>
                        )}

                        {job.status === 'CLEANER_ARRIVED' && (
                          <button
                            onClick={() =>
                              handleTransition(job.id, 'IN_PROGRESS', 'Mitra mulai membersihkan ruangan')
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm shadow-amber-600/30 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Mulai Bersihkan Rumah 🧹</span>
                          </button>
                        )}

                        {job.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleOpenFinishModal(job)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-md shadow-emerald-600/30 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Selesaikan Pekerjaan (Finished) ✨</span>
                          </button>
                        )}

                        {onTrackBooking && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onTrackBooking(job.id)}
                            className="text-xs"
                          >
                            Lihat Timeline Pelanggan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: AVAILABLE ORDERS */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Order Siap Diambil di Wilayah Kabupaten Penajam Paser Utara</p>
                <p className="mt-0.5 text-amber-800">
                  Berikut adalah pesanan pelanggan yang telah lunas dan sedang menunggu mitra cleaner terdekat. Klik "Ambil Order Ini" untuk menerima pekerjaan secara langsung.
                </p>
              </div>
            </div>

            {availableOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Tidak Ada Order Terbuka Saat Ini</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Semua pesanan saat ini telah memiliki petugas cleaner. Pantau halaman ini untuk order baru dari warga Penajam Paser Utara & Kawasan IKN.
                </p>
              </div>
            ) : (
              availableOrders.map((order) => {
                const estimatedShare = Math.round(order.total_price * commissionRate);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-400 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600">
                          #{order.booking_number}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Lunas / Terverifikasi
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {order.service?.name}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {order.property_type} • Luas {order.property_area} m²
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {order.scheduled_date} ({order.start_time} - {order.end_time} WITA)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          Kec. {order.address?.district || 'Penajam'}, Kel. {order.address?.kelurahan || 'Nipah-Nipah'}
                        </span>
                      </div>

                      {order.customer_notes && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 px-2 py-1 rounded">
                          "{order.customer_notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 block">Bagi Hasil Mitra ({platformSettings.mitraCommissionPercent}%):</span>
                        <span className="text-lg font-black text-emerald-600">
                          {formatRupiah(estimatedShare)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleClaimOrder(order.id)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Ambil Order Ini &rarr;</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: COMPLETED TASKS */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Belum Ada Riwayat Pekerjaan Selesai</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Pekerjaan yang telah Anda selesaikan akan otomatis tercatat di sini beserta rincian bagi hasil yang Anda peroleh.
                </p>
              </div>
            ) : (
              completedTasks.map((job) => {
                const cleanerShare = Math.round(job.total_price * commissionRate);

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          #{job.booking_number}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Selesai 100%
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {job.service?.name}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        Tanggal Pengerjaan: <strong>{job.scheduled_date}</strong> • Alamat: {job.address?.address} (Kec. {job.address?.district || 'Penajam'})
                      </p>
                      <p className="text-xs text-slate-600">
                        Pelanggan: <strong>{job.customer?.full_name}</strong>
                      </p>
                    </div>

                    <div className="text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Bagi Hasil Diterima:</span>
                      <span className="text-base font-black text-emerald-600">
                        {formatRupiah(cleanerShare)}
                      </span>
                      <span className="text-[10px] text-teal-700 font-semibold block">
                        Status Saldo: Siap Dicairkan
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: EARNINGS & PAYOUT */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">Rekening Penerima Bagi Hasil</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                    Terverifikasi
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nama Bank:</span>
                    <span className="font-bold text-slate-800">Bankaltimtara (BPD Kaltim-Kaltara)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nomor Rekening:</span>
                    <span className="font-mono font-bold text-slate-800">0081234567</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nama Pemilik Rekening:</span>
                    <span className="font-bold text-slate-800">{user?.full_name || 'Ahmad Fauzi'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Jadwal Pencairan Otomatis:</span>
                    <span className="font-semibold text-emerald-700">Setiap Hari Kerja (18:00 WITA)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Ajukan Penarikan Saldo Sekarang</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Skema Transparansi Penghasilan {platformSettings.mitraCommissionPercent}/{platformSettings.platformFeePercent}</h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{platformSettings.mitraCommissionPercent}% Bagi Hasil:</strong> Mitra memperoleh {platformSettings.mitraCommissionPercent}% dari total nilai paket dan add-on yang dikerjakan.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>100% Uang Tip:</strong> Seluruh tipping dari pelanggan masuk penuh ke mitra tanpa potongan platform.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Subsidi Transportasi PPU:</strong> Ongkos transport wilayah IKN Sepaku & Penajam diberikan langsung ke mitra.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Bebas Biaya Admin Bank:</strong> Pencairan ke bank lokal seperti Bankaltimtara, Mandiri, BRI, dan BCA gratis biaya transfer.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <MitraPerformanceChart
              completedTasks={completedTasks}
              allCleanerBookings={myBookings}
              commissionRate={commissionRate}
            />
          </div>
        )}

        {/* TAB 5: PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <MitraPerformanceChart
              completedTasks={completedTasks}
              allCleanerBookings={myBookings}
              commissionRate={commissionRate}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Prioritas Dispatch PPU</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mitra dengan completion rate di atas <strong>95%</strong> dan rating bintang &gt; 4.8 mendapatkan prioritas penerimaan order otomatis di zona Kecamatan Penajam dan Sepaku.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-sky-700">
                  <CheckSquare className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Garansi SOP 100%</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menyelesaikan 5 checklist mutu sebelum konfirmasi pelanggan selesai meminimalisir komplain dan mempertahankan rasio penyelesaian tugas tetap prima.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-700">
                  <Wallet className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Bagi Hasil Adil {platformSettings.mitraCommissionPercent}/{platformSettings.platformFeePercent}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Platform Bersih.in menjamin transparansi perhitungan: setiap rupiah tercatat otomatis di dashboard dan langsung siap dicairkan tanpa potongan tersembunyi.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: SOP FINISH WORK CHECKLIST */}
      {selectedJobForFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Checklist SOP Selesai Kerja</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">#{selectedJobForFinish.booking_number}</span>
            </div>

            <p className="text-xs text-slate-500">
              Sebelum menandai pekerjaan selesai, mohon pastikan standar kebersihan Bersih.in terpenuhi:
            </p>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.lantaiDipell}
                  onChange={(e) => setChecklist({ ...checklist, lantaiDipell: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-800 font-medium">Lantai telah disapu & dipel hingga bersih tanpa residu</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.kamarMandiBersih}
                  onChange={(e) => setChecklist({ ...checklist, kamarMandiBersih: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-800 font-medium">Sanitasi kamar mandi & wastafel disikat higienis</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.sampahDibuang}
                  onChange={(e) => setChecklist({ ...checklist, sampahDibuang: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-800 font-medium">Semua sampah telah dikantongi dan dibuang ke tempat sampah</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.peralatanDirapikan}
                  onChange={(e) => setChecklist({ ...checklist, peralatanDirapikan: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-800 font-medium">Peralatan chemical & mesin vacuum disimpan rapi</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.konfirmasiPelanggan}
                  onChange={(e) => setChecklist({ ...checklist, konfirmasiPelanggan: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-800 font-medium">Pelanggan telah memeriksa hasil kerja atau diinfokan</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedJobForFinish(null)}
              >
                Batal
              </Button>

              <Button
                size="sm"
                onClick={handleConfirmFinish}
                disabled={
                  !checklist.lantaiDipell ||
                  !checklist.kamarMandiBersih ||
                  !checklist.sampahDibuang ||
                  !checklist.peralatanDirapikan ||
                  !checklist.konfirmasiPelanggan
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Konfirmasi Selesai & Kirim Laporan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PAYOUT WITHDRAWAL MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900">Penarikan Saldo Bagi Hasil</h3>
              </div>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {payoutSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Permintaan Penarikan Berhasil!</h4>
                <p className="text-xs text-slate-600">
                  Dana sebesar <strong>{formatRupiah(payoutAmount)}</strong> sedang diproses ke rekening <strong>Bankaltimtara 0081234567</strong> a.n. {user?.full_name || 'Ahmad Fauzi'}.
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Estimasi tiba: Maksimal 15 menit.</p>
              </div>
            ) : (
              <>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 space-y-1">
                  <span className="text-[11px] text-teal-700 font-medium">Jumlah Saldo Siap Ditarik:</span>
                  <p className="text-2xl font-black text-teal-900">
                    {formatRupiah(totalCompletedEarnings)}
                  </p>
                </div>

                <div className="text-xs space-y-2 text-slate-600">
                  <p><strong>Rekening Tujuan:</strong> Bankaltimtara • 0081234567</p>
                  <p><strong>Nama Penerima:</strong> {user?.full_name || 'Ahmad Fauzi'}</p>
                  <p><strong>Biaya Transfer:</strong> <span className="text-emerald-600 font-bold">GRATIS (Rp 0)</span></p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPayoutModalOpen(false)}
                  >
                    Tutup
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRequestPayout}
                    disabled={totalCompletedEarnings <= 0}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
                  >
                    Tarik {formatRupiah(totalCompletedEarnings)}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
