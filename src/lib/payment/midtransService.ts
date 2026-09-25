import { Booking, Payment, Profile, PaymentStatus } from '../../types/database';
import { dbStore } from '../database/supabaseClient';
import { transitionBookingStatus } from '../booking/stateMachine';

export interface MidtransSnapOptions {
  clientKey: string;
  isProduction: boolean;
}

export interface MidtransNotificationPayload {
  order_id: string; // usually booking_number
  transaction_id: string;
  transaction_status: 'settlement' | 'capture' | 'pending' | 'deny' | 'cancel' | 'expire' | 'refund';
  fraud_status?: 'accept' | 'deny' | 'challenge';
  payment_type: string;
  gross_amount: string;
  transaction_time: string;
  va_numbers?: { bank: string; va_number: string }[];
}

export interface GeneratedSnapTransaction {
  snapToken: string;
  redirectUrl: string;
  transactionId: string;
  payment: Payment;
  vaNumbers: Record<string, string>;
  qrisPayload: string;
}

/**
 * Midtrans Snap Client & Sandbox Simulation Engine
 * Generates official Snap payload, Virtual Account numbers, QRIS strings,
 * and maintains synchronized order states.
 */
export class MidtransService {
  private clientKey: string;
  private isProduction: boolean;

  constructor() {
    this.clientKey = (import.meta as any).env?.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-BERS1H1N-DEMOKEY';
    this.isProduction = (import.meta as any).env?.VITE_MIDTRANS_IS_PRODUCTION === 'true';
  }

  /**
   * Initializes or retrieves an active Snap transaction for a booking
   */
  public createSnapTransaction(booking: Booking, customer?: Profile): GeneratedSnapTransaction {
    // Check if an active pending payment already exists
    const existing = dbStore.getPaymentByBookingId(booking.id);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 minutes TTL

    const cleanNum = booking.booking_number.replace(/[^0-9]/g, '').slice(-6);
    const vaSuffix = cleanNum.padStart(6, '0') + Math.floor(1000 + Math.random() * 9000);

    const vaNumbers = {
      bca: `70014${vaSuffix}`,
      mandiri: `88908${vaSuffix}`,
      bni: `98812${vaSuffix}`,
      bri: `10234${vaSuffix}`,
      permata: `85210${vaSuffix}`,
    };

    const transactionId = `MID-${booking.booking_number}-${Date.now().toString(36).toUpperCase()}`;
    const snapToken = `SNAP-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
    const qrisPayload = `00020101021226670016ID.CO.MIDTRANS.WWW01189360050300000872655204${cleanNum}5303360540${booking.total_price}5802ID5910BERSIH.IN6007PENAJAM62070703A016304C9F1`;

    if (existing && existing.status === 'PENDING') {
      return {
        snapToken: existing.snap_token || snapToken,
        redirectUrl: existing.snap_redirect_url || redirectUrl,
        transactionId: existing.transaction_id || transactionId,
        payment: existing,
        vaNumbers,
        qrisPayload,
      };
    }

    // Create new payment record in database
    const payment = dbStore.createPayment({
      booking_id: booking.id,
      provider: 'MIDTRANS',
      transaction_id: transactionId,
      payment_method: 'MIDTRANS_SNAP',
      amount: booking.total_price,
      status: 'PENDING',
      snap_token: snapToken,
      snap_redirect_url: redirectUrl,
      va_number: vaNumbers.bca,
      bank: 'BCA',
      qr_code_url: qrisPayload,
      expires_at: expiresAt,
    });

    // Log audit event
    dbStore.addAuditLog({
      actor_id: customer?.id || booking.customer_id,
      action: 'PAYMENT_TOKEN_GENERATED',
      entity_type: 'PAYMENT',
      entity_id: payment.id,
      metadata: {
        booking_number: booking.booking_number,
        amount: booking.total_price,
        snap_token: snapToken,
        expires_at: expiresAt,
      },
    });

    return {
      snapToken,
      redirectUrl,
      transactionId,
      payment,
      vaNumbers,
      qrisPayload,
    };
  }

  /**
   * Process Midtrans Webhook/Notification
   */
  public handleNotification(payload: MidtransNotificationPayload) {
    const booking = dbStore.getBookingByNumber(payload.order_id);
    if (!booking) {
      console.warn(`Booking with number ${payload.order_id} not found for Midtrans notification.`);
      return false;
    }

    const payment = dbStore.getPaymentByBookingId(booking.id);
    const nowIso = new Date().toISOString();

    if (
      payload.transaction_status === 'settlement' ||
      (payload.transaction_status === 'capture' && payload.fraud_status === 'accept')
    ) {
      // Payment Successful
      if (payment) {
        dbStore.updatePayment(payment.id, {
          status: 'PAID',
          paid_at: nowIso,
          payment_method: payload.payment_type || payment.payment_method,
        });
      }

      // Transition booking to CONFIRMED or CLEANER_ASSIGNED
      transitionBookingStatus(
        booking.id,
        'CONFIRMED',
        'MIDTRANS_GATEWAY',
        `Pembayaran lunas via Midtrans (${payload.payment_type || 'Snap'}). ID: ${payload.transaction_id}`
      );

      // Auto assign first available verified cleaner if unassigned
      const cleaners = dbStore.getCleaners();
      if (!booking.cleaner_id && cleaners.length > 0) {
        const assigned = cleaners[0];
        dbStore.updateBooking(booking.id, {
          cleaner_id: assigned.id,
          status: 'CLEANER_ASSIGNED',
        });
        dbStore.addStatusHistory({
          booking_id: booking.id,
          old_status: 'CONFIRMED',
          new_status: 'CLEANER_ASSIGNED',
          changed_by: 'AUTO_DISPATCH_SYSTEM',
          notes: `Mitra cleaner ${assigned.full_name} otomatis ditugaskan untuk wilayah Kabupaten Penajam Paser Utara.`,
        });
      }

      return true;
    } else if (payload.transaction_status === 'expire') {
      if (payment) {
        dbStore.updatePayment(payment.id, { status: 'EXPIRED' });
      }
      transitionBookingStatus(
        booking.id,
        'CANCELLED',
        'MIDTRANS_GATEWAY',
        'Pembayaran kadaluarsa (melewati batas waktu 15 menit).'
      );
      return true;
    } else if (payload.transaction_status === 'deny' || payload.transaction_status === 'cancel') {
      if (payment) {
        dbStore.updatePayment(payment.id, { status: 'FAILED' });
      }
      return true;
    }

    return false;
  }

  /**
   * Fast-forward simulation helper for QA and demonstration in AI Studio
   */
  public simulateSuccessPayment(bookingId: string, paymentMethod: string = 'QRIS'): boolean {
    const booking = dbStore.getBookingById(bookingId);
    if (!booking) return false;

    const payload: MidtransNotificationPayload = {
      order_id: booking.booking_number,
      transaction_id: `SIM-${Date.now()}`,
      transaction_status: 'settlement',
      payment_type: paymentMethod,
      gross_amount: booking.total_price.toString(),
      transaction_time: new Date().toISOString(),
    };

    return this.handleNotification(payload);
  }
}

export const midtransClient = new MidtransService();
