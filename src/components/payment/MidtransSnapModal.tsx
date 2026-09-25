import React, { useState, useEffect, useMemo } from 'react';
import { Booking } from '../../types/database';
import { midtransClient, GeneratedSnapTransaction } from '../../lib/payment/midtransService';
import { dbStore } from '../../lib/database/supabaseClient';
import { getOwnerBankAccount, OwnerBankAccount } from '../../lib/payment/ownerBankConfig';
import {
  ShieldCheck,
  Clock,
  QrCode,
  CreditCard,
  Building2,
  Smartphone,
  Copy,
  Check,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  Settings,
  Landmark,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface MidtransSnapModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
  onOpenOwnerSettings?: () => void;
}

type PaymentTab = 'qris' | 'va' | 'gopay' | 'card' | 'manual';

export const MidtransSnapModal: React.FC<MidtransSnapModalProps> = ({
  isOpen,
  booking,
  onClose,
  onPaymentSuccess,
  onOpenOwnerSettings,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bni' | 'bri' | 'permata'>('bca');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessAnimation, setIsSuccessAnimation] = useState(false);
  const [expandedInstruction, setExpandedInstruction] = useState<string | null>('m_banking');
  const [ownerBank, setOwnerBank] = useState<OwnerBankAccount>(getOwnerBankAccount());

  // Countdown Timer (15 minutes in seconds = 900s)
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    if (!isOpen) return;
    setOwnerBank(getOwnerBankAccount());
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Generate or retrieve Snap transaction payload
  const snapData = useMemo<GeneratedSnapTransaction | null>(() => {
    if (!booking) return null;
    return midtransClient.createSnapTransaction(booking);
  }, [booking]);

  if (!isOpen || !booking || !snapData) return null;

  const currentVaNumber = snapData.vaNumbers[selectedBank] || snapData.vaNumbers.bca;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSuccess = (methodName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      midtransClient.simulateSuccessPayment(booking.id, methodName);
      setIsProcessing(false);
      setIsSuccessAnimation(true);
      setTimeout(() => {
        const freshBooking = dbStore.getBookingById(booking.id) || booking;
        onPaymentSuccess(freshBooking);
      }, 1500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header - Midtrans Branded */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-black text-emerald-400 text-base">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Midtrans Snap
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                  Sandbox QA Mode
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white">Pembayaran Aman Bersih.in</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenOwnerSettings && (
              <button
                type="button"
                onClick={onOpenOwnerSettings}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white text-xs font-semibold transition-colors border border-emerald-500/30"
                title="Kelola Rekening Bank Owner & Payout"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Atur Rekening Owner</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Price & Countdown Summary Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Pembayaran
            </span>
            <div className="text-2xl font-black text-emerald-600">
              Rp {booking.total_price.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span className="font-mono">Order: #{booking.booking_number}</span>
              <span>•</span>
              <span className="font-medium text-emerald-700">Penerima: {ownerBank.accountHolder}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-2xl text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Selesaikan dalam {formattedTime}</span>
          </div>
        </div>

        {/* Success Splash Overlay */}
        {isSuccessAnimation ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 my-auto animate-scaleUp">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Pembayaran Berhasil Diterima!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Transaksi telah terverifikasi ke rekening owner. Pesanan #{booking.booking_number} otomatis berstatus <strong>CONFIRMED</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Menyiapkan penugasan mitra cleaner terdekat PPU...
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Payment Method Tabs */}
            <div className={`grid ${ownerBank.enableManualTransferOption ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-4'} gap-2 p-1.5 bg-slate-100 rounded-2xl`}>
              <button
                type="button"
                onClick={() => setActiveTab('qris')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'qris'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 mb-1 text-emerald-600" />
                <span>QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('va')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'va'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1 text-blue-600" />
                <span>Virtual Acc</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gopay')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'gopay'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1 text-sky-600" />
                <span>GoPay</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'card'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1 text-purple-600" />
                <span>Kartu Kredit</span>
              </button>

              {ownerBank.enableManualTransferOption && (
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'manual'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Landmark className={`w-4 h-4 mb-1 ${activeTab === 'manual' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                  <span className="truncate w-full text-center">Rek. Owner</span>
                </button>
              )}
            </div>

            {/* TAB 1: QRIS */}
            {activeTab === 'qris' && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  QRIS Standar Nasional Indonesia (ASPI & BI)
                </div>

                <div className="p-4 bg-white rounded-3xl border-2 border-dashed border-slate-200 inline-block shadow-inner mx-auto">
                  <div className="w-52 h-52 bg-white rounded-2xl p-2 border border-slate-100 flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" rx="3" />
                      <rect x="11" y="11" width="16" height="16" fill="currentColor" rx="2" />

                      <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" rx="3" />
                      <rect x="73" y="11" width="16" height="16" fill="currentColor" rx="2" />

                      <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" rx="3" />
                      <rect x="11" y="73" width="16" height="16" fill="currentColor" rx="2" />

                      <rect x="38" y="8" width="6" height="6" fill="currentColor" />
                      <rect x="48" y="8" width="6" height="6" fill="currentColor" />
                      <rect x="58" y="12" width="5" height="5" fill="currentColor" />

                      <rect x="8" y="38" width="6" height="6" fill="currentColor" />
                      <rect x="18" y="48" width="6" height="6" fill="currentColor" />
                      <rect x="28" y="38" width="6" height="6" fill="currentColor" />

                      <rect x="42" y="42" width="16" height="16" fill="#059669" rx="3" />
                      <text x="50" y="53" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">QRIS</text>

                      <rect x="38" y="64" width="6" height="6" fill="currentColor" />
                      <rect x="48" y="72" width="6" height="6" fill="currentColor" />
                      <rect x="58" y="64" width="6" height="6" fill="currentColor" />
                      <rect x="68" y="48" width="6" height="6" fill="currentColor" />
                      <rect x="78" y="58" width="6" height="6" fill="currentColor" />
                      <rect x="86" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="68" y="78" width="6" height="6" fill="currentColor" />
                      <rect x="78" y="84" width="6" height="6" fill="currentColor" />
                    </svg>

                    <div className="absolute -bottom-3 bg-slate-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Bersih.in Official
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Scan QR di atas menggunakan aplikasi <strong>GoPay, BCA Mobile, ShopeePay, OVO, Dana, LinkAja</strong> atau m-banking apa pun.
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md"
                    disabled={isProcessing}
                    onClick={() => handleSimulateSuccess('QRIS')}
                  >
                    {isProcessing ? 'Memverifikasi Pembayaran...' : '⚡ Simulasikan Pembayaran QRIS Sukses'}
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: VIRTUAL ACCOUNT */}
            {activeTab === 'va' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Pilih Bank Virtual Account:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {(['bca', 'mandiri', 'bni', 'bri', 'permata'] as const).map((bank) => (
                      <button
                        type="button"
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          selectedBank === bank
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-semibold'
                        }`}
                      >
                        <span className="uppercase text-xs tracking-wider">{bank}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Nomor Virtual Account ({selectedBank.toUpperCase()})
                      </span>
                      <div className="text-xl font-mono font-black text-slate-900 tracking-wider mt-0.5">
                        {currentVaNumber}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentVaNumber)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedInstruction(expandedInstruction === 'm_banking' ? null : 'm_banking')
                    }
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
                  >
                    <span>Petunjuk Pembayaran m-Banking ({selectedBank.toUpperCase()})</span>
                    {expandedInstruction === 'm_banking' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedInstruction === 'm_banking' && (
                    <ol className="text-xs text-slate-600 space-y-1.5 pl-4 list-decimal pt-2 border-t border-slate-100">
                      <li>Buka aplikasi Mobile Banking {selectedBank.toUpperCase()} Anda.</li>
                      <li>Pilih menu <strong>Transfer</strong> &gt; <strong>Virtual Account</strong>.</li>
                      <li>Masukkan kode VA: <code className="font-mono bg-slate-100 px-1 rounded text-emerald-800 font-bold">{currentVaNumber}</code>.</li>
                      <li>Periksa detail nama merchant: <strong>Bersih.in / PT Bersih Indonesia</strong>.</li>
                      <li>Konfirmasi nominal Rp {booking.total_price.toLocaleString('id-ID')} dan masukkan PIN m-Banking.</li>
                    </ol>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                    disabled={isProcessing}
                    onClick={() => handleSimulateSuccess(`VA_${selectedBank.toUpperCase()}`)}
                  >
                    {isProcessing ? 'Memverifikasi Transfer VA...' : `⚡ Simulasikan Transfer VA ${selectedBank.toUpperCase()} Berhasil`}
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: GOPAY / E-WALLET */}
            {activeTab === 'gopay' && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Pembayaran Instan GoPay</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Buka aplikasi GoPay atau Gojek di ponsel Anda untuk konfirmasi 1-klik pembayaran tanpa biaya admin.
                  </p>
                </div>

                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs text-sky-900 font-medium">
                  Nominal transaksi: <strong>Rp {booking.total_price.toLocaleString('id-ID')}</strong>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-sky-600 hover:bg-sky-700 shadow-md"
                  disabled={isProcessing}
                  onClick={() => handleSimulateSuccess('GOPAY')}
                >
                  {isProcessing ? 'Menghubungkan GoPay...' : '⚡ Buka GoPay & Simulasikan Bayar Sukses'}
                </Button>
              </div>
            )}

            {/* TAB 4: KARTU KREDIT / DEBIT */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Kartu</label>
                    <input
                      type="text"
                      placeholder="4000 0012 3456 7890"
                      defaultValue="4811 1111 1111 1114"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Masa Berlaku</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        defaultValue="123"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dilindungi 3D Secure OTP & PCI-DSS Compliant Level 1</span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-purple-600 hover:bg-purple-700 shadow-md"
                  disabled={isProcessing}
                  onClick={() => handleSimulateSuccess('CREDIT_CARD')}
                >
                  {isProcessing ? 'Otorisasi 3D Secure...' : '⚡ Bayar Rp ' + booking.total_price.toLocaleString('id-ID')}
                </Button>
              </div>
            )}

            {/* TAB 5: TRANSFER MANUAL KE REKENING OWNER */}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      Rekening Resmi Pemilik Platform Bersih.in
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                      Verified Account
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Bank Tujuan:</span>
                      <strong className="text-slate-900 text-sm font-black">{ownerBank.bankName}</strong>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Nomor Rekening:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-base font-black text-emerald-700 tracking-wider">
                          {ownerBank.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(ownerBank.accountNumber)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Salin Nomor Rekening"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Atas Nama (A/N):</span>
                      <strong className="text-slate-800 font-bold">{ownerBank.accountHolder}</strong>
                    </div>

                    {ownerBank.branch && (
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Kantor Cabang:</span>
                        <span className="text-slate-600 font-medium">{ownerBank.branch}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>• Transfer tepat sebesar: <strong className="text-slate-900 font-bold">Rp {booking.total_price.toLocaleString('id-ID')}</strong></p>
                    <p>• Masukkan berita transfer: <code className="bg-emerald-100/70 px-1 rounded font-bold text-emerald-900">#{booking.booking_number}</code></p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Owner ingin ganti rekening?</span>
                  {onOpenOwnerSettings && (
                    <button
                      type="button"
                      onClick={onOpenOwnerSettings}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                    >
                      Ubah No Rekening Owner
                    </button>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                  disabled={isProcessing}
                  onClick={() => handleSimulateSuccess(`MANUAL_${ownerBank.bankCode}`)}
                >
                  {isProcessing ? 'Memverifikasi Transfer Owner...' : '⚡ Saya Sudah Transfer ke Rekening Owner'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Enkripsi 256-bit SSL</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-medium underline"
          >
            Bayar Nanti (Simpan Pesanan)
          </button>
        </div>
      </div>
    </div>
  );
};
