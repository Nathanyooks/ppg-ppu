// Indonesian formatting utilities for Bersih.in
// Timezone: Asia/Makassar (WITA)

export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, ' ');
}

export function formatDateIndonesian(dateStringOrDate: string | Date): string {
  try {
    const date = typeof dateStringOrDate === 'string' ? new Date(dateStringOrDate) : dateStringOrDate;
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Makassar',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateStringOrDate);
  }
}

export function formatDateTimeIndonesian(dateStringOrDate: string | Date): string {
  try {
    const date = typeof dateStringOrDate === 'string' ? new Date(dateStringOrDate) : dateStringOrDate;
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Makassar',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date) + ' WITA';
  } catch {
    return String(dateStringOrDate);
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} Menit`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} Jam`;
  return `${hours} Jam ${remainingMinutes} Menit`;
}

export function formatBookingNumber(idOrNum: string): string {
  if (idOrNum.startsWith('BRS-')) return idOrNum;
  return `BRS-${idOrNum.slice(0, 8).toUpperCase()}`;
}
