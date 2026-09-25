/**
 * Pengaturan Rekening Bank Owner & Konfigurasi Pencairan Dana (Payout / Disbursement)
 * Terhubung dengan sistem Midtrans Merchant dan rekening penampungan di Kab. Penajam Paser Utara.
 */

export interface OwnerBankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  qrisMerchantName: string;
  midtransMerchantId: string;
  payoutSchedule: 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MANUAL';
  enableManualTransferOption: boolean;
  notes?: string;
  lastUpdated: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'SUCCESS' | 'PROCESSING' | 'PENDING';
  referenceNumber: string;
  timestamp: string;
}

const STORAGE_KEY = 'bersihin_owner_bank_config';
const PAYOUT_STORAGE_KEY = 'bersihin_owner_payout_history';

// Default rekening awal Owner Bersih.in di Penajam Paser Utara
export const DEFAULT_OWNER_BANK: OwnerBankAccount = {
  bankName: 'Bank Mandiri',
  bankCode: 'MANDIRI',
  accountNumber: '1490012389712',
  accountHolder: 'CV BERSIH IN NUSANTARA PPU',
  branch: 'KCP Penajam, Kab. Penajam Paser Utara',
  qrisMerchantName: 'BERSIH.IN PENAJAM',
  midtransMerchantId: 'M-BERS-882910',
  payoutSchedule: 'DAILY',
  enableManualTransferOption: true,
  notes: 'Rekening operasional utama penerimaan hasil booking layanan kebersihan PPU & Kawasan IKN Sepaku.',
  lastUpdated: new Date().toISOString(),
};

export const SUPPORTED_BANKS = [
  { code: 'MANDIRI', name: 'Bank Mandiri', iconColor: 'text-amber-600', bg: 'bg-amber-50' },
  { code: 'BCA', name: 'Bank Central Asia (BCA)', iconColor: 'text-blue-600', bg: 'bg-blue-50' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)', iconColor: 'text-blue-700', bg: 'bg-blue-50' },
  { code: 'BNI', name: 'Bank Negara Indonesia (BNI)', iconColor: 'text-teal-600', bg: 'bg-teal-50' },
  { code: 'BANKALTIMTARA', name: 'Bankaltimtara (BPD Kaltim-Kaltara)', iconColor: 'text-emerald-700', bg: 'bg-emerald-50' },
  { code: 'BSI', name: 'Bank Syariah Indonesia (BSI)', iconColor: 'text-emerald-600', bg: 'bg-emerald-50' },
  { code: 'PERMATA', name: 'Bank Permata', iconColor: 'text-purple-600', bg: 'bg-purple-50' },
];

export function getOwnerBankAccount(): OwnerBankAccount {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load owner bank config:', e);
  }
  return DEFAULT_OWNER_BANK;
}

export function saveOwnerBankAccount(config: Partial<OwnerBankAccount>): OwnerBankAccount {
  const current = getOwnerBankAccount();
  const updated: OwnerBankAccount = {
    ...current,
    ...config,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save owner bank config:', e);
  }
  return updated;
}

export function getPayoutHistory(): PayoutRecord[] {
  try {
    const saved = localStorage.getItem(PAYOUT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }

  const initialPayouts: PayoutRecord[] = [
    {
      id: 'WD-20260920-001',
      amount: 1450000,
      bankName: 'Bank Mandiri',
      accountNumber: '1490012389712',
      accountHolder: 'CV BERSIH IN NUSANTARA PPU',
      status: 'SUCCESS',
      referenceNumber: 'DISB-MANDIRI-98124',
      timestamp: '2026-09-20T17:00:00Z',
    },
    {
      id: 'WD-20260918-002',
      amount: 875000,
      bankName: 'Bank Mandiri',
      accountNumber: '1490012389712',
      accountHolder: 'CV BERSIH IN NUSANTARA PPU',
      status: 'SUCCESS',
      referenceNumber: 'DISB-MANDIRI-77612',
      timestamp: '2026-09-18T17:00:00Z',
    },
  ];
  return initialPayouts;
}

export function requestOwnerPayout(amount: number): PayoutRecord {
  const currentBank = getOwnerBankAccount();
  const newRecord: PayoutRecord = {
    id: `WD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    amount,
    bankName: currentBank.bankName,
    accountNumber: currentBank.accountNumber,
    accountHolder: currentBank.accountHolder,
    status: 'SUCCESS',
    referenceNumber: `DISB-${currentBank.bankCode}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    timestamp: new Date().toISOString(),
  };

  const currentHistory = getPayoutHistory();
  const updatedHistory = [newRecord, ...currentHistory];
  try {
    localStorage.setItem(PAYOUT_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save payout history:', e);
  }

  return newRecord;
}
