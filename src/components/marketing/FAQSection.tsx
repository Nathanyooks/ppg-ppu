import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ_DATA = [
  {
    q: 'Apakah cleaner membawa peralatan dan chemical pembersih sendiri?',
    a: 'Ya, seluruh mitra cleaner Bersih.in wajib dan selalu membawa paket peralatan lengkap, mulai dari vacuum cleaner, mesin polisher/ekstraksi (jika ada order cuci sofa/kasur), squeegee kaca, kain mikrofiber steril, hingga chemical pembersih hospital-grade yang aman bagi anak dan hewan peliharaan.',
  },
  {
    q: 'Bagaimana sistem penghitungan harga di Bersih.in?',
    a: 'Harga dihitung transparan secara real-time di server kami berdasarkan tipe properti (Rumah, Apartemen, Kost, Kantor), luas area (m²), durasi estimasi pengerjaan, serta add-on tambahan yang Anda pilih. Tidak ada biaya tersembunyi ataupun pungutan tambahan di lokasi.',
  },
  {
    q: 'Bagaimana jika saya perlu membatalkan atau reschedule jadwal?',
    a: 'Anda dapat melakukan reschedule atau pembatalan langsung melalui menu booking Anda. Pembatalan lebih dari 24 jam sebelum jadwal berhak mendapatkan pengembalian dana 100% (Full Refund). Pembatalan 12-24 jam sebelum jadwal dikenakan biaya administrasi sebagian sesuai kebijakan platform.',
  },
  {
    q: 'Apakah tenaga cleaner aman dan terpercaya untuk masuk ke rumah saya?',
    a: 'Sangat aman. Seluruh cleaner telah melalui verifikasi identitas (KTP), verifikasi Surat Keterangan Catatan Kepolisian (SKCK), wawancara psikologis, dan pelatihan intensif standar perhotelan & BNSP. Selain itu, kami menyertakan perlindungan asuransi kerusakan properti hingga Rp 5.000.000.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Kami terintegrasi resmi dengan Midtrans Payment Gateway, mendukung QRIS (BCA, GoPay, OVO, Dana, LinkAja, ShopeePay), Transfer Virtual Account (BCA, Mandiri, BNI, BRI, Permata), dan Kartu Kredit/Debit berlogo Visa/Mastercard.',
  },
  {
    q: 'Apa yang harus saya lakukan jika hasil pembersihan kurang memuaskan?',
    a: 'Kami menyediakan Garansi 100% Kepuasan. Hubungi kami dalam kurun waktu 24 jam setelah status pengerjaan selesai dengan menyertakan foto area yang belum bersih, dan kami akan menjadwalkan kunjungan re-cleaning tanpa biaya tambahan.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Pusat Bantuan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Temukan jawaban cepat seputar layanan, keamanan, dan proses pemesanan di Bersih.in.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
