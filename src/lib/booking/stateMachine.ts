import { Booking, BookingStatus } from '../../types/database';
import { dbStore } from '../database/supabaseClient';

export interface StatusMetadata {
  status: BookingStatus;
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  timelineStep: number;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusMetadata> = {
  PENDING_PAYMENT: {
    status: 'PENDING_PAYMENT',
    label: 'Menunggu Pembayaran',
    description: 'Selesaikan pembayaran via Midtrans Snap sebelum batas waktu 15 menit berakhir.',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
    timelineStep: 1,
  },
  CONFIRMED: {
    status: 'CONFIRMED',
    label: 'Pembayaran Dikonfirmasi',
    description: 'Pembayaran telah diverifikasi lunas. Sistem sedang menyiapkan mitra cleaner.',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
    timelineStep: 2,
  },
  SEARCHING_CLEANER: {
    status: 'SEARCHING_CLEANER',
    label: 'Mencari Mitra Cleaner',
    description: 'Menghubungkan pesanan ke mitra cleaner terdekat di Kabupaten Penajam Paser Utara.',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-700',
    timelineStep: 2,
  },
  CLEANER_ASSIGNED: {
    status: 'CLEANER_ASSIGNED',
    label: 'Mitra Cleaner Ditugaskan',
    description: 'Mitra cleaner telah menerima pesanan dan mempersiapkan perlengkapan standar.',
    badgeBg: 'bg-teal-50 border-teal-200',
    badgeText: 'text-teal-700',
    timelineStep: 3,
  },
  CLEANER_ON_THE_WAY: {
    status: 'CLEANER_ON_THE_WAY',
    label: 'Mitra Menuju Lokasi',
    description: 'Mitra cleaner sedang dalam perjalanan menuju alamat Anda di zona WITA.',
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-700',
    timelineStep: 4,
  },
  CLEANER_ARRIVED: {
    status: 'CLEANER_ARRIVED',
    label: 'Mitra Tiba di Lokasi',
    description: 'Mitra cleaner telah sampai di lokasi dan bersiap melakukan checklist pembersihan.',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-700',
    timelineStep: 4,
  },
  IN_PROGRESS: {
    status: 'IN_PROGRESS',
    label: 'Sedang Dikerjakan',
    description: 'Pembersihan sedang berlangsung sesuai standar operasional (SOP) Bersih.in.',
    badgeBg: 'bg-violet-50 border-violet-200',
    badgeText: 'text-violet-700',
    timelineStep: 5,
  },
  COMPLETED: {
    status: 'COMPLETED',
    label: 'Pembersihan Selesai',
    description: 'Layanan telah selesai dikerjakan dengan garansi kepuasan 24 jam.',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-800',
    timelineStep: 6,
  },
  CANCELLED: {
    status: 'CANCELLED',
    label: 'Pesanan Dibatalkan',
    description: 'Pesanan telah dibatalkan.',
    badgeBg: 'bg-rose-50 border-rose-200',
    badgeText: 'text-rose-700',
    timelineStep: -1,
  },
  REFUND_PENDING: {
    status: 'REFUND_PENDING',
    label: 'Pengembalian Dana Diproses',
    description: 'Proses refund dana sedang ditinjau oleh tim operasional keuangan.',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeText: 'text-orange-700',
    timelineStep: -1,
  },
  REFUNDED: {
    status: 'REFUNDED',
    label: 'Dana Dikembalikan',
    description: 'Pengembalian dana telah berhasil ditransfer kembali ke rekening pemesan.',
    badgeBg: 'bg-slate-100 border-slate-300',
    badgeText: 'text-slate-700',
    timelineStep: -1,
  },
  DISPUTED: {
    status: 'DISPUTED',
    label: 'Dalam Komplain Garansi',
    description: 'Pelanggan mengajukan klaim garansi ulang atau peninjauan hasil kerja.',
    badgeBg: 'bg-purple-50 border-purple-200',
    badgeText: 'text-purple-700',
    timelineStep: 6,
  },
};

// Allowed State Transitions Graph
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SEARCHING_CLEANER', 'CLEANER_ASSIGNED', 'CANCELLED'],
  SEARCHING_CLEANER: ['CLEANER_ASSIGNED', 'CANCELLED'],
  CLEANER_ASSIGNED: ['CLEANER_ON_THE_WAY', 'CANCELLED'],
  CLEANER_ON_THE_WAY: ['CLEANER_ARRIVED', 'CANCELLED'],
  CLEANER_ARRIVED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  CANCELLED: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
  DISPUTED: ['COMPLETED', 'REFUND_PENDING'],
};

/**
 * Checks if a status transition is legally permitted
 */
export function canTransitionBooking(current: BookingStatus, target: BookingStatus): boolean {
  if (current === target) return true;
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

/**
 * Transitions a booking status, records history, audits event, and sends notification
 */
export function transitionBookingStatus(
  bookingId: string,
  targetStatus: BookingStatus,
  actorId: string,
  notes?: string
): Booking | null {
  const booking = dbStore.getBookingById(bookingId);
  if (!booking) {
    console.error(`Booking with id ${bookingId} not found.`);
    return null;
  }

  const oldStatus = booking.status;
  if (!canTransitionBooking(oldStatus, targetStatus)) {
    console.warn(`Illegal status transition from ${oldStatus} to ${targetStatus} for booking ${booking.booking_number}`);
  }

  const updates: Partial<Booking> = {
    status: targetStatus,
  };

  if (targetStatus === 'CONFIRMED' || targetStatus === 'CLEANER_ASSIGNED' || targetStatus === 'IN_PROGRESS' || targetStatus === 'COMPLETED') {
    updates.payment_status = 'PAID';
  } else if (targetStatus === 'CANCELLED') {
    if (notes) updates.cancellation_reason = notes;
  }

  const updatedBooking = dbStore.updateBooking(bookingId, updates);

  // Add status history record
  dbStore.addStatusHistory({
    booking_id: bookingId,
    old_status: oldStatus,
    new_status: targetStatus,
    changed_by: actorId,
    notes: notes || `Status diubah dari ${oldStatus} menjadi ${targetStatus}`,
  });

  // Add audit log
  dbStore.addAuditLog({
    actor_id: actorId,
    action: `STATUS_CHANGE_${targetStatus}`,
    entity_type: 'BOOKING',
    entity_id: bookingId,
    metadata: {
      old_status: oldStatus,
      new_status: targetStatus,
      booking_number: booking.booking_number,
      notes,
    },
  });

  // Create In-App Notification
  const config = BOOKING_STATUS_CONFIG[targetStatus];
  dbStore.addNotification({
    user_id: booking.customer_id,
    type: 'BOOKING_UPDATE',
    title: `Status Pesanan: ${config.label}`,
    message: notes || `Pesanan #${booking.booking_number} kini berada pada status: ${config.label}.`,
  });

  return updatedBooking;
}
