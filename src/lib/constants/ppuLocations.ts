import { getPlatformSettings } from './platformSettings';

/**
 * Data Resmi Wilayah Administratif Kabupaten Penajam Paser Utara (PPU), Kalimantan Timur
 * Mencakup 4 Kecamatan beserta seluruh Kelurahan dan Desa secara lengkap.
 */

export interface KelurahanDesa {
  name: string;
  type: 'Kelurahan' | 'Desa';
  postalCode: string;
  isIknZone?: boolean; // Khusus kawasan Sepaku / KIPP Nusantara
  notes?: string;
}

export interface PpuDistrict {
  id: string;
  name: string;
  title: string;
  description: string;
  transportFee: number;
  latitude: number;
  longitude: number;
  kelurahanList: KelurahanDesa[];
}

export const PPU_DISTRICTS: PpuDistrict[] = [
  {
    id: 'penajam',
    name: 'Penajam',
    title: 'Kecamatan Penajam (Pusat Pemerintahan & Perkotaan)',
    description: 'Pusat pemerintahan Kabupaten PPU, kawasan dermaga/pelabuhan, Nipah-Nipah, dan sentra komersial Petung.',
    transportFee: 10000,
    latitude: -1.2587,
    longitude: 116.7725,
    kelurahanList: [
      { name: 'Penajam', type: 'Kelurahan', postalCode: '76141', notes: 'Pusat Kota & Dermaga Klotok/Feri' },
      { name: 'Nenang', type: 'Kelurahan', postalCode: '76142', notes: 'Pusat perkantoran & permukiman' },
      { name: 'Nipah-Nipah', type: 'Kelurahan', postalCode: '76143', notes: 'Kompleks Kantor Bupati PPU' },
      { name: 'Petung', type: 'Kelurahan', postalCode: '76144', notes: 'Kawasan perdagangan utama & pasar induk' },
      { name: 'Gunung Seteleng', type: 'Kelurahan', postalCode: '76145' },
      { name: 'Kampung Baru', type: 'Kelurahan', postalCode: '76146' },
      { name: 'Tanjung Tengah', type: 'Kelurahan', postalCode: '76147' },
      { name: 'Saloloang', type: 'Kelurahan', postalCode: '76148', notes: 'Kawasan pesisir pantai Tanjung Jumlai' },
      { name: 'Pejala', type: 'Kelurahan', postalCode: '76149' },
      { name: 'Jenebora', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Gersik', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Pantai Lango', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Riko', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Sepan', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Sotek', type: 'Kelurahan', postalCode: '76141', notes: 'Lintas Trans Kalimantan PPU - Paser' },
      { name: 'Giri Mukti', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Lawe-Lawe', type: 'Kelurahan', postalCode: '76141', notes: 'Kawasan pesisir & tangki Lawe-Lawe' },
      { name: 'Giripurwa', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Sidorejo', type: 'Kelurahan', postalCode: '76141' },
      { name: 'Bukit Subur', type: 'Desa', postalCode: '76141' },
    ],
  },
  {
    id: 'sepaku',
    name: 'Sepaku',
    title: 'Kecamatan Sepaku (Kawasan Inti & Penyangga IKN Nusantara)',
    description: 'Wilayah inti dan penyangga Ibu Kota Nusantara (IKN), hunian ASN/pekerja konstruksi, dan fasilitas penunjang.',
    transportFee: 25000,
    latitude: -0.9167,
    longitude: 116.7833,
    kelurahanList: [
      { name: 'Sepaku', type: 'Kelurahan', postalCode: '76148', isIknZone: true },
      { name: 'Maridan', type: 'Kelurahan', postalCode: '76148', isIknZone: true },
      { name: 'Mentawir', type: 'Kelurahan', postalCode: '76148', isIknZone: true, notes: 'Wisata Mangrove & Persemaian IKN' },
      { name: 'Pemaluan', type: 'Kelurahan', postalCode: '76148', isIknZone: true },
      { name: 'Bumi Harapan', type: 'Desa', postalCode: '76148', isIknZone: true, notes: 'Zona Kawasan Inti KIPP IKN' },
      { name: 'Binuang', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Karang Jinawi', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Semoi Dua', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Sukaraja', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Suko Mulyo', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Tengin Baru', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Telemow', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Wonorejo', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Argo Mulyo', type: 'Desa', postalCode: '76148', isIknZone: true },
      { name: 'Bukit Raya', type: 'Desa', postalCode: '76148', isIknZone: true },
    ],
  },
  {
    id: 'waru',
    name: 'Waru',
    title: 'Kecamatan Waru',
    description: 'Wilayah hunian keluarga dan perkebunan, berbatasan langsung dengan Penajam dan Babulu.',
    transportFee: 15000,
    latitude: -1.4167,
    longitude: 116.6333,
    kelurahanList: [
      { name: 'Waru', type: 'Kelurahan', postalCode: '76142', notes: 'Ibukota Kecamatan Waru' },
      { name: 'Api-Api', type: 'Desa', postalCode: '76142', notes: 'Kawasan pesisir & tambak' },
      { name: 'Bangun Mulya', type: 'Desa', postalCode: '76142' },
      { name: 'Sesulu', type: 'Desa', postalCode: '76142' },
    ],
  },
  {
    id: 'babulu',
    name: 'Babulu',
    title: 'Kecamatan Babulu (Lumbung Pangan PPU)',
    description: 'Kawasan sentra pertanian dan lumbung pangan Kabupaten Penajam Paser Utara, koridor selatan.',
    transportFee: 20000,
    latitude: -1.5333,
    longitude: 116.4833,
    kelurahanList: [
      { name: 'Babulu Darat', type: 'Desa', postalCode: '76143', notes: 'Pusat Kecamatan & Pasar Babulu' },
      { name: 'Babulu Laut', type: 'Desa', postalCode: '76143', notes: 'Sentra nelayan & tambak' },
      { name: 'Gunung Intan', type: 'Desa', postalCode: '76143' },
      { name: 'Gunung Makmur', type: 'Desa', postalCode: '76143' },
      { name: 'Gunung Mulia', type: 'Desa', postalCode: '76143' },
      { name: 'Labangka', type: 'Desa', postalCode: '76143' },
      { name: 'Labangka Barat', type: 'Desa', postalCode: '76143' },
      { name: 'Rawa Mulia', type: 'Desa', postalCode: '76143' },
      { name: 'Rintik', type: 'Desa', postalCode: '76143' },
      { name: 'Sebakung Jaya', type: 'Desa', postalCode: '76143' },
      { name: 'Sri Rahaja', type: 'Desa', postalCode: '76143' },
      { name: 'Sumber Sari', type: 'Desa', postalCode: '76143' },
    ],
  },
];

export const KABUPATEN_NAME = 'Penajam Paser Utara';
export const PROVINSI_NAME = 'Kalimantan Timur';

/**
 * Mendapatkan daftar kecamatan PPU
 */
export function getPpuDistricts(): PpuDistrict[] {
  return PPU_DISTRICTS;
}

/**
 * Mencari kecamatan berdasarkan nama / id
 */
export function findPpuDistrict(districtNameOrId: string): PpuDistrict | undefined {
  const q = districtNameOrId.toLowerCase().trim();
  return PPU_DISTRICTS.find(
    (d) => d.id === q || d.name.toLowerCase() === q || q.includes(d.name.toLowerCase())
  );
}

/**
 * Mendapatkan kelurahan/desa untuk kecamatan tertentu
 */
export function getKelurahanListByDistrict(districtNameOrId: string): KelurahanDesa[] {
  const district = findPpuDistrict(districtNameOrId);
  return district ? district.kelurahanList : PPU_DISTRICTS[0].kelurahanList;
}

/**
 * Menghitung ongkos transport mitra di wilayah PPU (sinkron dengan pengaturan Master)
 */
export function getPpuTransportFee(districtName?: string): number {
  const settings = getPlatformSettings();
  if (!districtName) return settings.transportFees.penajam;

  const q = districtName.toLowerCase().trim();
  if (q.includes('sepaku')) return settings.transportFees.sepaku;
  if (q.includes('waru')) return settings.transportFees.waru;
  if (q.includes('babulu')) return settings.transportFees.babulu;
  return settings.transportFees.penajam;
}

/**
 * Validasi apakah alamat berada di zona Kabupaten Penajam Paser Utara
 */
export function isValidPpuAddress(district?: string): boolean {
  if (!district) return false;
  const q = district.toLowerCase();
  return (
    q.includes('penajam') ||
    q.includes('sepaku') ||
    q.includes('waru') ||
    q.includes('babulu') ||
    q.includes('paser utara')
  );
}
