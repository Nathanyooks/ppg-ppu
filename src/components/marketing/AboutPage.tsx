import React from 'react';
import { Sparkles, ShieldCheck, Users, Target, Award, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Mengenal Bersih.in
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meningkatkan Kualitas Hidup Lewat Hunian yang Bersih & Sehat
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bersih.in hadir di Kabupaten Penajam Paser Utara (PPU) dari keinginan kuat: memudahkan masyarakat, keluarga, dan instansi di Penajam, Sepaku / IKN, Waru, dan Babulu menikmati lingkungan hunian dan kerja yang higienis tanpa repot.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Visi Kami</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Menjadi platform layanan kebersihan digital paling terpercaya di Indonesia yang memberdayakan ribuan tenaga kerja lokal dengan standar profesional perhotelan internasional.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-emerald-900 text-white space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Misi Kami</h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Menghadirkan layanan cleaning higienis, aman, dan transparan yang didukung teknologi pemesanan modern serta kemitraan yang adil bagi cleaner profesional.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Pilar Nilai Utama Bersih.in
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 mb-1.5">Integritas & Keamanan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seluruh mitra kami diverifikasi dengan latar belakang ketat (SKCK) dan dilindungi garansi asuransi perlindungan properti.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200">
              <Award className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 mb-1.5">Standar Hospital-Grade</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menggunakan bahan kimia pembersih ramah lingkungan yang aman untuk anak dan hewan peliharaan, namun efektif membunuh bakteri.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200">
              <Users className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 mb-1.5">Pemberdayaan Mitra</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembagian komisi transparan (80% untuk cleaner) dengan jaminan asuransi kesehatan dan pelatihan berkesinambungan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
