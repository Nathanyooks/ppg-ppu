import React from 'react';
import { Service } from '../../types/database';
import { formatRupiah, formatDuration } from '../../lib/utils/formatters';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Check, 
  X, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  SprayCan, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookNow,
}) => {
  if (!service) return null;

  const getServiceDetails = (slug: string) => {
    switch (slug) {
      case 'regular-cleaning':
        return {
          badge: 'Paling Populer',
          includes: [
            'Menyapu & mengepel seluruh lantai ruangan',
            'Membersihkan debu (dusting) meja, rak, dan perabotan utama',
            'Membersihkan wastafel, kloset, dan cermin kamar mandi',
            'Merapikan tempat tidur & mengganti sprei (jika disediakan)',
            'Membuang sampah ke tempat pembuangan luar',
          ],
          excludes: [
            'Membersihkan noda kerak membandel bertahun-tahun (Gunakan Deep Cleaning)',
            'Mencuci piring menumpuk >15 pcs (dapat dipesan via Add-on)',
            'Pembersihan area luar plafon tinggi >3 meter',
          ],
          equipment: [
            'Kain microfiber higienis anti-gores (warna berbeda tiap zona)',
            'Cairan pembersih multi-surface antibakteri ramah anak/hewan',
            'Sapu, pel micro-spin, sikat khusus sanitasi kamar mandi',
          ],
          tiers: [
            { type: 'Apartemen / Studio (< 40 m²)', price: 'Rp 120.000', duration: '90 Menit' },
            { type: 'Rumah Standar (41 - 80 m²)', price: 'Rp 150.000', duration: '120 Menit' },
            { type: 'Rumah Menengah (81 - 150 m²)', price: 'Rp 220.000', duration: '180 Menit' },
            { type: 'Rumah Besar (> 150 m²)', price: 'Rp 320.000', duration: '240 Menit' },
          ],
        };
      case 'deep-cleaning':
        return {
          badge: 'Pembersihan Total',
          includes: [
            'Seluruh cakupan Regular Cleaning',
            'Pembersihan kerak jamur & noda kalsium kamar mandi mendalam',
            'Degreasing minyak kompor dapur & dinding backsplash',
            'Pembersihan celah jendela, kusen pintu, dan saklar listrik',
            'Pembersihan kolong tempat tidur dan perabotan berat yang dapat digeser',
          ],
          excludes: [
            'Repainting atau perbaikan dinding rusak',
            'Pembersihan puing konstruksi semen basah (Gunakan Post-Construction Cleaning)',
          ],
          equipment: [
            'Heavy-duty floor polisher / scrub machine (jika dibutuhkan)',
            'Descaling chemical khusus kerak keramik (tanpa merusak nat)',
            'Steam cleaner uap panas pembasmi bakteri & kuman',
          ],
          tiers: [
            { type: 'Apartemen (s/d 50 m²)', price: 'Rp 300.000', duration: '180 Menit' },
            { type: 'Rumah (51 - 100 m²)', price: 'Rp 450.000', duration: '240 Menit' },
            { type: 'Rumah Besar (101 - 200 m²)', price: 'Rp 700.000', duration: '360 Menit' },
          ],
        };
      default:
        return {
          badge: 'Layanan Spesialis',
          includes: [
            'Pembersihan menyeluruh area spesifik dengan SOP perhotelan',
            'Sanitasi antibakteri dengan chemical bersertifikasi Kemenkes',
            'Pemeriksaan hasil kerja bersama pelanggan',
          ],
          excludes: [
            'Perbaikan struktural atau renovasi fisik',
            'Bahan kimia berbahaya yang merusak material perabot',
          ],
          equipment: [
            'Alat pelindung diri lengkap (masker, sarung tangan nitril)',
            'Peralatan kerja profesional terkalibrasi',
            'Chemical ramah lingkungan',
          ],
          tiers: [
            { type: 'Tarif Dasar', price: formatRupiah(service.base_price), duration: `${service.base_duration_minutes} Menit` },
          ],
        };
    }
  };

  const details = getServiceDetails(service.slug);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.name} maxWidth="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {details.badge}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{service.name}</h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="text-right shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Mulai Dari
            </span>
            <span className="text-xl font-extrabold text-emerald-700 block">
              {formatRupiah(service.base_price)}
            </span>
            <span className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDuration(service.base_duration_minutes)}
            </span>
          </div>
        </div>

        {/* What is Included & Excluded */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Check className="w-4 h-4 text-emerald-600" />
              Termasuk Dalam Layanan:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {details.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-100">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <X className="w-4 h-4 text-rose-600" />
              Tidak Termasuk:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {details.excludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Equipment & Standards */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <SprayCan className="w-4 h-4 text-emerald-600" />
            Peralatan & Chemical yang Dibawa Cleaner:
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anda tidak perlu repot menyiapkan alat apapun. Mitra cleaner Bersih.in datang membawa toolkit standar internasional:
          </p>
          <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-slate-700 pt-1">
            {details.equipment.map((eq, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{eq}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Tiers Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Estimasi Skema Harga Berdasarkan Luas:
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tipe & Luas</th>
                  <th className="py-2.5 px-3 text-right">Estimasi Durasi</th>
                  <th className="py-2.5 px-3 text-right">Tarif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {details.tiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">{tier.type}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{tier.duration}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{tier.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            Harga final akan dihitung otomatis di formulir pemesanan sesuai luas akurat dan add-on yang Anda pilih.
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose}>
            Tutup
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onBookNow(service);
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Pesan {service.name} Sekarang
          </Button>
        </div>
      </div>
    </Modal>
  );
};
