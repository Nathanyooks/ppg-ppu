import React from 'react';
import { Booking } from '../../types/database';
import { PricingBreakdown } from '../../lib/pricing/pricingEngine';
import { formatRupiah, formatDuration } from '../../lib/utils/formatters';
import { Button } from '../ui/Button';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface BookingSuccessModalProps {
  isOpen: boolean;
  booking: Booking | null;
  breakdown: PricingBreakdown | null;
  onClose: () => void;
  onProceedToPayment?: (booking: Booking) => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  booking,
  breakdown,
  onClose,
  onProceedToPayment,
}) => {
  if (!isOpen || !booking || !breakdown) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full mb-2">
            Pesanan Berhasil Dibuat
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Terima Kasih atas Pesanan Anda!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Nomor Pesanan:{' '}
            <strong className="text-emerald-700 font-mono tracking-wider text-sm sm:text-base">
              {booking.booking_number}
            </strong>
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-semibold text-slate-700">
            <span>Status Pesanan:</span>
            <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
              {booking.status === 'PENDING_PAYMENT' ? 'Menunggu Pembayaran' : booking.status}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Layanan</span>
              <strong className="text-slate-900 block">{breakdown.service.name}</strong>
              <span>{booking.property_type} ({booking.property_area} m²)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Jadwal WITA</span>
              <strong className="text-slate-900 block">{booking.scheduled_date}</strong>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {booking.start_time} – {booking.end_time} WITA
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-800">Total Tagihan:</span>
            <span className="text-lg font-extrabold text-emerald-700">
              {formatRupiah(booking.total_price)}
            </span>
          </div>
        </div>

        {/* Payment Gateway Indicator */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 text-left flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pembayaran Terintegrasi Midtrans Snap</strong>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Pesanan telah masuk ke sistem. Klik tombol di bawah untuk membuka popup Midtrans Snap dan memilih metode pembayaran QRIS, BCA/Mandiri/BNI/BRI Virtual Account, atau GoPay.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">
            Tutup & Simpan
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (onProceedToPayment) {
                onProceedToPayment(booking);
              } else {
                onClose();
              }
            }}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold"
          >
            Bayar Sekarang (Midtrans Snap)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
