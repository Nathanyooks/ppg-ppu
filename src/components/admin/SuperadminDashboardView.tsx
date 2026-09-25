import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, MitraApplication, Service } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import { useAuth } from '../../lib/auth/authContext';
import { BOOKING_STATUS_CONFIG, transitionBookingStatus } from '../../lib/booking/stateMachine';
import { getOwnerBankAccount } from '../../lib/payment/ownerBankConfig';
import {
  ShieldAlert,
  Users,
  Calendar,
  Landmark,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MapPin,
  Search,
  Filter,
  Check,
  UserCheck,
  CreditCard,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  FileCheck,
  Settings,
  Sparkles,
  Percent,
  Tag,
  Sliders,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ServicesManagerTab } from './ServicesManagerTab';
import { PlatformRevenueTab } from './PlatformRevenueTab';
import { CouponsManagerTab } from './CouponsManagerTab';
import { EditServiceModal } from './EditServiceModal';
import { EditPricingModal } from './EditPricingModal';
import { getPlatformSettings } from '../../lib/constants/platformSettings';

interface SuperadminDashboardViewProps {
  onOpenOwnerSettings: () => void;
  onTrackBooking: (bookingId: string) => void;
  onSwitchToCustomerView?: () => void;
}

type AdminTab =
  | 'services-pricing'
  | 'revenue-share'
  | 'mitra-verif'
  | 'bookings'
  | 'active-mitra'
  | 'coupons'
  | 'owner-finance';
type ApplicationFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

