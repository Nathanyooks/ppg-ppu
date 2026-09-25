import React from 'react';
import { CalendarCheck, ShieldCheck, Sparkles, Star } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pilih Layanan & Jadwal',
      desc: 'Tentukan jenis cleaning (Regular, Deep, dll), spesifikasi properti, add-on yang diinginkan, serta tanggal dan jam kedatangan yang pas.',
      icon: CalendarCheck,
    },
    {
      step: '02',
      title: 'Konfirmasi & Pembayaran Aman',
      desc: 'Dapatkan rincian tarif transparan server-side tanpa biaya tersembunyi. Bayar instan via Midtrans (QRIS, Virtual Account, GoPay).',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Cleaner Profesional Hadir',
      desc: 'Mitra berseragam lengkap dan ber-SKCK tiba tepat waktu membawa peralatan canggih dan chemical ramah lingkungan standar RS.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Rumah Berkilau & Beri Review',
      desc: 'Inspeksi hasil kerja dengan tenang. Lengkapi dengan review dan nikmati garansi kebersihan 100% kepuasan pelanggan.',
      icon: Star,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
            Praktis & Terstruktur
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Cara Kerja Bersih.in
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Hanya 4 langkah mudah untuk menikmati kenyamanan hunian yang bersih, higienis, dan harum segar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
