import React, { useState, useEffect } from 'react';
import {
  X,
  Percent,
  MapPin,
  Home,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import {
  getPlatformSettings,
  updatePlatformSettings,
  PlatformSettings,
} from '../../lib/constants/platformSettings';

interface EditPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: PlatformSettings) => void;
}

export const EditPricingModal: React.FC<EditPricingModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const currentSettings = getPlatformSettings();

  const [mitraPercent, setMitraPercent] = useState<number>(currentSettings.mitraCommissionPercent);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(currentSettings.platformFeePercent);

  const [transportPenajam, setTransportPenajam] = useState<number>(
    currentSettings.transportFees.penajam
  );
  const [transportWaru, setTransportWaru] = useState<number>(
    currentSettings.transportFees.waru
  );
  const [transportBabulu, setTransportBabulu] = useState<number>(
    currentSettings.transportFees.babulu
  );
  const [transportSepaku, setTransportSepaku] = useState<number>(
    currentSettings.transportFees.sepaku
  );

  const [extraBedroom, setExtraBedroom] = useState<number>(
    currentSettings.extraBedroomFee
  );
  const [extraBathroom, setExtraBathroom] = useState<number>(
    currentSettings.extraBathroomFee
  );

  const [minPayout, setMinPayout] = useState<number>(
    currentSettings.minPayoutAmount
  );

  const [simOrderAmount, setSimOrderAmount] = useState<number>(150000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const s = getPlatformSettings();
      setMitraPercent(s.mitraCommissionPercent);
      setPlatformFeePercent(s.platformFeePercent);
      setTransportPenajam(s.transportFees.penajam);
      setTransportWaru(s.transportFees.waru);
      setTransportBabulu(s.transportFees.babulu);
      setTransportSepaku(s.transportFees.sepaku);
      setExtraBedroom(s.extraBedroomFee);
      setExtraBathroom(s.extraBathroomFee);
      setMinPayout(s.minPayoutAmount);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMitraPercentChange = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setMitraPercent(clamped);
    setPlatformFeePercent(100 - clamped);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSettings: Partial<PlatformSettings> = {
      mitraCommissionPercent: mitraPercent,
      platformFeePercent: platformFeePercent,
      minPayoutAmount: minPayout,
      transportFees: {
        penajam: transportPenajam,
        waru: transportWaru,
        babulu: transportBabulu,
        sepaku: transportSepaku,
      },
      extraBedroomFee: extraBedroom,
      extraBathroomFee: extraBathroom,
    };

    const saved = updatePlatformSettings(newSettings);
    setToastMessage('Pengaturan bagi hasil & tarif berhasil disimpan!');
    if (onSave) onSave(saved);

    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1200);
  };

  const cleanerShare = Math.round((simOrderAmount * mitraPercent) / 100);
  const platformShare = simOrderAmount - cleanerShare;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Percent className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  AKUN MASTER • SUPERADMIN
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Edit Bagi Hasil & Tarif Platform
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Kelola persentase bagi hasil bersih mitra vs fee platform owner, ongkos transport per kecamatan PPU, dan biaya kamar ekstra.
          </p>
        </div>

        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-5 py-3 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Prosentase Bagi Hasil Pendapatan
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Total: 100%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-800">
                  Hak Bersih Mitra Cleaner: <strong className="text-base text-emerald-950">{mitraPercent}%</strong>
                </span>
                <span className="text-slate-600">
                  Fee Platform Owner: <strong className="text-base text-slate-900">{platformFeePercent}%</strong>
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={mitraPercent}
                onChange={(e) => handleMitraPercentChange(Number(e.target.value))}
                className="w-full h-2.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>50% Mitra (Min)</span>
                <span>70% (Standar)</span>
                <span>80% (Rekomendasi PPU)</span>
                <span>95% Mitra (Max)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
              <span className="text-[11px] font-bold text-emerald-900">Preset Cepat:</span>
              {[
                { m: 70, p: 30, label: '70% / 30%' },
                { m: 75, p: 25, label: '75% / 25%' },
                { m: 80, p: 20, label: '80% / 20%' },
                { m: 85, p: 15, label: '85% / 15%' },
              ].map((preset) => (
                <button
                  key={preset.m}
                  type="button"
                  onClick={() => handleMitraPercentChange(preset.m)}
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    mitraPercent === preset.m
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-3 p-3.5 bg-white rounded-xl border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Simulasi Nilai Order:</span>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <span>Rp</span>
                  <input
                    type="number"
                    step="10000"
                    value={simOrderAmount}
                    onChange={(e) => setSimOrderAmount(Number(e.target.value))}
                    className="w-28 text-right px-2 py-0.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-center">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <span className="text-[10px] text-emerald-700 font-bold block">Diterima Mitra Cleaner</span>
                  <strong className="text-sm font-black text-emerald-900">
                    Rp {cleanerShare.toLocaleString('id-ID')}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-bold block">Masuk Rekening Owner</span>
                  <strong className="text-sm font-black text-slate-900">
                    Rp {platformShare.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: TRANSPORT FEES PER DISTRICT */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Ongkos Transportasi Resmi 4 Kecamatan PPU
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 -mt-2">
              Otomatis ditambahkan saat customer memilih kecamatan tempat tinggal di Kab. Penajam Paser Utara.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kec. Penajam (Pusat Kota)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={transportPenajam}
                    onChange={(e) => setTransportPenajam(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kec. Waru
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={transportWaru}
                    onChange={(e) => setTransportWaru(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kec. Babulu
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={transportBabulu}
                    onChange={(e) => setTransportBabulu(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kec. Sepaku (Wilayah IKN Nusantara)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={transportSepaku}
                    onChange={(e) => setTransportSepaku(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/40 text-xs font-black text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: EXTRA ROOM FEES */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Tarif Tambahan Ruangan Ekstra
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tambahan Kamar Tidur (+ per kamar)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    value={extraBedroom}
                    onChange={(e) => setExtraBedroom(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tambahan Kamar Mandi (+ per kamar mandi)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    value={extraBathroom}
                    onChange={(e) => setExtraBathroom(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                handleMitraPercentChange(80);
                setTransportPenajam(10000);
                setTransportWaru(20000);
                setTransportBabulu(30000);
                setTransportSepaku(35000);
                setExtraBedroom(25000);
                setExtraBathroom(30000);
              }}
              className="text-xs text-slate-500"
            >
              Reset Setelan Awal
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 font-bold px-5"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Simpan Pengaturan Tarif</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
