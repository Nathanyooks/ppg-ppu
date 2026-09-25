import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
  Wallet,
  Coins,
  History,
} from 'lucide-react';
import {
  OwnerBankAccount,
  PayoutRecord,
  SUPPORTED_BANKS,
  getOwnerBankAccount,
  saveOwnerBankAccount,
  getPayoutHistory,
  requestOwnerPayout,
} from '../../lib/payment/ownerBankConfig';
import { dbStore } from '../../lib/database/supabaseClient';

interface OwnerBankSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerBankSettingsModal: React.FC<OwnerBankSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<OwnerBankAccount>(getOwnerBankAccount());
  const [payouts, setPayouts] = useState<PayoutRecord[]>(getPayoutHistory());
  const [activeTab, setActiveTab] = useState<'account' | 'midtrans' | 'payouts'>('account');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Calculate gross revenue from completed payments
  const payments = dbStore.getPayments();
  const completedRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    if (isOpen) {
      setFormData(getOwnerBankAccount());
      setPayouts(getPayoutHistory());
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveOwnerBankAccount(formData);
    setFormData(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleManualWithdraw = () => {
    if (completedRevenue <= 0) return;
    setIsWithdrawing(true);
    setTimeout(() => {
      const record = requestOwnerPayout(completedRevenue);
      setPayouts([record, ...payouts]);
      setIsWithdrawing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              Admin & Owner Management
            </span>
            <span className="text-emerald-200 text-xs">• Penajam Paser Utara</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Pengaturan Rekening Bank Owner
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
            Atur rekening penerima hasil pembayaran transaksi pembersihan, integrasi pencairan otomatis Midtrans, dan rekening transfer manual.
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-600/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>
                Rekening Aktif: <strong>{formData.bankName}</strong> ({formData.accountNumber})
              </span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-emerald-200">
              <span>A/N: {formData.accountHolder}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-4 text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'account'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Rekening Bank Utama
          </button>
          <button
            onClick={() => setActiveTab('midtrans')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'midtrans'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Integrasi Midtrans Payout
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'payouts'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            Riwayat Pencairan Dana
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs">
          {activeTab === 'account' && (
            <form onSubmit={handleSave} className="space-y-4">
              {isSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pengaturan rekening berhasil diperbarui dan disimpan ke sistem!</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Bank Tujuan
                  </label>
                  <select
                    value={formData.bankCode}
                    onChange={(e) => {
                      const selected = SUPPORTED_BANKS.find((b) => b.code === e.target.value);
                      if (selected) {
                        setFormData({
                          ...formData,
                          bankCode: selected.code,
                          bankName: selected.name,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                  >
                    {SUPPORTED_BANKS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor Rekening
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      placeholder="Contoh: 1490012389712"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(formData.accountNumber, 'accNo')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Salin Nomor Rekening"
                    >
                      {copiedField === 'accNo' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Atas Nama Pemilik Rekening (A/N)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountHolder}
                    onChange={(e) =>
                      setFormData({ ...formData, accountHolder: e.target.value.toUpperCase() })
                    }
                    placeholder="Contoh: CV BERSIH IN NUSANTARA"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Pastikan nama persis dengan yang tertera di buku tabungan / rekening koran.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Kantor Cabang / Wilayah
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="Contoh: KCP Penajam, Kab. Penajam Paser Utara"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Jadwal Otomatis Pencairan Dana (Payout Schedule)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'DAILY', label: 'Harian (17:00 WITA)', desc: 'Paling disarankan' },
                    { id: 'REALTIME', label: 'Real-Time', desc: 'Tiap order selesai' },
                    { id: 'WEEKLY', label: 'Mingguan', desc: 'Setiap hari Jumat' },
                    { id: 'MANUAL', label: 'Manual', desc: 'Tarik via tombol' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          payoutSchedule: s.id as OwnerBankAccount['payoutSchedule'],
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        formData.payoutSchedule === s.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">{s.label}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableManualTransferOption}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableManualTransferOption: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Tampilkan Rekening Ini sebagai Alternatif Transfer Manual
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Jika dicentang, pelanggan yang tidak ingin scan QRIS atau VA dapat memilih transfer manual langsung ke nomor rekening di atas.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Simpan Perubahan Rekening
                </button>
              </div>
            </form>
          )}

          {activeTab === 'midtrans' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <strong className="text-sm">Bagaimana Uang Pelanggan Masuk ke Rekening Owner?</strong>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Pada sistem modern berbasis Payment Gateway (Midtrans Snap), pembayaran pelanggan (QRIS, VA Bank, GoPay) diproses secara terpusat oleh Bank Indonesia & Midtrans, lalu diteruskan ke rekening bank owner:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-800 block">
                      Pelanggan Bayar via QRIS / VA di Aplikasi
                    </strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Uang langsung terverifikasi seketika (1-3 detik) dan masuk ke saldo tertampung Midtrans Merchant Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-800 block">
                      Pengaturan Rekening di Dashboard Midtrans (MAP)
                    </strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Buka <strong>dashboard.midtrans.com</strong> &gt; Menu <strong>Settings &gt; Payouts / Bank Account</strong>. Masukkan rekening yang sama dengan yang diatur di form ini:
                    </p>
                    <div className="mt-2 p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] space-y-1">
                      <div>Bank: <strong>{formData.bankName}</strong></div>
                      <div>Nomor Rekening: <strong>{formData.accountNumber}</strong></div>
                      <div>A/N: <strong>{formData.accountHolder}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-800 block">
                      Pencairan Otomatis (Auto-Payout / Disbursement)
                    </strong>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Setiap sore (jadwal harian), Midtrans secara otomatis mentransfer seluruh hasil penjualan bersih ke rekening <strong>{formData.bankName}</strong> Anda tanpa perlu request penarikan manual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Biaya Transaksi (MDR Resmi BI & Bank):</strong>
                  <ul className="list-disc list-inside text-[11px] mt-1 space-y-0.5 text-amber-800">
                    <li>QRIS: 0,7% (ketentuan Bank Indonesia)</li>
                    <li>Virtual Account (BCA / Mandiri / BNI / BRI): Rp 4.000 / transaksi sukses</li>
                    <li>Biaya pencairan ke rekening owner (Disbursement): Rp 5.000 / batch pencairan harian</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-100 font-bold block">
                    Total Pendapatan Terbayar Pelanggan (Net Sales)
                  </span>
                  <div className="text-2xl font-black mt-0.5">
                    Rp {completedRevenue.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] text-emerald-100 block mt-0.5">
                    Tujuan: {formData.bankName} • {formData.accountNumber}
                  </span>
                </div>

                <button
                  onClick={handleManualWithdraw}
                  disabled={isWithdrawing || completedRevenue <= 0}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {isWithdrawing ? 'Memproses Transfer...' : 'Tarik Dana Sekarang'}
                </button>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-800 mb-2 uppercase tracking-wider">
                  Riwayat Pengiriman Dana ke Rekening Owner
                </h4>
                <div className="space-y-2">
                  {payouts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            Rp {p.amount.toLocaleString('id-ID')} &bull; {p.bankName}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Ref: {p.referenceNumber} &bull; No Rek: {p.accountNumber}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          SUKSES
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(p.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Data tersimpan aman di database lokal & sinkronisasi merchant</span>
          <span className="font-semibold text-emerald-700">Bersih.in PPU Payment Engine</span>
        </div>
      </div>
    </div>
  );
};
