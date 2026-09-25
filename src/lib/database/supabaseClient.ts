import { createClient } from '@supabase/supabase-js';
import {
  Profile,
  Service,
  ServiceCategory,
  ServiceAddon,
  PricingRule,
  Booking,
  Address,
  Coupon,
  Review,
  NotificationItem,
  AuditLog,
  CleanerProfile,
  Payment,
  BookingStatusHistory,
  MitraApplication,
} from '../../types/database';

// Client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-bersihin.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initial Seed Data for Isomorphic / Instant Demo Mode
export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    category_id: 'cat-1',
    name: 'Regular Cleaning',
    slug: 'regular-cleaning',
    description: 'Pembersihan rutin komprehensif: sapu, pel lantai, pembersihan debu perabotan, rapikan tempat tidur, sanitasi ringan, dan pembuangan sampah.',
    base_price: 150000,
    base_duration_minutes: 120,
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    category_id: 'cat-2',
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    description: 'Pembersihan mendalam untuk kerak menahun kamar mandi, kerak kompor, grease trap dapur, celah jendela, dan detail menyeluruh sudut ruangan.',
    base_price: 275000,
    base_duration_minutes: 180,
    image_url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-3',
    category_id: 'cat-3',
    name: 'Move In / Move Out',
    slug: 'move-in-out',
    description: 'Pembersihan pasca renovasi atau persiapan serah terima unit hunian/properti kosong agar bersih kinclong siap huni.',
    base_price: 350000,
    base_duration_minutes: 240,
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-4',
    category_id: 'cat-3',
    name: 'Office & Commercial',
    slug: 'office-cleaning',
    description: 'Perawatan kebersihan ruang kantor, co-working space, meeting room, pantry, dan meja kerja secara higienis dan berkala.',
    base_price: 220000,
    base_duration_minutes: 150,
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-5',
    category_id: 'cat-4',
    name: 'Sofa Cleaning',
    slug: 'sofa-cleaning',
    description: 'Sedot debu dan tungau basah/kering dengan chemical khusus anti-jamur, penghilang noda makanan & penghilang bau tak sedap.',
    base_price: 180000,
    base_duration_minutes: 90,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-6',
    category_id: 'cat-4',
    name: 'Mattress Cleaning',
    slug: 'mattress-cleaning',
    description: 'Vakum hidro-ekstraksi kasur springbed dari alergen, debu mikro, tungau kasur, dan noda keringat untuk tidur higienis.',
    base_price: 160000,
    base_duration_minutes: 80,
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-7',
    category_id: 'cat-2',
    name: 'Kitchen Detailing',
    slug: 'kitchen-cleaning',
    description: 'Degreasing kerak minyak kompor, cooker hood, kitchen set, backsplash, wastafel cuci piring, dan microwave.',
    base_price: 140000,
    base_duration_minutes: 90,
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'srv-8',
    category_id: 'cat-2',
    name: 'Bathroom Restoration',
    slug: 'bathroom-cleaning',
    description: 'Pembersihan kerak air kaca shower, kloset berkerak membandel, nat keramik berlumut, dan exhaust fan kamar mandi.',
    base_price: 130000,
    base_duration_minutes: 90,
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1', name: 'Residential Cleaning', slug: 'residential', description: 'Pembersihan harian dan berkala hunian', is_active: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Deep Clean & Detailing', slug: 'deep-clean', description: 'Restorasi kerak dan noda membandel', is_active: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Pindahan & Komersial', slug: 'commercial-move', description: 'Kantor dan persiapan unit kosong', is_active: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Hydro Vacuum & Mebel', slug: 'hydro-vacuum', description: 'Cuci sofa, kasur, gorden berdebu & bertungau', is_active: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_ADDONS: ServiceAddon[] = [
  { id: 'add-1', service_id: 'srv-1', name: 'Cleaning Kulkas Dalam', description: 'Pengosongan, pencairan es, sanitasi rak & deodorizing', price: 50000, duration_minutes: 30, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'add-2', service_id: 'srv-1', name: 'Disinfeksi Fogging Ruangan', description: 'Sterilisasi ruangan dengan cairan disinfektan food-grade', price: 75000, duration_minutes: 30, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'add-3', service_id: 'srv-1', name: 'Setrika Pakaian (Maks 20 Pcs)', description: 'Penyetrikaan rapi pakaian harian dengan wangi tahan lama', price: 60000, duration_minutes: 45, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'add-4', service_id: 'srv-1', name: 'Pembersihan Kaca Jendela Luar', description: 'Pembersihan kaca luar lantai 1 dengan squeegee profesional', price: 40000, duration_minutes: 30, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_PRICING_RULES: PricingRule[] = [
  { id: 'pr-1', service_id: 'srv-1', property_type: 'Rumah', min_area: 0, max_area: 50, price: 150000, duration_minutes: 120, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'pr-2', service_id: 'srv-1', property_type: 'Rumah', min_area: 51, max_area: 100, price: 220000, duration_minutes: 180, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'pr-3', service_id: 'srv-1', property_type: 'Rumah', min_area: 101, max_area: 200, price: 320000, duration_minutes: 240, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'pr-4', service_id: 'srv-1', property_type: 'Apartemen', min_area: 0, max_area: 40, price: 130000, duration_minutes: 90, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'pr-5', service_id: 'srv-1', property_type: 'Apartemen', min_area: 41, max_area: 80, price: 180000, duration_minutes: 150, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'pr-6', service_id: 'srv-1', property_type: 'Kost', min_area: 0, max_area: 30, price: 95000, duration_minutes: 60, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_USERS: Profile[] = [
  {
    id: 'usr-customer-1',
    email: 'budi.santoso@gmail.com',
    full_name: 'Budi Santoso',
    phone: '081234567890',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'CUSTOMER',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-cleaner-1',
    email: 'ahmad.cleaner@bersih.in',
    full_name: 'Ahmad Fauzi (Pro Cleaner)',
    phone: '082155551234',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'CLEANER',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-admin-1',
    email: 'admin@bersih.in',
    full_name: 'Farhan Pratama (Ops Admin)',
    phone: '081122334455',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'ADMIN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-superadmin-1',
    email: 'superadmin@bersih.in',
    full_name: 'Munir Agus Shodikin (Master Admin)',
    phone: '081199887766',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'SUPER_ADMIN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_CLEANER_PROFILES: Record<string, CleanerProfile> = {
  'usr-cleaner-1': {
    id: 'cln-1',
    user_id: 'usr-cleaner-1',
    bio: 'Pemberian sertifikasi BNSP Housekeeping 2024. Pengalaman 5 tahun membersihkan lebih dari 200 properti di Kabupaten Penajam Paser Utara dan Kawasan IKN Sepaku.',
    rating: 4.95,
    total_jobs: 230,
    verification_status: 'VERIFIED',
    employment_status: 'ACTIVE',
    commission_rate: 0.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    user_id: 'usr-customer-1',
    label: 'Rumah Utama (Penajam)',
    recipient_name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Jl. Propinsi KM 1,5 RT 08, Kelurahan Penajam',
    city: 'Penajam Paser Utara',
    district: 'Penajam',
    kelurahan: 'Penajam',
    province: 'Kalimantan Timur',
    postal_code: '76141',
    latitude: -1.2587,
    longitude: 116.7725,
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addr-2',
    user_id: 'usr-customer-1',
    label: 'Rumah Nipah-Nipah (PPU)',
    recipient_name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Jl. Kusuma Bangsa Blok C No. 4, Komplek Pemkab PPU, Kelurahan Nipah-Nipah',
    city: 'Penajam Paser Utara',
    district: 'Penajam',
    kelurahan: 'Nipah-Nipah',
    province: 'Kalimantan Timur',
    postal_code: '76143',
    latitude: -1.2721,
    longitude: 116.7412,
    is_default: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addr-3',
    user_id: 'usr-customer-1',
    label: 'Kantor / Mess Sepaku (IKN)',
    recipient_name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Jl. Negara Sepaku KM 38, Desa Bumi Harapan (Zona KIPP IKN)',
    city: 'Penajam Paser Utara',
    district: 'Sepaku',
    kelurahan: 'Bumi Harapan',
    province: 'Kalimantan Timur',
    postal_code: '76148',
    latitude: -0.9167,
    longitude: 116.7833,
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-1',
    code: 'BERSIHBARU',
    type: 'PERCENTAGE',
    value: 20,
    minimum_transaction: 100000,
    maximum_discount: 50000,
    usage_limit: 500,
    per_user_limit: 1,
    start_at: new Date().toISOString(),
    expires_at: '2026-12-31T23:59:59Z',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cp-2',
    code: 'HEMAT25K',
    type: 'FIXED_AMOUNT',
    value: 25000,
    minimum_transaction: 150000,
    maximum_discount: 25000,
    usage_limit: 1000,
    per_user_limit: 2,
    start_at: new Date().toISOString(),
    expires_at: '2026-12-31T23:59:59Z',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'brs-sample-1',
    customer_id: 'usr-customer-1',
    cleaner_id: 'usr-cleaner-1',
    rating: 5,
    comment: 'Pekerjaannya luar biasa teliti! Sudut-sudut kitchen set dan kerak wastafel yang susah hilang sekarang berkilau seperti baru. Sangat tepat waktu dan sopan.',
    created_at: '2026-09-20T10:00:00Z',
    customer: INITIAL_USERS[0],
  },
  {
    id: 'rev-2',
    booking_id: 'brs-sample-2',
    customer_id: 'usr-customer-1',
    cleaner_id: 'usr-cleaner-1',
    rating: 5,
    comment: 'Layanan sofa cleaning terbaik di Kabupaten Penajam Paser Utara. Debu dan tungau hilang total, wangi aromaterapi lavender segar sekali.',
    created_at: '2026-09-18T14:30:00Z',
    customer: {
      ...INITIAL_USERS[0],
      full_name: 'Dr. Clarissa Siregar',
    },
  },
];

export const INITIAL_MITRA_APPLICATIONS: MitraApplication[] = [
  {
    id: 'mitra-app-1',
    user_id: 'usr-mitra-p1',
    full_name: 'Bambang Irawan',
    nik: '6409011504920003',
    email: 'bambang.cleaner@gmail.com',
    phone: '081344556677',
    district: 'Penajam',
    kelurahan: 'Petung',
    address: 'Jl. Provinsi KM 4.5 RT 08, Petung, Kec. Penajam',
    vehicle_type: 'Sepeda Motor (Honda Vario)',
    has_sim_c: true,
    has_skck: true,
    experience: '3 tahun housekeeping villa & kantor swasta',
    specializations: ['Deep Cleaning', 'Pembersihan Kamar Mandi', 'Fogging'],
    bank_name: 'Bank Mandiri',
    bank_account: '1490088771123',
    bank_holder: 'Bambang Irawan',
    status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: 'KTP & SKCK lengkap. Siap standby area Penajam & Petung.',
  },
  {
    id: 'mitra-app-2',
    user_id: 'usr-mitra-p2',
    full_name: 'Siti Rahmawati',
    nik: '6409025208950001',
    email: 'siti.rahma@gmail.com',
    phone: '082211998844',
    district: 'Sepaku',
    kelurahan: 'Bumi Harapan',
    address: 'Desa Bumi Harapan RT 03, Kawasan KIPP IKN Sepaku',
    vehicle_type: 'Sepeda Motor (Yamaha Mio)',
    has_sim_c: true,
    has_skck: true,
    experience: '2 tahun cleaning service mess pekerja konstruksi IKN',
    specializations: ['Regular Cleaning', 'Sofa & Bed Vacuum', 'Setrika'],
    bank_name: 'Bankaltimtara',
    bank_account: '0081234567',
    bank_holder: 'Siti Rahmawati',
    status: 'APPROVED',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    approved_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    notes: 'Terverifikasi. Lokasi strategis zona IKN Sepaku.',
  },
];

// Local Repository Database Store with Auto-Persistence
class DatabaseStore {
  private services: Service[] = [];
  private categories: ServiceCategory[] = [];
  private addons: ServiceAddon[] = [];
  private pricingRules: PricingRule[] = [];
  private users: Profile[] = [];
  private addresses: Address[] = [];
  private bookings: Booking[] = [];
  private coupons: Coupon[] = [];
  private reviews: Review[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLog[] = [];
  private payments: Payment[] = [];
  private statusHistories: BookingStatusHistory[] = [];
  private mitraApplications: MitraApplication[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedServices = localStorage.getItem('bersihin_services');
      this.services = storedServices ? JSON.parse(storedServices) : INITIAL_SERVICES;

      const storedCategories = localStorage.getItem('bersihin_categories');
      this.categories = storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES;

      const storedAddons = localStorage.getItem('bersihin_addons');
      this.addons = storedAddons ? JSON.parse(storedAddons) : INITIAL_ADDONS;

      const storedRules = localStorage.getItem('bersihin_pricing_rules');
      this.pricingRules = storedRules ? JSON.parse(storedRules) : INITIAL_PRICING_RULES;

      const storedUsers = localStorage.getItem('bersihin_users');
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedAddresses = localStorage.getItem('bersihin_addresses');
      this.addresses = storedAddresses ? JSON.parse(storedAddresses) : INITIAL_ADDRESSES;

      const storedBookings = localStorage.getItem('bersihin_bookings');
      this.bookings = storedBookings ? JSON.parse(storedBookings) : this.getInitialBookings();

      const storedCoupons = localStorage.getItem('bersihin_coupons');
      this.coupons = storedCoupons ? JSON.parse(storedCoupons) : INITIAL_COUPONS;

      const storedReviews = localStorage.getItem('bersihin_reviews');
      this.reviews = storedReviews ? JSON.parse(storedReviews) : INITIAL_REVIEWS;

      const storedNotifications = localStorage.getItem('bersihin_notifications');
      this.notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

      const storedAuditLogs = localStorage.getItem('bersihin_audit_logs');
      this.auditLogs = storedAuditLogs ? JSON.parse(storedAuditLogs) : [];

      const storedPayments = localStorage.getItem('bersihin_payments');
      this.payments = storedPayments ? JSON.parse(storedPayments) : [];

      const storedHistory = localStorage.getItem('bersihin_status_history');
      this.statusHistories = storedHistory ? JSON.parse(storedHistory) : [];

      const storedMitraApps = localStorage.getItem('bersihin_mitra_applications');
      this.mitraApplications = storedMitraApps ? JSON.parse(storedMitraApps) : INITIAL_MITRA_APPLICATIONS;
    } catch {
      this.services = INITIAL_SERVICES;
      this.categories = INITIAL_CATEGORIES;
      this.addons = INITIAL_ADDONS;
      this.pricingRules = INITIAL_PRICING_RULES;
      this.users = INITIAL_USERS;
      this.addresses = INITIAL_ADDRESSES;
      this.bookings = this.getInitialBookings();
      this.coupons = INITIAL_COUPONS;
      this.reviews = INITIAL_REVIEWS;
      this.notifications = [];
      this.auditLogs = [];
      this.payments = [];
      this.statusHistories = [];
      this.mitraApplications = INITIAL_MITRA_APPLICATIONS;
    }
  }

  private getInitialBookings(): Booking[] {
    return [
      {
        id: 'book-sample-1',
        booking_number: 'BRS-20260924-1001',
        customer_id: 'usr-customer-1',
        cleaner_id: 'usr-cleaner-1',
        address_id: 'addr-3',
        service_id: 'srv-1',
        property_type: 'Rumah',
        property_area: 85,
        scheduled_date: '2026-09-24',
        start_time: '10:00',
        end_time: '13:00',
        base_price: 120000,
        addon_price: 65000,
        discount_amount: 25000,
        transport_fee: 35000,
        total_price: 195000,
        status: 'CLEANER_ASSIGNED',
        payment_status: 'PAID',
        customer_notes: 'Rumah di Penajam KM 1.5, tolong fokus di area ruang tamu dan teras.',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'book-sample-2',
        booking_number: 'BRS-20260923-0982',
        customer_id: 'usr-customer-1',
        cleaner_id: 'usr-cleaner-1',
        address_id: 'addr-2',
        service_id: 'srv-2',
        property_type: 'Rumah',
        property_area: 120,
        scheduled_date: '2026-09-23',
        start_time: '08:30',
        end_time: '11:30',
        base_price: 275000,
        addon_price: 50000,
        discount_amount: 0,
        transport_fee: 25000,
        total_price: 350000,
        status: 'COMPLETED',
        payment_status: 'PAID',
        customer_notes: 'Restorasi kerak lantai kamar mandi dan dapur. Selesai sangat memuaskan.',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
      {
        id: 'book-sample-3',
        booking_number: 'BRS-20260924-1044',
        customer_id: 'usr-customer-1',
        cleaner_id: undefined,
        address_id: 'addr-1',
        service_id: 'srv-3',
        property_type: 'Apartemen',
        property_area: 60,
        scheduled_date: '2026-09-24',
        start_time: '14:00',
        end_time: '17:00',
        base_price: 280000,
        addon_price: 0,
        discount_amount: 20000,
        transport_fee: 30000,
        total_price: 290000,
        status: 'SEARCHING_CLEANER',
        payment_status: 'PAID',
        customer_notes: 'Pembersihan unit kosong persiapan sewa staf dinas di Penajam.',
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  public saveToStorage() {
    try {
      localStorage.setItem('bersihin_services', JSON.stringify(this.services));
      localStorage.setItem('bersihin_categories', JSON.stringify(this.categories));
      localStorage.setItem('bersihin_addons', JSON.stringify(this.addons));
      localStorage.setItem('bersihin_pricing_rules', JSON.stringify(this.pricingRules));
      localStorage.setItem('bersihin_users', JSON.stringify(this.users));
      localStorage.setItem('bersihin_addresses', JSON.stringify(this.addresses));
      localStorage.setItem('bersihin_bookings', JSON.stringify(this.bookings));
      localStorage.setItem('bersihin_coupons', JSON.stringify(this.coupons));
      localStorage.setItem('bersihin_reviews', JSON.stringify(this.reviews));
      localStorage.setItem('bersihin_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('bersihin_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('bersihin_payments', JSON.stringify(this.payments));
      localStorage.setItem('bersihin_status_history', JSON.stringify(this.statusHistories));
      localStorage.setItem('bersihin_mitra_applications', JSON.stringify(this.mitraApplications));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Getters
  getServices() { return this.services; }
  getCategories() { return this.categories; }
  getAddons() { return this.addons; }
  getPricingRules() { return this.pricingRules; }
  getUsers() { return this.users; }
  getCleaners() { return this.users.filter(u => u.role === 'CLEANER'); }
  getAddresses(userId?: string) {
    return userId ? this.addresses.filter(a => a.user_id === userId) : this.addresses;
  }
  getBookings() { return this.bookings; }
  getCoupons() { return this.coupons; }
  getReviews() { return this.reviews; }
  getNotifications(userId: string) { return this.notifications.filter(n => n.user_id === userId); }
  getAuditLogs() { return this.auditLogs; }
  getMitraApplications() { return this.mitraApplications; }

  // Mutations
  addAddress(address: Partial<Address> & Omit<Address, 'id' | 'created_at'>): Address {
    const fullAddress: Address = {
      ...address,
      id: address.id || 'addr-' + Date.now(),
      created_at: address.created_at || new Date().toISOString(),
    };
    this.addresses.push(fullAddress);
    this.saveToStorage();
    return fullAddress;
  }

  addBooking(booking: Booking) {
    this.bookings.unshift(booking);
    this.saveToStorage();
    return booking;
  }

  createBooking(data: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Booking {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      booking_number: data.booking_number,
      customer_id: data.customer_id,
      cleaner_id: data.cleaner_id || null,
      address_id: data.address_id,
      service_id: data.service_id,
      property_type: data.property_type,
      property_area: data.property_area,
      scheduled_date: data.scheduled_date,
      start_time: data.start_time,
      end_time: data.end_time,
      base_price: data.base_price,
      addon_price: data.addon_price,
      discount_amount: data.discount_amount,
      transport_fee: data.transport_fee,
      total_price: data.total_price,
      status: data.status || 'PENDING_PAYMENT',
      payment_status: data.payment_status || 'PENDING',
      customer_notes: data.customer_notes,
      addons: data.addons || [],
      created_at: now,
      updated_at: now,
    };

    this.bookings.unshift(newBooking);
    this.saveToStorage();

    // Also add to audit log
    this.addAuditLog({
      actor_id: data.customer_id,
      action: 'BOOKING_CREATED',
      entity_type: 'BOOKING',
      entity_id: newBooking.id,
      metadata: {
        booking_number: newBooking.booking_number,
        total_price: newBooking.total_price,
        scheduled_date: newBooking.scheduled_date,
      },
    });

    return newBooking;
  }

  useCoupon(couponId: string, bookingId: string, userId: string) {
    const coupon = this.coupons.find(c => c.id === couponId);
    if (coupon) {
      coupon.times_used = (coupon.times_used || 0) + 1;
      this.saveToStorage();
    }
  }

  updateBooking(id: string, updates: Partial<Booking>) {
    const idx = this.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.bookings[idx] = { ...this.bookings[idx], ...updates, updated_at: new Date().toISOString() };
      this.saveToStorage();
      return this.bookings[idx];
    }
    return null;
  }

  getBookingById(id: string): Booking | undefined {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return undefined;
    return this.populateBookingRelations(booking);
  }

  getBookingByNumber(bookingNumber: string): Booking | undefined {
    const booking = this.bookings.find(b => b.booking_number.toUpperCase() === bookingNumber.toUpperCase());
    if (!booking) return undefined;
    return this.populateBookingRelations(booking);
  }

  populateBookingRelations(booking: Booking): Booking {
    const service = this.services.find(s => s.id === booking.service_id);
    const address = this.addresses.find(a => a.id === booking.address_id);
    const customer = this.users.find(u => u.id === booking.customer_id);
    const cleanerUser = booking.cleaner_id ? this.users.find(u => u.id === booking.cleaner_id) : undefined;
    const cleanerProfile = booking.cleaner_id ? INITIAL_CLEANER_PROFILES[booking.cleaner_id] : undefined;

    return {
      ...booking,
      service,
      address,
      customer,
      cleaner: cleanerUser ? { ...cleanerUser, cleaner_profile: cleanerProfile } : undefined,
    };
  }

  getPayments(bookingId?: string): Payment[] {
    if (bookingId) {
      return this.payments.filter(p => p.booking_id === bookingId);
    }
    return this.payments;
  }

  getPaymentByBookingId(bookingId: string): Payment | undefined {
    return this.payments.find(p => p.booking_id === bookingId);
  }

  createPayment(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Payment {
    const now = new Date().toISOString();
    const newPayment: Payment = {
      ...data,
      id: 'pay-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: now,
      updated_at: now,
    };
    this.payments.unshift(newPayment);
    this.saveToStorage();
    return newPayment;
  }

  updatePayment(id: string, updates: Partial<Payment>): Payment | null {
    const idx = this.payments.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.payments[idx] = { ...this.payments[idx], ...updates, updated_at: new Date().toISOString() };
      this.saveToStorage();
      return this.payments[idx];
    }
    return null;
  }

  getStatusHistory(bookingId: string): BookingStatusHistory[] {
    return this.statusHistories.filter(h => h.booking_id === bookingId);
  }

  addStatusHistory(item: Omit<BookingStatusHistory, 'id' | 'created_at'>): BookingStatusHistory {
    const newHistory: BookingStatusHistory = {
      ...item,
      id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
    };
    this.statusHistories.push(newHistory);
    this.saveToStorage();
    return newHistory;
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>) {
    const fullLog: AuditLog = {
      ...log,
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(fullLog);
    this.saveToStorage();
    return fullLog;
  }

  addNotification(notification: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) {
    const fullNotif: NotificationItem = {
      ...notification,
      id: 'notif-' + Date.now(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(fullNotif);
    this.saveToStorage();
    return fullNotif;
  }

  // Mitra Applications Management
  createMitraApplication(data: Omit<MitraApplication, 'id' | 'created_at' | 'status'>): MitraApplication {
    const now = new Date().toISOString();
    const newId = 'mitra-app-' + Date.now();
    const userId = data.user_id || 'usr-mitra-' + Date.now();

    const application: MitraApplication = {
      ...data,
      id: newId,
      user_id: userId,
      status: 'PENDING',
      created_at: now,
    };

    // Also register user profile as inactive/pending CLEANER
    const existingUser = this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (!existingUser) {
      const cleanerUser: Profile = {
        id: userId,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        avatar_url: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80`,
        role: 'CLEANER',
        is_active: false,
        created_at: now,
        updated_at: now,
      };
      this.users.push(cleanerUser);
    }

    this.mitraApplications.unshift(application);
    this.saveToStorage();

    this.addAuditLog({
      actor_id: userId,
      actor_name: data.full_name,
      action: 'MITRA_APPLICATION_SUBMITTED',
      entity_type: 'MITRA_APPLICATION',
      entity_id: newId,
      metadata: { district: data.district, phone: data.phone },
    });

    return application;
  }

  updateMitraApplication(id: string, updates: Partial<MitraApplication>): MitraApplication | null {
    const idx = this.mitraApplications.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.mitraApplications[idx] = { ...this.mitraApplications[idx], ...updates };
      this.saveToStorage();
      return this.mitraApplications[idx];
    }
    return null;
  }

  approveMitraApplication(id: string): MitraApplication | null {
    const app = this.mitraApplications.find(a => a.id === id);
    if (!app) return null;

    app.status = 'APPROVED';
    app.approved_at = new Date().toISOString();

    // Activate cleaner user
    if (app.user_id) {
      const uIdx = this.users.findIndex(u => u.id === app.user_id);
      if (uIdx !== -1) {
        this.users[uIdx].is_active = true;
        this.users[uIdx].role = 'CLEANER';
      } else {
        this.users.push({
          id: app.user_id,
          email: app.email,
          full_name: app.full_name,
          phone: app.phone,
          avatar_url: `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80`,
          role: 'CLEANER',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    this.saveToStorage();

    this.addAuditLog({
      actor_id: 'usr-superadmin-1',
      actor_name: 'Super Admin',
      action: 'MITRA_APPLICATION_APPROVED',
      entity_type: 'MITRA_APPLICATION',
      entity_id: id,
      metadata: { mitra_name: app.full_name, district: app.district },
    });

    return app;
  }

  rejectMitraApplication(id: string, notes?: string): MitraApplication | null {
    const app = this.mitraApplications.find(a => a.id === id);
    if (!app) return null;

    app.status = 'REJECTED';
    if (notes) app.notes = notes;

    this.saveToStorage();

    this.addAuditLog({
      actor_id: 'usr-superadmin-1',
      actor_name: 'Super Admin',
      action: 'MITRA_APPLICATION_REJECTED',
      entity_type: 'MITRA_APPLICATION',
      entity_id: id,
      metadata: { mitra_name: app.full_name, notes },
    });

    return app;
  }

  // === Master Superadmin Management CRUD Operations ===

  // Services CRUD
  addService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Service {
    const now = new Date().toISOString();
    const newService: Service = {
      ...data,
      id: 'srv-' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    this.services.push(newService);
    this.saveToStorage();
    this.addAuditLog({
      actor_id: 'usr-superadmin-1',
      actor_name: 'Super Admin',
      action: 'SERVICE_CREATED',
      entity_type: 'SERVICE',
      entity_id: newService.id,
      metadata: { name: newService.name, base_price: newService.base_price },
    });
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.services[idx] = {
        ...this.services[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveToStorage();
      this.addAuditLog({
        actor_id: 'usr-superadmin-1',
        actor_name: 'Super Admin',
        action: 'SERVICE_UPDATED',
        entity_type: 'SERVICE',
        entity_id: id,
        metadata: { updates },
      });
      return this.services[idx];
    }
    return null;
  }

  deleteService(id: string): boolean {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.services.splice(idx, 1)[0];
      this.saveToStorage();
      this.addAuditLog({
        actor_id: 'usr-superadmin-1',
        actor_name: 'Super Admin',
        action: 'SERVICE_DELETED',
        entity_type: 'SERVICE',
        entity_id: id,
        metadata: { name: removed.name },
      });
      return true;
    }
    return false;
  }

  // Addons CRUD
  addAddon(data: Omit<ServiceAddon, 'id' | 'created_at' | 'updated_at'>): ServiceAddon {
    const now = new Date().toISOString();
    const newAddon: ServiceAddon = {
      ...data,
      id: 'add-' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    this.addons.push(newAddon);
    this.saveToStorage();
    return newAddon;
  }

  updateAddon(id: string, updates: Partial<ServiceAddon>): ServiceAddon | null {
    const idx = this.addons.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.addons[idx] = {
        ...this.addons[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveToStorage();
      return this.addons[idx];
    }
    return null;
  }

  deleteAddon(id: string): boolean {
    const idx = this.addons.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.addons.splice(idx, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Pricing Rules CRUD
  addPricingRule(data: Omit<PricingRule, 'id' | 'created_at' | 'updated_at'>): PricingRule {
    const now = new Date().toISOString();
    const newRule: PricingRule = {
      ...data,
      id: 'pr-' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    this.pricingRules.push(newRule);
    this.saveToStorage();
    return newRule;
  }

  updatePricingRule(id: string, updates: Partial<PricingRule>): PricingRule | null {
    const idx = this.pricingRules.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.pricingRules[idx] = {
        ...this.pricingRules[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveToStorage();
      return this.pricingRules[idx];
    }
    return null;
  }

  deletePricingRule(id: string): boolean {
    const idx = this.pricingRules.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.pricingRules.splice(idx, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Coupons CRUD
  addCoupon(data: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'times_used'>): Coupon {
    const now = new Date().toISOString();
    const newCoupon: Coupon = {
      ...data,
      id: 'cpn-' + Date.now(),
      times_used: 0,
      created_at: now,
      updated_at: now,
    };
    this.coupons.push(newCoupon);
    this.saveToStorage();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.coupons[idx] = {
        ...this.coupons[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.saveToStorage();
      return this.coupons[idx];
    }
    return null;
  }

  deleteCoupon(id: string): boolean {
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.coupons.splice(idx, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Reset to default factory data
  resetToDefaults(): void {
    try {
      localStorage.removeItem('bersihin_services');
      localStorage.removeItem('bersihin_categories');
      localStorage.removeItem('bersihin_addons');
      localStorage.removeItem('bersihin_pricing_rules');
      localStorage.removeItem('bersihin_coupons');
    } catch {
      // ignore
    }
    this.services = [...INITIAL_SERVICES];
    this.categories = [...INITIAL_CATEGORIES];
    this.addons = [...INITIAL_ADDONS];
    this.pricingRules = [...INITIAL_PRICING_RULES];
    this.coupons = [...INITIAL_COUPONS];
    this.saveToStorage();
  }
}

export const dbStore = new DatabaseStore();
