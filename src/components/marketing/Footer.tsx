import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenMitraRegister?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenMitraRegister }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Bersih<span className="text-emerald-400">.in</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform digital pemesanan jasa kebersihan rumah, apartemen, kos, dan kantor terpercaya di Indonesia. Menghadirkan kenyamanan hunian higienis dengan tenaga profesional bersertifikasi.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jl. Propinsi KM 1,5, Kel. Penajam, Kab. Penajam Paser Utara 76141</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Operasional: Senin – Minggu, 07:00 – 20:00 WITA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6285648373440?text=Halo%20Customer%20Service%20Bersih.in,%20saya%20butuh%20bantuan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors font-medium"
                >
                  WhatsApp CS: 0856-4837-3440
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Layanan */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Layanan Utama
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors cursor-pointer">Regular Cleaning</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors cursor-pointer">Deep Cleaning</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors cursor-pointer">Move In / Move Out</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors cursor-pointer">Office Cleaning</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors cursor-pointer">Cuci Sofa & Kasur</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-emerald-400 transition-colors cursor-pointer">Restorasi Kamar Mandi</button></li>
            </ul>
          </div>

          {/* Col 3: Navigasi */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">Tentang Kami</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-emerald-400 transition-colors cursor-pointer">Tanya Jawab (FAQ)</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">Hubungi Kami</button></li>
              <li>
                <button
                  onClick={onOpenMitraRegister || (() => onNavigate('contact'))}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  Karir & Rekrutmen Staff &rarr;
                </button>
              </li>
              <li><span className="text-slate-500">Kebijakan Privasi</span></li>
              <li><span className="text-slate-500">Syarat & Ketentuan</span></li>
            </ul>
          </div>

          {/* Col 4: Keamanan & Pembayaran */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Keamanan Pembayaran
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Transaksi aman terverifikasi otomatis via Midtrans Gateway:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-center text-slate-200">
                QRIS
              </span>
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-center text-slate-200">
                BCA
              </span>
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-center text-slate-200">
                Mandiri
              </span>
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-center text-slate-200">
                BNI
              </span>
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-center text-slate-200">
                BRI
              </span>
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-bold text-center text-slate-200">
                GoPay
              </span>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>256-bit SSL Bank Grade Security</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Bersih.in. Hak Cipta Dilindungi Undang-Undang Republik Indonesia.</p>
          <div className="flex items-center gap-6">
            <span>Zona Waktu: Asia/Makassar (WITA)</span>
            <span>Mata Uang: IDR (Rp)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
