import React from 'react';
import { Sparkles, ShieldCheck, Star, Clock, CheckCircle2, ArrowRight, UserPlus, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onStartBooking: () => void;
  onViewServices: () => void;
  onOpenRegister?: () => void;
  onOpenMitraRegister?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onViewServices,
  onOpenRegister,
  onOpenMitraRegister,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Platform Cleaning No. 1 di Penajam Paser Utara & Kawasan IKN</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Rumah Bersih, <br className="hidden sm:inline" />
                <span className="text-emerald-600">Hidup Lebih Nyaman.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Pesan jasa cleaning profesional terpercaya langsung dari rumah Anda. Didukung tenaga terlatih, peralatan standar hospital-grade, dan garansi kebersihan 100%.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartBooking}
                className="w-full sm:w-auto text-base shadow-lg shadow-emerald-600/25 group"
              >
                <span>Pesan Cleaning</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-base border border-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>Daftar Customer Baru</span>
                </button>
              )}

              {onOpenMitraRegister && (
                <button
                  onClick={onOpenMitraRegister}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-sm border border-teal-300 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>Gabung Mitra Cleaner</span>
                </button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={onViewServices}
                className="w-full sm:w-auto text-base border-slate-300"
              >
                Lihat Layanan
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-left">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">100% Terverifikasi</h4>
                  <p className="text-[11px] text-slate-500">Cek SKCK & Sertifikasi BNSP</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Garansi Kepuasan</h4>
                  <p className="text-[11px] text-slate-500">Free re-cleaning jika kurang bersih</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Tepat Waktu</h4>
                  <p className="text-[11px] text-slate-500">Jadwal fleksibel jam 08:00 - 18:00 WITA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                  alt="Tenaga Profesional Bersih.in"
                  className="w-full h-96 sm:h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-3 py-1 bg-emerald-500 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                    Hospital-Grade Chemical
                  </span>
                  <h3 className="text-lg font-bold">Standard Sanitasi & Higienis Tinggi</h3>
                  <p className="text-xs text-white/80">Aman untuk balita, anak-anak, dan hewan peliharaan</p>
                </div>
              </div>

              {/* Social Proof */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-slate-900">4.95 / 5.0</span>
                    <span className="text-xs text-slate-400">(2.800+ ulasan)</span>
                  </div>
                  <p className="text-xs text-slate-600">Dipilih oleh 3.500+ keluarga & kantor di Kab. PPU</p>
                </div>
              </div>

              {/* Live Badge */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2 shadow-lg border border-slate-100 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700">Mitra Siap Bertugas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