export const SuperadminDashboardView: React.FC<SuperadminDashboardViewProps> = ({
  onOpenOwnerSettings,
  onTrackBooking,
  onSwitchToCustomerView,
}) => {
  const { user, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('services-pricing');
  const [appFilter, setAppFilter] = useState<ApplicationFilter>('PENDING');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [selectedServiceToEdit, setSelectedServiceToEdit] = useState<Service | null>(null);
  const [isEditPricingModalOpen, setIsEditPricingModalOpen] = useState(false);

  const ownerConfig = getOwnerBankAccount();

  const applications = useMemo(() => {
    return dbStore.getMitraApplications();
  }, [refreshTrigger]);

  const allBookings = useMemo(() => {
    return dbStore.getBookings().map((b) => dbStore.populateBookingRelations(b));
  }, [refreshTrigger]);

  const activeCleaners = useMemo(() => {
    return dbStore.getCleaners();
  }, [refreshTrigger]);

  const platformSettings = useMemo(() => {
    return getPlatformSettings();
  }, [refreshTrigger]);

  const services = useMemo(() => {
    return dbStore.getServices();
  }, [refreshTrigger]);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (appFilter !== 'all' && app.status !== appFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.full_name.toLowerCase().includes(q) ||
          app.nik.includes(q) ||
          app.phone.includes(q) ||
          app.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, appFilter, searchQuery]);

  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (bookingStatusFilter !== 'ALL' && b.status !== bookingStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.booking_number.toLowerCase().includes(q) ||
          (b.service?.name || '').toLowerCase().includes(q) ||
          (b.customer?.full_name || '').toLowerCase().includes(q) ||
          (b.address?.district || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allBookings, bookingStatusFilter, searchQuery]);

  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;
  const totalRevenue = allBookings.reduce((sum, b) => (b.payment_status === 'PAID' ? sum + b.total_price : sum), 0);

  const handleApproveMitra = (appId: string) => {
    dbStore.approveMitraApplication(appId);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRejectMitra = (appId: string) => {
    const notes = prompt('Alasan penolakan berkas calon mitra (opsional):', 'Persyaratan dokumen belum lengkap');
    if (notes !== null) {
      dbStore.rejectMitraApplication(appId, notes);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleUpdateBookingStatus = (bookingId: string, nextStatus: BookingStatus) => {
    const b = dbStore.getBookingById(bookingId);
    if (!b) return;

    let cleanerId = b.cleaner_id;
    if (nextStatus === 'CLEANER_ASSIGNED' && !cleanerId) {
      const cleaner = dbStore.getCleaners()[0];
      cleanerId = cleaner?.id || 'usr-cleaner-1';
      dbStore.updateBooking(bookingId, { cleaner_id: cleanerId });
    }

    transitionBookingStatus(
      bookingId,
      nextStatus,
      user?.id || 'usr-superadmin-1',
      `Status diperbarui oleh Superadmin (${user?.full_name || 'Admin'})`
    );
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Superadmin Top Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                SUPERADMIN CONSOLE
              </span>
              <span className="text-slate-400 text-xs">• Kabupaten Penajam Paser Utara</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Konsol Akun Master (Superadmin)
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Hak akses penuh: Edit segala jenis layanan, ubah harga paket, atur prosentase bagi hasil mitra, biaya transport kecamatan, dan kupon promo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedServiceToEdit(services[0] || null);
                setIsEditServiceModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md ring-2 ring-emerald-300/40 cursor-pointer"
              title="Buka Popup Edit Layanan, Harga & Durasi"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Modal Edit Layanan</span>
            </button>

            <button
              onClick={() => setIsEditPricingModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white shadow-md ring-2 ring-purple-400/40 cursor-pointer"
              title="Buka Popup Edit Prosentase Bagi Hasil & Tarif"
            >
              <Percent className="w-4 h-4 text-purple-200" />
              <span>Modal Edit Bagi Hasil ({platformSettings.mitraCommissionPercent}%)</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenOwnerSettings}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold text-xs"
            >
              <Landmark className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span>Rekening Owner</span>
            </Button>

            {onSwitchToCustomerView && (
              <button
                onClick={onSwitchToCustomerView}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            )}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pendaftaran Mitra Baru
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">
                {pendingAppsCount} Calon
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500">Menunggu verifikasi NIK & dokumen</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Omzet Transaksi
            </span>
            <span className="text-2xl font-black text-emerald-600 block">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
            <p className="text-[11px] text-slate-500">Pembayaran QRIS & VA Midtrans</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Bagi Hasil Mitra / Owner
              </span>
              <button
                onClick={() => setIsEditPricingModalOpen(true)}
                className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 transition-colors cursor-pointer"
              >
                Edit Modal
              </button>
            </div>
            <span className="text-2xl font-black text-slate-900 block">
              {platformSettings.mitraCommissionPercent}% <span className="text-sm font-normal text-slate-400">/ {platformSettings.platformFeePercent}%</span>
            </span>
            <p className="text-[11px] text-slate-500">Mitra: {platformSettings.mitraCommissionPercent}% • Platform: {platformSettings.platformFeePercent}%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Katalog Layanan & Mitra
              </span>
              <button
                onClick={() => {
                  setSelectedServiceToEdit(services[0] || null);
                  setIsEditServiceModalOpen(true);
                }}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors cursor-pointer"
              >
                Edit Modal
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-600">
                {services.length} Layanan
              </span>
              <span className="text-xs font-bold text-slate-500">
                {activeCleaners.length} Mitra
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Standby di 4 Kecamatan PPU</p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-xs gap-4 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('services-pricing')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'services-pricing'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Layanan & Tarif SOP ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue-share')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'revenue-share'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>Bagi Hasil ({platformSettings.mitraCommissionPercent}%) & Tarif Wilayah</span>
          </button>

          <button
            onClick={() => setActiveTab('mitra-verif')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'mitra-verif'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Verifikasi Calon Mitra</span>
            {pendingAppsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingAppsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Manajemen Pesanan ({allBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active-mitra')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'active-mitra'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Daftar Mitra Aktif ({activeCleaners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Kupon & Voucher</span>
          </button>

          <button
            onClick={() => setActiveTab('owner-finance')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'owner-finance'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Rekening Owner & Keuangan</span>
          </button>
        </div>

        {activeTab === 'services-pricing' && (
          <ServicesManagerTab onDataChanged={() => setRefreshTrigger((prev) => prev + 1)} />
        )}

        {activeTab === 'revenue-share' && (
          <PlatformRevenueTab onSettingsSaved={() => setRefreshTrigger((prev) => prev + 1)} />
        )}

        {activeTab === 'mitra-verif' && (
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'PENDING', label: `Menunggu Verifikasi (${pendingAppsCount})` },
                  { id: 'APPROVED', label: 'Telah Disetujui' },
                  { id: 'REJECTED', label: 'Ditolak' },
                  { id: 'all', label: 'Semua Pelamar' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAppFilter(f.id as ApplicationFilter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      appFilter === f.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, NIK, HP, kecamatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {filteredApps.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">
                  Tidak ada pendaftaran mitra di kategori ini
                </h3>
                <p className="text-xs text-slate-500">
                  Pelamar baru yang mengisi formulir pendaftaran mitra akan muncul di sini secara otomatis.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-base text-slate-900">
                          {app.full_name}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {app.status === 'APPROVED'
                            ? 'Aktif & Disetujui'
                            : app.status === 'PENDING'
                            ? 'Menunggu Review'
                            : 'Ditolak'}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          NIK: {app.nik}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>WhatsApp: <strong>{app.phone}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Email: {app.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                              Kec. <strong>{app.district}</strong> ({app.kelurahan || 'Domisili'})
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                              Bank: <strong>{app.bank_name}</strong> - {app.bank_account} (A/N {app.bank_holder})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                              SIM C: {app.has_sim_c ? 'Ada' : 'Tidak'} • SKCK: {app.has_skck ? 'Ada' : 'Tidak'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-400">
                              Daftar: {new Date(app.created_at).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                        <span className="font-bold text-slate-800 block">
                          Pengalaman: {app.experience}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.specializations.map((spec) => (
                            <span
                              key={spec}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-600 font-semibold"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                        {app.notes && (
                          <p className="text-[11px] text-slate-500 italic mt-1">
                            Catatan: {app.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                      {app.status === 'PENDING' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveMitra(app.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Setujui & Aktifkan
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRejectMitra(app.id)}
                            className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Tolak
                          </Button>
                        </>
                      ) : (
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-slate-500">
                            Status: {app.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAJEMEN PESANAN & DISPATCH */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
                <span className="text-slate-400">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 cursor-pointer"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
                  <option value="CONFIRMED">Terkonfirmasi (Sudah Bayar)</option>
                  <option value="CLEANER_ASSIGNED">Mitra Ditugaskan</option>
                  <option value="IN_PROGRESS">Sedang Dikerjakan</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pesanan / pelanggan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredBookings.map((b) => {
                const meta = BOOKING_STATUS_CONFIG[b.status];
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          #{b.booking_number}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta?.badgeBg} ${meta?.badgeText}`}
                        >
                          {meta?.label}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Pelanggan: <strong>{b.customer?.full_name || 'Pelanggan'}</strong> ({b.customer?.phone})
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900">
                          {b.service?.name} • Kec. {b.address?.district || 'Penajam'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Jadwal: {b.scheduled_date} ({b.start_time} - {b.end_time} WITA) • Rp {b.total_price.toLocaleString('id-ID')}
                        </p>
                      </div>

                      {b.cleaner ? (
                        <div className="text-xs text-emerald-700 font-medium">
                          Mitra: <strong>{b.cleaner.full_name}</strong> ({b.cleaner.phone})
                        </div>
                      ) : (
                        <div className="text-xs text-amber-600 font-medium">
                          Belum ada mitra cleaner ditugaskan
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {b.status === 'CONFIRMED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateBookingStatus(b.id, 'CLEANER_ASSIGNED')}
                          className="bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          Tugaskan Mitra Cleaner
                        </Button>
                      )}

                      {b.status === 'CLEANER_ASSIGNED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateBookingStatus(b.id, 'IN_PROGRESS')}
                          className="text-xs"
                        >
                          Mulai Pengerjaan
                        </Button>
                      )}

                      {b.status === 'IN_PROGRESS' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                        >
                          Tandai Selesai
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTrackBooking(b.id)}
                        className="text-xs"
                      >
                        Lacak Detail
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DAFTAR MITRA AKTIF */}
        {activeTab === 'active-mitra' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCleaners.map((cleaner) => (
                <div
                  key={cleaner.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cleaner.avatar_url || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'}
                      alt={cleaner.full_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <strong className="block text-sm font-black text-slate-900">
                        {cleaner.full_name}
                      </strong>
                      <span className="text-xs text-emerald-700 font-bold">
                        ★ 4.95 (Sertifikasi BNSP)
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                    <div>No. HP: <strong>{cleaner.phone || '082155551234'}</strong></div>
                    <div>Email: {cleaner.email}</div>
                    <div>Wilayah Kerja: Penajam & IKN Sepaku</div>
                    <div>Status: <span className="text-emerald-600 font-bold">Aktif & Siap Menerima Order</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REKENING OWNER & KEUANGAN */}
        {activeTab === 'owner-finance' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Pengaturan Rekening Penampung Owner & Payout Gateway
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Rekening bank utama tempat pencairan hasil pembayaran dari Midtrans (QRIS & VA) masuk ke pemilik.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={onOpenOwnerSettings}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
              >
                <Landmark className="w-4 h-4 mr-1.5" />
                <span>Ubah Rekening Owner</span>
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Bank Tujuan
                </span>
                <strong className="text-base text-emerald-950 block mt-0.5">
                  {ownerConfig.bankName}
                </strong>
                <span className="text-xs text-emerald-800">{ownerConfig.branch}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Nomor Rekening
                </span>
                <strong className="text-base text-emerald-950 font-mono block mt-0.5">
                  {ownerConfig.accountNumber}
                </strong>
                <span className="text-xs text-emerald-800">A/N {ownerConfig.accountHolder}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Jadwal Auto-Payout
                </span>
                <strong className="text-base text-emerald-950 block mt-0.5 capitalize">
                  {ownerConfig.payoutSchedule}
                </strong>
                <span className="text-xs text-emerald-800">Transfer otomatis harian</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: KUPON & VOUCHER DISKON */}
        {activeTab === 'coupons' && (
          <CouponsManagerTab onDataChanged={() => setRefreshTrigger((prev) => prev + 1)} />
        )}
      </div>

      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={() => setIsEditServiceModalOpen(false)}
        service={selectedServiceToEdit}
        onSave={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <EditPricingModal
        isOpen={isEditPricingModalOpen}
        onClose={() => setIsEditPricingModalOpen(false)}
        onSave={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};
