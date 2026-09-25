import React from 'react';
import { ShieldCheck, Sparkles, HeartHandshake, Award, Leaf, Zap } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Tenaga Kerja Terverifikasi SKCK & BNSP',
      desc: 'Setiap mitra cleaning melewati seleksi ketat pemeriksaan catatan kepolisian (SKCK), tes kesehatan, serta sertifikasi keterampilan housekeeping profesional.',
    },
    {
      icon: Leaf,
      title: 'Chemical Ramah Lingkungan & Hospital-Grade',
      desc: 'Cairan pembersih yang kami gunakan bersertifikasi aman untuk pernapasan, non-toksik bagi balita dan anabul kesayangan Anda, namun efektif membunuh kuman hingga 99.9%.',
    },
    {
      icon: HeartHandshake,
      title: 'Garansi Bersih 100% Kepuasan',
      desc: 'Jika Anda menemukan bagian yang terlewat atau belum memenuhi standar kebersihan kami, laporkan dalam 24 jam dan kami kirimkan tim re-cleaning tanpa biaya tambahan.',
    },
    {
      icon: Award,
      title: 'Perlindungan Asuransi Kerusakan Properti',
      desc: 'Rasa tenang sepenuhnya saat cleaning berlangsung dengan proteksi pertanggungan asuransi ganti rugi hingga Rp 5.000.000 untuk barang properti Anda.',
    },
    {
      icon: Zap,
      title: 'Sistem Pembayaran Digital & Terintegrasi',
      desc: 'Transparan tanpa tip paksaan atau biaya tak terduga. Terintegrasi payment gateway Midtrans dengan keamanan enkripsi perbankan.',
    },
    {
      icon: Sparkles,
      title: 'Peralatan Modern & Terawat',
      desc: 'Menggunakan mesin hidro-vakum ekstraksi mutakhir, squeegee kaca profesional, steam cleaner bertekanan tinggi, dan kain mikrofiber berkode warna higienis.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Kenapa Bersih.in?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Standar Kebersihan Bintang Lima untuk Rumah Anda
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Kami mengutamakan keselamatan, ketelitian, dan kenyamanan keluarga Anda di setiap sentuhan layanan kami.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
