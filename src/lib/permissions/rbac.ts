import { UserRole } from '../../types/database';

export const PERMISSIONS = {
  // Customer permissions
  VIEW_SERVICES: ['CUSTOMER', 'CLEANER', 'ADMIN', 'SUPER_ADMIN'],
  CREATE_BOOKING: ['CUSTOMER'],
  VIEW_OWN_BOOKINGS: ['CUSTOMER'],
  RESCHEDULE_OWN_BOOKING: ['CUSTOMER'],
  CANCEL_OWN_BOOKING: ['CUSTOMER'],
  SUBMIT_REVIEW: ['CUSTOMER'],
  MANAGE_OWN_ADDRESSES: ['CUSTOMER'],

  // Cleaner permissions
  VIEW_ASSIGNED_JOBS: ['CLEANER'],
  ACCEPT_REJECT_JOB: ['CLEANER'],
  UPDATE_JOB_STATUS: ['CLEANER'],
  UPLOAD_JOB_PROOF: ['CLEANER'],
  VIEW_CLEANER_EARNINGS: ['CLEANER'],
  MANAGE_CLEANER_AVAILABILITY: ['CLEANER'],

  // Admin permissions
  MANAGE_CUSTOMERS: ['ADMIN', 'SUPER_ADMIN'],
  MANAGE_CLEANERS: ['ADMIN', 'SUPER_ADMIN'],
  MANAGE_SERVICES: ['ADMIN', 'SUPER_ADMIN'],
  MANAGE_ALL_BOOKINGS: ['ADMIN', 'SUPER_ADMIN'],
  ASSIGN_CLEANER: ['ADMIN', 'SUPER_ADMIN'],
  MANAGE_PRICING: ['ADMIN', 'SUPER_ADMIN'],
  MANAGE_COUPONS: ['ADMIN', 'SUPER_ADMIN'],
  VIEW_FINANCIAL_REPORTS: ['ADMIN', 'SUPER_ADMIN'],
  ISSUE_REFUND: ['ADMIN', 'SUPER_ADMIN'],

  // Super Admin only
  MANAGE_ADMINS: ['SUPER_ADMIN'],
  VIEW_AUDIT_LOGS: ['SUPER_ADMIN'],
  MANAGE_PLATFORM_CONFIG: ['SUPER_ADMIN'],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole | undefined | null, permission: PermissionKey): boolean {
  if (!role) return false;
  const allowedRoles = PERMISSIONS[permission] as readonly string[];
  return allowedRoles.includes(role);
}

export function canAccessCustomerPortal(role?: UserRole): boolean {
  return role === 'CUSTOMER';
}

export function canAccessCleanerPortal(role?: UserRole): boolean {
  return role === 'CLEANER';
}

export function canAccessAdminPortal(role?: UserRole): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}
