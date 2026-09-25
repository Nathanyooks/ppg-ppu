import React, { useState } from 'react';
import { Service, ServiceAddon, PricingRule, ServiceCategory } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import {
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Search,
  RotateCcw,
  Tag,
  DollarSign,
  Building,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ServicesManagerTabProps {
  onDataChanged: () => void;
}

type SubTab = 'services' | 'addons' | 'pricing-rules';

export const ServicesManagerTab: React.FC<ServicesManagerTabProps> = ({ onDataChanged }) => {
  const [subTab, setSubTab] = useState<SubTab>('services');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);

  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null);
  const [isNewAddonModalOpen, setIsNewAddonModalOpen] = useState(false);

  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const services = dbStore.getServices();
  const categories = dbStore.getCategories();
  const addons = dbStore.getAddons();
  const pricingRules = dbStore.getPricingRules();

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Handlers for Services
  const handleSaveService = (serviceData: Partial<Service>) => {
    if (editingService) {
      dbStore.updateService(editingService.id, serviceData);
      showNotification(`Layanan "${serviceData.name || editingService.name}" berhasil diperbarui!`);
      setEditingService(null);
    } else {
      dbStore.addService({
        name: serviceData.name || 'Layanan Baru',
        slug: (serviceData.name || 'layanan-baru').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category_id: serviceData.category_id || categories[0]?.id || 'cat-1',
        description: serviceData.description || '',
        base_price: Number(serviceData.base_price) || 100000,
        base_duration_minutes: Number(serviceData.base_duration_minutes) || 60,
        image_url: serviceData.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
        is_active: serviceData.is_active ?? true,
      });
      showNotification(`Layanan baru berhasil ditambahkan!`);
      setIsNewServiceModalOpen(false);
    }
    onDataChanged();
  };

  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`Hapus layanan "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      dbStore.deleteService(id);
      showNotification(`Layanan "${name}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  const handleToggleServiceActive = (service: Service) => {
    dbStore.updateService(service.id, { is_active: !service.is_active });
    showNotification(`Status layanan "${service.name}" diubah.`);
    onDataChanged();
  };

  // Handlers for Addons
  const handleSaveAddon = (addonData: Partial<ServiceAddon>) => {
    if (editingAddon) {
      dbStore.updateAddon(editingAddon.id, addonData);
      showNotification(`Add-on "${addonData.name || editingAddon.name}" berhasil diperbarui!`);
      setEditingAddon(null);
    } else {
      dbStore.addAddon({
        service_id: addonData.service_id || services[0]?.id || 'srv-1',
        name: addonData.name || 'Add-on Baru',
        description: addonData.description || '',
        price: Number(addonData.price) || 30000,
        duration_minutes: Number(addonData.duration_minutes) || 30,
        is_active: addonData.is_active ?? true,
      });
      showNotification(`Add-on baru berhasil ditambahkan!`);
      setIsNewAddonModalOpen(false);
    }
    onDataChanged();
  };

  const handleDeleteAddon = (id: string, name: string) => {
    if (window.confirm(`Hapus add-on "${name}"?`)) {
      dbStore.deleteAddon(id);
      showNotification(`Add-on "${name}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  // Handlers for Pricing Rules
  const handleSaveRule = (ruleData: Partial<PricingRule>) => {
    if (editingRule) {
      dbStore.updatePricingRule(editingRule.id, ruleData);
      showNotification(`Aturan tarif berhasil diperbarui!`);
      setEditingRule(null);
    } else {
      dbStore.addPricingRule({
        service_id: ruleData.service_id || services[0]?.id || 'srv-1',
        property_type: ruleData.property_type || 'Rumah',
        min_area: Number(ruleData.min_area) || 0,
        max_area: Number(ruleData.max_area) || 100,
        price: Number(ruleData.price) || 150000,
        duration_minutes: Number(ruleData.duration_minutes) || 120,
        is_active: ruleData.is_active ?? true,
      });
      showNotification(`Aturan tarif baru berhasil ditambahkan!`);
      setIsNewRuleModalOpen(false);
    }
    onDataChanged();
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm(`Hapus aturan tarif ini?`)) {
      dbStore.deletePricingRule(id);
      showNotification(`Aturan tarif berhasil dihapus.`);
      onDataChanged();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh daftar layanan, add-on, dan aturan tarif ke pengaturan bawaan awal?')) {
      dbStore.resetToDefaults();
      showNotification('Seluruh data layanan berhasil dikembalikan ke standar awal.');
      onDataChanged();
    }
  };

  // Filtered lists
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAddons = addons.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRules = pricingRules.filter((r) =>
    r.property_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {feedbackMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header controls bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Manajemen Layanan & Tarif
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kendali penuh Akun Master untuk mengubah nama, harga paket, durasi SOP, dan add-on operasional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {subTab === 'services' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewServiceModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Tambah Layanan</span>
            </Button>
          )}

          {subTab === 'addons' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewAddonModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Tambah Add-on</span>
            </Button>
          )}

          {subTab === 'pricing-rules' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewRuleModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Tambah Aturan Tarif</span>
            </Button>
          )}

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            title="Kembalikan semua layanan ke setelan awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              subTab === 'services'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Layanan Utama ({services.length})
          </button>

          <button
            onClick={() => setSubTab('addons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              subTab === 'addons'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Layanan Tambahan / Add-on ({addons.length})
          </button>

          <button
            onClick={() => setSubTab('pricing-rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              subTab === 'pricing-rules'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Aturan Tarif Luas & Properti ({pricingRules.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* SUB-TAB 1: SERVICES LIST */}
      {subTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const category = categories.find((c) => c.id === service.category_id);
            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${
                  service.is_active ? 'border-slate-200' : 'border-rose-200 bg-rose-50/20 opacity-80'
                }`}
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={service.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                        {category?.name || 'Cleaning'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          service.is_active
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {service.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Tarif Dasar
                        </span>
                        <span className="text-lg font-black text-emerald-700">
                          Rp {service.base_price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Durasi SOP
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {service.base_duration_minutes} Menit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleServiceActive(service)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                      service.is_active
                        ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {service.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-200 hover:border-emerald-300 cursor-pointer"
                      title="Edit Layanan & Harga"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id, service.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-300 cursor-pointer"
                      title="Hapus Layanan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: ADD-ONS LIST */}
      {subTab === 'addons' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Nama Layanan Tambahan</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-4">Harga Add-on</th>
                  <th className="py-3.5 px-4">Durasi Kerja</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAddons.map((addon) => (
                  <tr key={addon.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {addon.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {addon.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      Rp {addon.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {addon.duration_minutes} Menit
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          addon.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {addon.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingAddon(addon)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Edit Add-on"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddon(addon.id, addon.name)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Add-on"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRICING RULES */}
      {subTab === 'pricing-rules' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Tipe Properti</th>
                  <th className="py-3.5 px-4">Rentang Luas Area</th>
                  <th className="py-3.5 px-4">Harga Paket</th>
                  <th className="py-3.5 px-4">Durasi Kerja SOP</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="inline-flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {rule.property_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {rule.min_area} m² – {rule.max_area} m²
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      Rp {rule.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {rule.duration_minutes} Menit ({Math.round(rule.duration_minutes / 60)} Jam)
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rule.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rule.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingRule(rule)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Edit Aturan Tarif"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Aturan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(editingService || isNewServiceModalOpen) && (
        <ServiceFormModal
          service={editingService}
          categories={categories}
          onClose={() => {
            setEditingService(null);
            setIsNewServiceModalOpen(false);
          }}
          onSave={handleSaveService}
        />
      )}

      {(editingAddon || isNewAddonModalOpen) && (
        <AddonFormModal
          addon={editingAddon}
          services={services}
          onClose={() => {
            setEditingAddon(null);
            setIsNewAddonModalOpen(false);
          }}
          onSave={handleSaveAddon}
        />
      )}

      {(editingRule || isNewRuleModalOpen) && (
        <PricingRuleFormModal
          rule={editingRule}
          services={services}
          onClose={() => {
            setEditingRule(null);
            setIsNewRuleModalOpen(false);
          }}
          onSave={handleSaveRule}
        />
      )}
    </div>
  );
};

interface ServiceFormModalProps {
  service: Service | null;
  categories: ServiceCategory[];
  onClose: () => void;
  onSave: (data: Partial<Service>) => void;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  service,
  categories,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(service?.name || '');
  const [categoryId, setCategoryId] = useState(service?.category_id || categories[0]?.id || 'cat-1');
  const [description, setDescription] = useState(service?.description || '');
  const [basePrice, setBasePrice] = useState(service?.base_price?.toString() || '120000');
  const [duration, setDuration] = useState(service?.base_duration_minutes?.toString() || '120');
  const [imageUrl, setImageUrl] = useState(
    service?.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
  );
  const [isActive, setIsActive] = useState(service?.is_active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nama layanan wajib diisi');
    onSave({
      name,
      category_id: categoryId,
      description,
      base_price: Number(basePrice) || 100000,
      base_duration_minutes: Number(duration) || 60,
      image_url: imageUrl,
      is_active: isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {service ? 'Edit Jenis Layanan & Tarif' : 'Tambah Jenis Layanan Baru'}
            </h3>
            <p className="text-xs text-slate-500">Konfigurasi resmi oleh Akun Master</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Layanan *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pembersihan Rumah Standard"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tarif Dasar (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                step="5000"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Durasi SOP (Menit) *</label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Publikasi</label>
              <select
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium cursor-pointer"
              >
                <option value="true">Aktif (Tampil di Website)</option>
                <option value="false">Nonaktif (Sembunyikan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">URL Gambar Layanan</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rincian cakupan pembersihan, chemical yang dipakai, dll."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddonFormModalProps {
  addon: ServiceAddon | null;
  services: Service[];
  onClose: () => void;
  onSave: (data: Partial<ServiceAddon>) => void;
}

const AddonFormModal: React.FC<AddonFormModalProps> = ({
  addon,
  services,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(addon?.name || '');
  const [serviceId, setServiceId] = useState(addon?.service_id || services[0]?.id || 'srv-1');
  const [price, setPrice] = useState(addon?.price?.toString() || '45000');
  const [duration, setDuration] = useState(addon?.duration_minutes?.toString() || '30');
  const [description, setDescription] = useState(addon?.description || '');
  const [isActive, setIsActive] = useState(addon?.is_active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nama add-on wajib diisi');
    onSave({
      name,
      service_id: serviceId,
      price: Number(price) || 30000,
      duration_minutes: Number(duration) || 30,
      description,
      is_active: isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            {addon ? 'Edit Layanan Tambahan (Add-on)' : 'Tambah Add-on Baru'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Add-on *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Disinfeksi Fogging Ruangan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                step="5000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimasi Menit *</label>
              <input
                type="number"
                required
                min="5"
                step="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Ringkas</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan singkat..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addonActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="addonActive" className="font-semibold text-slate-700 cursor-pointer">
              Aktifkan Add-on di Menu Booking Customer
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Simpan Add-on
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PricingRuleFormModalProps {
  rule: PricingRule | null;
  services: Service[];
  onClose: () => void;
  onSave: (data: Partial<PricingRule>) => void;
}

const PricingRuleFormModal: React.FC<PricingRuleFormModalProps> = ({
  rule,
  services,
  onClose,
  onSave,
}) => {
  const [propertyType, setPropertyType] = useState(rule?.property_type || 'Rumah');
  const [minArea, setMinArea] = useState(rule?.min_area?.toString() || '0');
  const [maxArea, setMaxArea] = useState(rule?.max_area?.toString() || '100');
  const [price, setPrice] = useState(rule?.price?.toString() || '180000');
  const [duration, setDuration] = useState(rule?.duration_minutes?.toString() || '120');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      property_type: propertyType,
      min_area: Number(minArea) || 0,
      max_area: Number(maxArea) || 100,
      price: Number(price) || 100000,
      duration_minutes: Number(duration) || 60,
      is_active: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            {rule ? 'Edit Aturan Tarif Luas' : 'Tambah Aturan Tarif Luas Baru'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tipe Properti</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-medium cursor-pointer"
            >
              <option value="Rumah">Rumah Tapak</option>
              <option value="Apartemen">Apartemen / Rusun</option>
              <option value="Kost">Kost / Paviliun</option>
              <option value="Ruko">Ruko / Kantor / Tempat Usaha</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Luas Min (m²)</label>
              <input
                type="number"
                min="0"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Luas Maks (m²)</label>
              <input
                type="number"
                min="1"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tarif Paket (Rp) *</label>
              <input
                type="number"
                step="5000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-emerald-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Durasi SOP (Menit)</label>
              <input
                type="number"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Simpan Aturan Tarif
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
