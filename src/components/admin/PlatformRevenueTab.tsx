import React, { useState } from 'react';
import {
  PlatformSettings,
  getPlatformSettings,
  updatePlatformSettings,
  resetPlatformSettings,
} from '../../lib/constants/platformSettings';
import {
  Percent,
  Landmark,
  Truck,
  Bed,
  Bath,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Calculator,
  ShieldCheck,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface PlatformRevenueTabProps {
  onSettingsSaved: () => void;
}

export const PlatformRevenueTab: React.FC<PlatformRevenueTabProps> = ({ onSettingsSaved }) => {
  const [settings, setSettings] = useState<PlatformSettings>(getPlatformSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [simulationPrice, setSimulationPrice] = useState<number>(200000);

  const handleMitraCommissionChange = (val: number) => {
    const clamped = Math.min(95, Math.max(50, val));
    setSettings((prev) => ({
      ...prev,
      mitraCommissionPercent: clamped,
      platformFeePercent: 100 - clamped,
    }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updatePlatformSettings(settings);
    setSettings(updated);
    setIsSaved(true);
    onSettingsSaved();
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh konfigurasi bagi hasil dan tarif transport ke pengaturan bawaan?')) {
      const reset = resetPlatformSettings();
      setSettings(reset);
      setIsSaved(true);
      onSettingsSaved();
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

  const mitraShareSim = Math.round((simulationPrice * settings.mitraCommissionPercent) / 100);
  const ownerShareSim = simulationPrice - mitraShareSim;

  return (
    <div className="space-y-6">
      {isSaved && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Pengaturan prosentase bagi hasil & tarif platform berhasil diperbarui dan berlaku seketika!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Bagi Hasil & Biaya Operasional Platform
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dikelola langsung oleh Akun Master. Mengatur proporsi komisi mitra cleaner, ongkir 4 kecamatan di PPU, dan surcharge.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan Standar</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: REVENUE SHARE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Skema Prosentase Bagi Hasil (Revenue Share)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Hak Bagi Hasil Mitra Cleaner:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="50"
                    max="95"
                    value={settings.mitraCommissionPercent}
                    onChange={(e) => handleMitraCommissionChange(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-black text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-emerald-700 text-sm">%</span>
                </div>
              </div>

              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={settings.mitraCommissionPercent}
                onChange={(e) => handleMitraCommissionChange(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>50% (Bagi Rata)</span>
                <span>80% (Standar Bersih.in)</span>
                <span>95% (Maksimal)</span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Keterangan Alokasi Bagi Hasil:</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Mitra cleaner menerima <strong>{settings.mitraCommissionPercent}%</strong> dari setiap transaksi jasa.
                  Margin platform owner adalah <strong>{settings.platformFeePercent}%</strong> yang digunakan untuk biaya operasional, iklan, asuransi, dan server.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Visualisasi Proporsi Pembagian
              </span>

              <div className="w-full h-5 rounded-full overflow-hidden bg-slate-800 flex border border-slate-700">
                <div
                  style={{ width: `${settings.mitraCommissionPercent}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-slate-950 transition-all duration-300"
                >
                  Mitra {settings.mitraCommissionPercent}%
                </div>
                <div
                  style={{ width: `${settings.platformFeePercent}%` }}
                  className="bg-amber-400 h-full flex items-center justify-center text-[10px] font-black text-slate-950 transition-all duration-300"
                >
                  Owner {settings.platformFeePercent}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Mitra Cleaner</span>
                  <span className="text-xl font-black text-emerald-400">
                    {settings.mitraCommissionPercent}%
                  </span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Platform Bersih.in</span>
                  <span className="text-xl font-black text-amber-400">
                    {settings.platformFeePercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRANSPORT PER DISTRICT */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Truck className="w-4 h-4 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Ongkos Transportasi Mitra per Kecamatan (Kab. PPU & IKN)
              </h3>
              <p className="text-[11px] text-slate-500">
                Ditambahkan otomatis ke total pesanan pelanggan berdasarkan kecamatan alamat pengerjaan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Kec. Penajam</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Pusat Kota</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block uppercase font-bold">Ongkir (Rp)</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={settings.transportFees.penajam}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      transportFees: { ...prev.transportFees, penajam: Number(e.target.value) },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-emerald-700 text-sm bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Kec. Waru</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Zona Selatan</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block uppercase font-bold">Ongkir (Rp)</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={settings.transportFees.waru}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      transportFees: { ...prev.transportFees, waru: Number(e.target.value) },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-emerald-700 text-sm bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Kec. Babulu</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Zona Pertanian</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block uppercase font-bold">Ongkir (Rp)</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={settings.transportFees.babulu}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      transportFees: { ...prev.transportFees, babulu: Number(e.target.value) },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-emerald-700 text-sm bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-900">Kec. Sepaku (IKN)</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">KIPP Nusantara</span>
              </div>
              <div>
                <label className="text-[10px] text-emerald-700 block uppercase font-bold">Ongkir (Rp)</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={settings.transportFees.sepaku}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      transportFees: { ...prev.transportFees, sepaku: Number(e.target.value) },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 font-bold text-emerald-800 text-sm bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EXTRA ROOMS & MIN PAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800">Biaya Kamar Tidur Ekstra</label>
            </div>
            <p className="text-[11px] text-slate-500">Per kamar tidur melebihi kuota 2 kamar</p>
            <input
              type="number"
              step="5000"
              min="0"
              value={settings.extraBedroomFee}
              onChange={(e) => setSettings({ ...settings, extraBedroomFee: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-700 text-sm"
            />
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800">Biaya Kamar Mandi Ekstra</label>
            </div>
            <p className="text-[11px] text-slate-500">Per kamar mandi melebihi kuota 1 kamar</p>
            <input
              type="number"
              step="5000"
              min="0"
              value={settings.extraBathroomFee}
              onChange={(e) => setSettings({ ...settings, extraBathroomFee: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-700 text-sm"
            />
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-800">Minimal Tarik Saldo Mitra</label>
            </div>
            <p className="text-[11px] text-slate-500">Batas minimum penarikan dana ke rekening</p>
            <input
              type="number"
              step="10000"
              min="10000"
              value={settings.minPayoutAmount}
              onChange={(e) => setSettings({ ...settings, minPayoutAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 text-sm"
            />
          </div>
        </div>

        {/* SECTION 4: SIMULATION */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Simulasi Perhitungan Transaksi Real-time</h4>
            </div>
            <span className="text-[11px] text-slate-400">Uji coba simulasi bagi hasil otomatis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Contoh Total Biaya Order (Rp):</label>
              <input
                type="number"
                step="25000"
                value={simulationPrice}
                onChange={(e) => setSimulationPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80 space-y-1">
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                Hak Bersih Mitra ({settings.mitraCommissionPercent}%)
              </span>
              <span className="text-xl font-black text-emerald-300 block">
                Rp {mitraShareSim.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-400">Masuk ke dompet digital Mitra</span>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                Bagian Owner Bersih.in ({settings.platformFeePercent}%)
              </span>
              <span className="text-xl font-black text-amber-300 block">
                Rp {ownerShareSim.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-400">Masuk ke rekening penampung owner</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-900/20"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span>Simpan Seluruh Pengaturan Finansial</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
