import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ContactPageProps {
  onOpenMitraRegister?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenMitraRegister }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Layanan',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Hubungi Tim Bersih.in
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kami Siap Membantu Anda
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Punya pertanyaan mengenai layanan korporat, kemitraan cleaner, atau kendala booking? Tim CS kami siap merespons dengan cepat.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Kantor Operasional</h3>

              <div className="flex items-start gap-3 text-xs text-slate-600">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Bersih.in Head Office Penajam</strong>
                  Jl. Propinsi KM 1,5, Kel. Penajam, Kec. Penajam, Kab. Penajam Paser Utara, Kalimantan Timur 76141
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">WhatsApp & Telepon CS</strong>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <a
                      href="https://wa.me/6285648373440?text=Halo%20Customer%20Service%20Bersih.in,%20saya%20butuh%20bantuan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      +62 856-4837-3440 (085648373440)
                    </a>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      Respon Cepat
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Layanan bantuan WhatsApp & Panggilan aktif</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Email Resmi</strong>
                  halo@bersih.in / kemitraan@bersih.in
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Jam Layanan Pelanggan</strong>
                  Setiap Hari: 07:00 – 20:00 WITA (Asia/Makassar)
                </div>
              </div>
            </div>

            {/* Quick Partner Box */}
            <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-3">
              <h4 className="font-bold text-base">Ingin Bergabung Jadi Mitra Cleaner?</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Dapatkan penghasilan fleksibel hingga Rp 6.000.000 - Rp 9.000.000/bulan dengan bagi hasil transparan 80%, asuransi, dan pelatihan resmi.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenMitraRegister}
                className="bg-white text-emerald-900 font-bold hover:bg-emerald-50"
              >
                Daftar Mitra Cleaner
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Pesan Anda Berhasil Terkirim!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Terima kasih telah menghubungi Bersih.in. Tim customer care kami akan membalas via WhatsApp atau email dalam kurun waktu 1x24 jam.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Kirim Pesan Langsung</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08123456789"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topik Pesan</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Pertanyaan Layanan">Pertanyaan Layanan Cleaning</option>
                    <option value="Kemitraan Komersial">Kerjasama Kantor / Korporat</option>
                    <option value="Pendaftaran Mitra">Pendaftaran Mitra Cleaner</option>
                    <option value="Keluhan Layanan">Keluhan / Komplain Booking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pesan atau Kebutuhan Anda</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan detail pertanyaan atau jadwal estimasi yang Anda butuhkan..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Pesan Sekarang
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
