// TypeScript definitions for Bersih.in Database

export type UserRole = 'CUSTOMER' | 'CLEANER' | 'ADMIN' | 'SUPER_ADMIN';

export type CleanerVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type CleanerEmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'SEARCHING_CLEANER'
  | 'CLEANER_ASSIGNED'
  | 'CLEANER_ON_THE_WAY'
  | 'CLEANER_ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  total_bookings: number;
  created_at: string;
  updated_at: string;
}

export interface CleanerProfile {
  id: string;
  user_id: string;
  bio?: string;
  rating: number;
  total_jobs: number;
  verification_status: CleanerVerificationStatus;
  employment_status: CleanerEmploymentStatus;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  kelurahan?: string;
  province: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  base_duration_minutes: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceAddon {
  id: string;
  service_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  service_id: string;
  property_type: string;
  min_area: number;
  max_area: number;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  cleaner_id?: string | null;
  address_id: string;
  service_id: string;
  property_type: string;
  property_area: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  base_price: number;
  addon_price: number;
  discount_amount: number;
  transport_fee: number;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;

  // Joined relations for UI convenience
  customer?: Profile;
  cleaner?: Profile & { cleaner_profile?: CleanerProfile };
  service?: Service;
  address?: Address;
  addons?: (BookingAddon & { addon?: ServiceAddon })[];
}

export interface BookingAddon {
  id: string;
  booking_id: string;
  addon_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  old_status: string;
  new_status: string;
  changed_by: string;
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  provider: string;
  transaction_id?: string;
  payment_method?: string;
  amount: number;
  status: PaymentStatus;
  snap_token?: string;
  snap_redirect_url?: string;
  va_number?: string;
  bank?: string;
  qr_code_url?: string;
  bill_key?: string;
  biller_code?: string;
  paid_at?: string | null;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minimum_transaction: number;
  maximum_discount?: number;
  usage_limit?: number;
  times_used?: number;
  per_user_limit: number;
  start_at: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  user_id: string;
  booking_id: string;
  discount_amount: number;
  created_at: string;
}

export interface CleanerAvailability {
  id: string;
  cleaner_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  cleaner_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  customer?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  booking_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  attachment_url?: string;
  created_at: string;
  read_at?: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MitraApplication {
  id: string;
  user_id?: string;
  full_name: string;
  nik: string;
  email: string;
  phone: string;
  district: string; // Penajam, Sepaku, Waru, Babulu
  kelurahan?: string;
  address: string;
  vehicle_type: string;
  has_sim_c: boolean;
  has_skck: boolean;
  experience: string;
  specializations: string[];
  bank_name: string;
  bank_account: string;
  bank_holder: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  approved_at?: string;
  notes?: string;
}
