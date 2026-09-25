import React, { useState } from 'react';
import { Service, ServiceCategory } from '../../types/database';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatRupiah, formatDuration } from '../../lib/utils/formatters';
import { Clock, ArrowRight, CheckCircle2, Sparkles, Filter, Settings } from 'lucide-react';
import { useAuth } from '../../lib/auth/authContext';

interface ServicesPageProps {
  services: Service[];
  categories: ServiceCategory[];
  onSelectService: (service: Service) => void;
  onViewDetail?: (service: Service) => void;
  onEditService?: (service: Service) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  categories,
  onSelectService,
  onViewDetail,
  onEditService,
}) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredServices = selectedCategory === 'ALL'
    ? services
    : services.filter((s) => s.category_id === selectedCategory);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Katalog Layanan Bersih.in
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Solusi Kebersihan Terlengkap
          </h1>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Semua paket dikerjakan oleh cleaner profesional ber-SKCK dengan peralatan modern dan chemical ramah lingkungan standar rumah sakit.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Semua Layanan ({services.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              hover
              className="p-0 overflow-hidden flex flex-col bg-white border-slate-200 group"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={service.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formatDuration(service.base_duration_minutes)}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Chemical Hospital-Grade & Ramah Lingkungan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Garansi Re-Cleaning 100% Kepuasan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Mulai dari</span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      {formatRupiah(service.base_price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSuperAdmin && onEditService && (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => onEditService(service)}
                        className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold"
                        title="Edit Layanan & Harga Ini di Panel Master"
                      >
                        <Settings className="w-3.5 h-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>
                    )}
                    {onViewDetail && (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => onViewDetail(service)}
                        className="text-xs"
                      >
                        Detail & SOP
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onSelectService(service)}
                      className="font-semibold shadow-emerald-500/20 text-xs"
                    >
                      <span>Pesan</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
