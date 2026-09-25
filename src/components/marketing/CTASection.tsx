import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface CTASectionProps {
  onStartBooking: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartBooking }) => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-emerald-800 to-teal-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diskon 20% Pengguna Baru dengan Kode: <strong>BERSIHBARU</strong></span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Siap Menikmati Rumah Bersih Tanpa Rasa Lelah?
          </h2>

          <p className="text-base sm:text-lg text-emerald-100 max-w-xl mx-auto font-light">
            Biarkan cleaner profesional Bersih.in yang menangani semuanya. Pesan sekarang dalam hitungan menit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={onStartBooking}
              className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-xl font-bold text-base px-8 py-3.5 w-full sm:w-auto"
            >
              <span>Pesan Cleaning Sekarang</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Tanpa Biaya Pembatalan s.d 24 Jam</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Garansi Bersih 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Asuransi Kerusakan Tercover</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
