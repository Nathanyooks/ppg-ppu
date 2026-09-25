/**
 * Konfigurasi Finansial & Parameter Bisnis Platform Bersih.in
 * Khusus dikelola secara dinamis oleh Akun Master / Superadmin.
 * Mengontrol prosentase bagi hasil mitra, biaya transport wilayah PPU/IKN, dan biaya kamar ekstra.
 */

export interface PlatformSettings {
  mitraCommissionPercent: number; // e.g. 80 (%)
  platformFeePercent: number; // e.g. 20 (%)
  minPayoutAmount: number; // e.g. 50000 (Rp)
  transportFees: {
    penajam: number;
    sepaku: number;
    waru: number;
    babulu: number;
  };
  extraBedroomFee: number; // e.g. 25000 (Rp)
  extraBathroomFee: number; // e.g. 30000 (Rp)
  emergencySameDayFee: number; // e.g. 30000 (Rp)
  lastUpdated: string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  mitraCommissionPercent: 80,
  platformFeePercent: 20,
  minPayoutAmount: 50000,
  transportFees: {
    penajam: 10000,
    waru: 20000,
    babulu: 30000,
    sepaku: 35000,
  },
  extraBedroomFee: 25000,
  extraBathroomFee: 30000,
  emergencySameDayFee: 30000,
  lastUpdated: new Date().toISOString(),
};

const STORAGE_KEY = 'bersihin_platform_settings';

export function getPlatformSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PLATFORM_SETTINGS,
        ...parsed,
        transportFees: {
          ...DEFAULT_PLATFORM_SETTINGS.transportFees,
          ...(parsed.transportFees || {}),
        },
      };
    }
  } catch (e) {
    console.warn('Gagal membaca platform settings:', e);
  }
  return DEFAULT_PLATFORM_SETTINGS;
}

export function updatePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  const current = getPlatformSettings();
  const next: PlatformSettings = {
    ...current,
    ...updates,
    transportFees: {
      ...current.transportFees,
      ...(updates.transportFees || {}),
    },
    platformFeePercent:
      updates.mitraCommissionPercent !== undefined
        ? Math.max(0, 100 - updates.mitraCommissionPercent)
        : current.platformFeePercent,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Gagal menyimpan platform settings:', e);
  }

  return next;
}

export function resetPlatformSettings(): PlatformSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Gagal reset platform settings:', e);
  }
  return DEFAULT_PLATFORM_SETTINGS;
}
