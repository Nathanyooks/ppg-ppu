import React, { useState } from 'react';
import { MapPin, CheckCircle2, Search, Building2, Sparkles, Navigation } from 'lucide-react';
import { PPU_DISTRICTS, KABUPATEN_NAME, PROVINSI_NAME } from '../../lib/constants/ppuLocations';

export const ServiceAreaSection: React.FC = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalKelurahanDesa = PPU_DISTRICTS.reduce(
    (acc, curr) => acc + curr.kelurahanList.length,
    0
  );

  const filteredDistricts = PPU_DISTRICTS.filter((d) => {
    if (selectedDistrictId !== 'all' && d.id !== selectedDistrictId) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchDistrict = d.name.toLowerCase().includes(q) || d.title.toLowerCase().includes(q);
    const matchKelurahan = d.kelurahanList.some(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.postalCode.includes(q) ||
        (k.notes && k.notes.toLowerCase().includes(q))
    );
    return matchDistrict || matchKelurahan;
  });

  return (
    <section id="service-areas" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Zona Wilayah Layanan PPU
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Cakupan Resmi {KABUPATEN_NAME}
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            Bersih.in berfokus penuh melayani seluruh pelosok <strong>Kabupaten Penajam Paser Utara</strong> ({PROVINSI_NAME}). Menjangkau <strong>4 Kecamatan</strong> dan <strong>{totalKelurahanDesa} Kelurahan & Desa</strong>, termasuk kawasan penyangga dan hunian IKN Nusantara di Sepaku.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="max-w-4xl mx-auto mb-8 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kelurahan/desa (cth: Nipah-Nipah, Bumi Harapan, Petung, Waru)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedDistrictId('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                selectedDistrictId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Kecamatan ({PPU_DISTRICTS.length})
            </button>
            {PPU_DISTRICTS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                  selectedDistrictId === d.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.name} {d.name === 'Sepaku' ? '(IKN)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* District Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredDistricts.map((district) => {
            const matchingKelurahan = district.kelurahanList.filter((k) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                k.name.toLowerCase().includes(q) ||
                k.postalCode.includes(q) ||
                (k.notes && k.notes.toLowerCase().includes(q))
              );
            });

            return (
              <div
                key={district.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900">
                          Kecamatan {district.name}
                        </h3>
                        {district.name === 'Sepaku' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Zona IKN
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        {district.title}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shrink-0">
                      Aktif Melayani
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {district.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Daftar Kelurahan & Desa Terverifikasi ({matchingKelurahan.length}):</span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        Ongkos Transport: Rp {district.transportFee.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 py-1">
                      {matchingKelurahan.map((item) => (
                        <div
                          key={item.name}
                          className={`p-2 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                            item.isIknZone
                              ? 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                              : 'bg-slate-50/70 border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 leading-tight">
                              {item.name}
                            </span>
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-semibold shrink-0 ${
                                item.type === 'Kelurahan'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.type === 'Kelurahan' ? 'Kel' : 'Desa'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 text-[10px] text-slate-500">
                            <span>Pos {item.postalCode}</span>
                            {item.isIknZone && (
                              <span className="text-[9px] font-bold text-amber-700">IKN</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    Kabupaten Penajam Paser Utara
                  </span>
                  <span className="font-semibold text-emerald-700">Mitra Siap Sedia</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDistricts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              Kelurahan/Desa "{searchQuery}" tidak ditemukan
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Pastikan ejaan benar sesuai daftar wilayah Kabupaten Penajam Paser Utara.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
