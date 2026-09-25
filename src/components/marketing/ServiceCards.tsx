import React from 'react';
import { Service } from '../../types/database';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatRupiah, formatDuration } from '../../lib/utils/formatters';
import { Clock, ArrowRight, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../../lib/auth/authContext';

interface ServiceCardsProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  onViewDetail?: (service: Service) => void;
  onEditService?: (service: Service) => void;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ services, onSelectService, onViewDetail, onEditService }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  return (
    <section className="py-16 sm:py-24 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Layanan Kami
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilihan Solusi Kebersihan Lengkap
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Dari pembersihan rutin harian hingga deep cleaning kerak membandel, tenaga profesional kami siap melayani properti Anda dengan standar tertinggi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              hover
              className="p-0 overflow-hidden flex flex-col group border-slate-200"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={service.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 shadow-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{formatDuration(service.base_duration_minutes)}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed flex-1">
                  {service.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold block">Mulai dari</span>
                    <span className="text-base font-extrabold text-emerald-800">
                      {formatRupiah(service.base_price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSuperAdmin && onEditService && (
                      <button
                        type="button"
                        onClick={() => onEditService(service)}
                        className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit Layanan & Harga Ini di Panel Master"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                    {onViewDetail && (
                      <button
                        type="button"
                        onClick={() => onViewDetail(service)}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Detail
                      </button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectService(service)}
                      className="font-bold text-xs"
                    >
                      <span>Pesan</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
