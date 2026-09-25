import { dbStore } from '../database/supabaseClient';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "10:00"
  availableCleaners: number;
  isAvailable: boolean;
  reason?: string;
}

/**
 * Calculates available cleaning schedule slots for a specified date and duration.
 * Adheres to Asia/Makassar (WITA) business hours: 08:00 - 18:00 WITA.
 */
export function getAvailableTimeSlots(
  targetDateStr: string,
  durationMinutes: number
): TimeSlot[] {
  const allCleaners = dbStore.getCleaners().filter((c) => c.is_active);
  const existingBookings = dbStore.getBookings().filter((b) => b.scheduled_date === targetDateStr && b.status !== 'CANCELLED');

  const slotTemplates = [
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '13:00', end: '15:00' },
    { start: '15:00', end: '17:00' },
    { start: '17:00', end: '19:00' },
  ];

  const targetDate = new Date(targetDateStr);
  const now = new Date();
  const isToday =
    targetDate.getDate() === now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear();

  // Current hour in WITA (UTC+8)
  const currentHourWITA = (now.getUTCHours() + 8) % 24;
  const currentMinuteWITA = now.getUTCMinutes();

  return slotTemplates.map((slot, index) => {
    const [slotHour, slotMinute] = slot.start.split(':').map(Number);

    // Check if slot is already in the past for today (+2 hours booking buffer)
    const isPast =
      isToday &&
      (currentHourWITA > slotHour || (currentHourWITA === slotHour && currentMinuteWITA > slotMinute) || (slotHour - currentHourWITA < 2));

    const overlappingBookings = existingBookings.filter((b) => {
      return b.start_time === slot.start;
    });

    const availableCleaners = Math.max(0, allCleaners.length - overlappingBookings.length);
    const hasCapacity = availableCleaners > 0;

    let isAvailable = !isPast && hasCapacity;
    let reason: string | undefined = undefined;

    if (isPast) {
      reason = 'Waktu sudah terlewat (min. buffer 2 jam)';
    } else if (!hasCapacity) {
      reason = 'Mitra cleaner penuh untuk slot ini';
    }

    return {
      id: `slot-${index}-${slot.start}`,
      startTime: slot.start,
      endTime: slot.end,
      availableCleaners,
      isAvailable,
      reason,
    };
  });
}
