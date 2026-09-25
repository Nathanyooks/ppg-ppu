import React, { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import {
  X,
  Sparkles,
  DollarSign,
  Clock,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSave?: (savedService: Service) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service: initialService,
  onSave,
}) => {
  const allServices = dbStore.getServices();
  const categories = dbStore.getCategories();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || allServices[0]?.id || ''
  );

  const activeService = allServices.find((s) => s.id === selectedServiceId) || initialService || allServices[0];

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setSelectedServiceId(initialService.id);
    } else if (allServices.length > 0 && !selectedServiceId) {
      setSelectedServiceId(allServices[0].id);
    }
  }, [initialService, isOpen]);

  useEffect(() => {
    if (activeService) {
      setName(activeService.name || '');
      setCategoryId(activeService.category_id || categories[0]?.id || '');
      setDescription(activeService.description || '');
      setBasePrice(activeService.base_price || 0);
      setDurationMinutes(activeService.base_duration_minutes || 60);
      setImageUrl(activeService.image_url || '');
      setIsActive(activeService.is_active ?? true);
    }
  }, [activeService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;

    if (!name.trim()) {
      alert('Nama layanan wajib diisi.');
      return;
    }

    if (basePrice < 0) {
      alert('Harga dasar tidak boleh negatif.');
      return;
    }

    const updates: Partial<Service> = {
      name: name.trim(),
      category_id: categoryId,
      description: description.trim(),
      base_price: Number(basePrice),
      base_duration_minutes: Number(durationMinutes),
      image_url: imageUrl.trim() || undefined,
      is_active: isActive,
    };

    const updated = dbStore.updateService(activeService.id, updates);
    if (updated) {
      setToastMessage(`Layanan "${updated.name}" berhasil diperbarui!`);
      if (onSave) onSave(updated);
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 1200);
    }
  };

  const durationPresets = [45, 60, 90, 120, 180, 240];
  const pricePresets = [75000, 100000, 125000, 150000, 200000, 250000];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  AKUN MASTER • SUPERADMIN
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Edit Layanan & Harga
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
            Ubah nama paket, rincian deskripsi, tarif dasar (base price), serta estimasi durasi kerja SOP.
          </p>

          {allServices.length > 1 && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-3">
              <label className="text-xs font-bold text-slate-300 whitespace-nowrap">
                Pilih Layanan:
              </label>
              <div className="relative flex-1">
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none pr-8 cursor-pointer"
                >
                  {allServices.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name} — Rp {s.base_price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-5 py-3 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Layanan Kebersihan *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pembersihan Rumah Standard (Basic Cleaning)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Layanan
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                Harga Dasar & Durasi Kerja SOP
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Dasar (Base Price) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="5000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 font-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {pricePresets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setBasePrice(p)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        basePrice === p
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {(p / 1000).toLocaleString('id-ID')}rb
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Durasi SOP (Menit) *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {durationPresets.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationMinutes(d)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        durationMinutes === d
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {d}m ({Math.round((d / 60) * 10) / 10}j)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi & Cakupan Pembersihan *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail pembersihan, standar kebersihan, chemical dan alat yang dibawa..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL Gambar / Foto Layanan
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status Tampil
              </label>
              <select
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
              >
                <option value="true">Aktif (Tampil di Web)</option>
                <option value="false">Nonaktif (Sembunyikan)</option>
              </select>
            </div>
          </div>

          {imageUrl && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-16 h-12 object-cover rounded-lg border border-slate-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-700 block">Preview Foto Layanan</span>
                Pastikan gambar beresolusi tajam dan relevan dengan paket kebersihan.
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              ID Layanan: <strong className="font-mono text-slate-600">{activeService?.id}</strong>
            </span>

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
                <span>Simpan Perubahan Layanan</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
