import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Bike,
  UserCheck,
  CreditCard,
  Building2,
  Coins,
  ChevronRight,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileCheck,
} from 'lucide-react';
import { PPU_DISTRICTS } from '../../lib/constants/ppuLocations';
import { dbStore } from '../../lib/database/supabaseClient';
import { Button } from '../ui/Button';

interface MitraRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MitraRegistrationModal: React.FC<MitraRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState<'requirements' | 'form' | 'success'>('requirements');

  // Form State
  const [fullName, setFullName] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState(PPU_DISTRICTS[0].name);
  const [kelurahan, setKelurahan] = useState(PPU_DISTRICTS[0].kelurahanList[0]?.name || '');
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState('Sepeda Motor');
  const [hasSimC, setHasSimC] = useState(true);
  const [hasSkck, setHasSkck] = useState(true);
  const [experience, setExperience] = useState('1-2 Tahun Pengalaman Cleaning Service');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([
    'Regular House Cleaning',
    'Deep Cleaning Kamar Mandi',
  ]);
  const [bankName, setBankName] = useState('Bank Mandiri');
  const [bankAccount, setBankAccount] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentDistrictObj = PPU_DISTRICTS.find((d) => d.name === district) || PPU_DISTRICTS[0];

  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const distObj = PPU_DISTRICTS.find((d) => d.name === dName);
    if (distObj && distObj.kelurahanList.length > 0) {
      setKelurahan(distObj.kelurahanList[0].name);
    }
  };

  const toggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(selectedSpecializations.filter((s) => s !== spec));
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !nik || !phone || !email || !bankAccount || !bankHolder) {
      setErrorMsg('Harap lengkapi semua kolom wajib.');
      return;
    }

    if (nik.length !== 16) {
      setErrorMsg('Nomor NIK KTP harus berjumlah 16 digit.');
      return;
    }

    if (!agreedTerms) {
      setErrorMsg('Anda harus menyetujui syarat & ketentuan kemitraan.');
      return;
    }

    setIsSubmitting(true);

    try {
      dbStore.createMitraApplication({
        full_name: fullName,
        nik,
        email,
        phone,
        district,
        kelurahan,
        address,
        vehicle_type: vehicleType,
        has_sim_c: hasSimC,
        has_skck: hasSkck,
        experience,
        specializations: selectedSpecializations,
        bank_name: bankName,
        bank_account: bankAccount,
        bank_holder: bankHolder,
        notes: `Pendaftar baru wilayah Kec. ${district} (${kelurahan}). Password akun disiapkan.`,
      });

      setIsSubmitting(false);
      setActiveStep('success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Terjadi kesalahan saat menyimpan formulir.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Kemitraan Resmi Bersih.in
            </span>
            <span className="text-emerald-200 text-xs">• Kab. Penajam Paser Utara</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Pendaftaran Mitra Professional Cleaner PPU
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
            Bergabunglah menjadi mitra kebersihan profesional terpercaya di 4 Kecamatan Penajam Paser Utara & Kawasan IKN Sepaku. Penghasilan fleksibel hingga Rp 6.000.000/bulan.
          </p>

          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-emerald-600/50 text-xs font-semibold">
            <button
              onClick={() => setActiveStep('requirements')}
              className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors cursor-pointer ${
                activeStep === 'requirements'
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-emerald-200/70 hover:text-white'
              }`}
            >
              <span>1. Syarat & Keuntungan</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <button
              onClick={() => setActiveStep('form')}
              className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors cursor-pointer ${
                activeStep === 'form'
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-emerald-200/70 hover:text-white'
              }`}
            >
              <span>2. Formulir Pendaftaran Akun</span>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 text-xs">
          {activeStep === 'requirements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    80%
                  </div>
                  <strong className="block text-slate-900 text-xs font-black">
                    Bagi Hasil Tertinggi
                  </strong>
                  <p className="text-[11px] text-slate-500">
                    Bagi hasil transparan hingga 80% per pekerjaan plus 100% tipping dari pelanggan.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <strong className="block text-slate-900 text-xs font-black">
                    Jadwal Kerja Fleksibel
                  </strong>
                  <p className="text-[11px] text-slate-500">
                    Pilih hari dan jam kerja Anda sendiri, serta wilayah kecamatan operasional Anda di PPU.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <strong className="block text-slate-900 text-xs font-black">
                    Starter Pack & Pelatihan
                  </strong>
                  <p className="text-[11px] text-slate-500">
                    Dapatkan rompi/seragam resmi, sertifikasi SOP housekeeping, dan asuransi kecelakaan kerja.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Syarat & Kualifikasi Calon Mitra Cleaner PPU
                  </h3>
                </div>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {[
                    {
                      title: '1. Identitas & Domisili',
                      desc: 'Warga Negara Indonesia (WNI), usia 18 – 50 tahun. Memiliki KTP asli dan berdomisili di Kabupaten Penajam Paser Utara (Kec. Penajam, Sepaku, Waru, atau Babulu) atau sekitarnya.',
                    },
                    {
                      title: '2. Kendaraan & SIM',
                      desc: 'Memiliki kendaraan bermotor roda dua (motor) pribadi dalam kondisi prima dan SIM C aktif untuk mobilitas ke alamat pelanggan.',
                    },
                    {
                      title: '3. Smartphone & Konektivitas',
                      desc: 'Memiliki HP Android/iOS dengan koneksi internet aktif dan WhatsApp untuk menerima notifikasi penugasan pesanan real-time.',
                    },
                    {
                      title: '4. Rekening Bank Penerima Payout',
                      desc: 'Memiliki rekening bank (Mandiri, BCA, BRI, Bankaltimtara, dll.) atas nama sendiri untuk pencairan penghasilan mingguan otomatis.',
                    },
                    {
                      title: '5. Bebas Catatan Kriminal (SKCK)',
                      desc: 'Memiliki Surat Keterangan Catatan Kepolisian (SKCK) aktif atau bersedia menyerahkan surat kelakuan baik dari RT/Kelurahan setempat.',
                    },
                    {
                      title: '6. Kejujuran, Keramahan & Komitmen SOP',
                      desc: 'Bersedia mengikuti induction training standar higienis Bersih.in dan menjunjung tinggi etika kesopanan serta kejujuran saat bekerja di rumah pelanggan.',
                    },
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs">{req.title}</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{req.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
                <strong className="block text-xs font-bold uppercase tracking-wider">
                  Alur Seleksi Kemitraan:
                </strong>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-800 font-medium">
                  <li>Isi formulir pendaftaran akun mitra di bawah ini secara lengkap.</li>
                  <li>Verifikasi berkas oleh Superadmin/Operasional PPU (1x24 jam).</li>
                  <li>Briefing online via WhatsApp atau temu darat di kantor KCP Penajam.</li>
                  <li>Akun diaktifkan, seragam dikirim, dan Anda langsung siap menerima order!</li>
                </ol>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                  onClick={() => setActiveStep('form')}
                >
                  <span>Lanjutkan ke Formulir Pendaftaran</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>A. Data Diri & Pembuatan Akun Mitra</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Nama Lengkap (sesuai KTP) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Bambang Irawan"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Nomor Induk Kependudukan (NIK KTP 16 Digit) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="6409xxxxxxxxxxxx"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Nomor WhatsApp / HP Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Email Aktif *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="bambang.cleaner@gmail.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Buat Kata Sandi Akun Mitra *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Digunakan untuk masuk ke akun mitra cleaner Bersih.in setelah diverifikasi.
                  </span>
                </div>
              </div>

              {/* Bagian B: Domisili */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>B. Wilayah Domisili di Penajam Paser Utara</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Kecamatan Domisili Utama *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium cursor-pointer"
                    >
                      {PPU_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.name}>
                          Kecamatan {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Kelurahan / Desa Domisili *
                    </label>
                    <select
                      value={kelurahan}
                      onChange={(e) => setKelurahan(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium cursor-pointer"
                    >
                      {currentDistrictObj.kelurahanList.map((k) => (
                        <option key={k.name} value={k.name}>
                          [{k.type}] {k.name} ({k.postalCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Alamat Lengkap Tempat Tinggal (RT/RW / Jalan) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Propinsi KM 4 RT 08 No 12, Petung, Kec. Penajam..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* Bagian C: Pengalaman */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>C. Pengalaman & Keahlian Kebersihan</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Pengalaman Kerja di Bidang Kebersihan *
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                  >
                    <option value="Baru Mulai (Bersedia Ikut Pelatihan SOP Penuh)">
                      Baru Mulai (Bersedia Ikut Pelatihan SOP Penuh)
                    </option>
                    <option value="1-2 Tahun Pengalaman Cleaning Service / Rumah Tangga">
                      1-2 Tahun Pengalaman Cleaning Service / Rumah Tangga
                    </option>
                    <option value="3-5 Tahun Pengalaman Housekeeping Hotel / Villa / Kantor">
                      3-5 Tahun Pengalaman Housekeeping Hotel / Villa / Kantor
                    </option>
                    <option value="Lebih dari 5 Tahun (Senior Housekeeping)">
                      Lebih dari 5 Tahun (Senior Housekeeping)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Keahlian Khusus yang Dikuasai (Pilih yang sesuai):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Regular House Cleaning',
                      'Deep Cleaning Kamar Mandi',
                      'Pembersihan Kaca & Jendela',
                      'Vacuum Sofa & Kasur Tungau',
                      'Setrika & Lipat Pakaian',
                      'Disinfeksi Fogging Ruangan',
                    ].map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                          selectedSpecializations.includes(spec)
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{spec}</span>
                        {selectedSpecializations.includes(spec) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bagian D: Rekening Bank */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>D. Rekening Bank untuk Pembayaran Gaji / Bagi Hasil</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Nama Bank *</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium cursor-pointer"
                    >
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="Bank Central Asia (BCA)">BCA</option>
                      <option value="Bank Rakyat Indonesia (BRI)">BRI</option>
                      <option value="Bank Negara Indonesia (BNI)">BNI</option>
                      <option value="Bankaltimtara">Bankaltimtara</option>
                      <option value="BSI">Bank Syariah Indonesia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Nomor Rekening *</label>
                    <input
                      type="text"
                      required
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Contoh: 1490088771123"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Atas Nama (A/N) *</label>
                    <input
                      type="text"
                      required
                      value={bankHolder}
                      onChange={(e) => setBankHolder(e.target.value.toUpperCase())}
                      placeholder="Nama di buku tabungan"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSimC && hasSkck}
                    onChange={(e) => {
                      setHasSimC(e.target.checked);
                      setHasSkck(e.target.checked);
                    }}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-700">
                    Saya menyatakan memiliki <strong>Sepeda Motor pribadi, SIM C aktif</strong>, dan <strong>SKCK/Surat Kelakuan Baik</strong> yang sah.
                  </span>
                </label>

                <label className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-900 font-semibold">
                    Saya menyetujui seluruh Syarat & Ketentuan Kemitraan Bersih.in PPU, bersedia mematuhi Kode Etik & SOP, serta data yang saya berikan adalah benar.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('requirements')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  &larr; Lihat Syarat
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  {isSubmitting ? 'Mengirim Formulir...' : 'Kirim Pendaftaran Mitra'}
                </Button>
              </div>
            </form>
          )}

          {activeStep === 'success' && (
            <div className="py-8 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Pendaftaran Mitra Berhasil Dikirim!
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Terima kasih, <strong>{fullName}</strong>. Berkas pendaftaran kemitraan Anda untuk wilayah <strong>Kec. {district}</strong> telah tersimpan di sistem operasional Bersih.in PPU.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-[11px] text-slate-700">
                <strong className="block text-slate-900 font-bold">Tahapan Selanjutnya:</strong>
                <p>1. Tim Superadmin Operasional PPU akan memverifikasi NIK dan data rekening Anda dalam 1x24 jam.</p>
                <p>2. Anda akan dihubungi via WhatsApp ke nomor <span className="font-mono font-bold text-emerald-700">{phone}</span> untuk jadwal induction/pengambilan starter pack.</p>
                <p>3. Status pendaftaran juga dapat langsung dipantau oleh Superadmin di konsol manajemen mitra.</p>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={onClose}
              >
                Selesai & Tutup
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
