import { Service, ServiceAddon, PricingRule, Coupon } from '../../types/database';
import { dbStore } from '../database/supabaseClient';
import { getPpuTransportFee } from '../constants/ppuLocations';
import { getPlatformSettings } from '../constants/platformSettings';

export interface PricingCalculationInput {
  serviceId: string;
  propertyType: string;
  propertyArea: number; // m²
  bedrooms: number;
  bathrooms: number;
  selectedAddonIds: { addonId: string; quantity: number }[];
  couponCode?: string;
  city?: string;
  district?: string;
}

export interface PricingBreakdown {
  service: Service;
  propertyType: string;
  propertyArea: number;
  basePrice: number;
  areaPriceAdjustment: number;
  roomAdjustment: number;
  addonDetails: {
    addon: ServiceAddon;
    quantity: number;
    totalPrice: number;
  }[];
  addonTotal: number;
  transportFee: number;
  discountAmount: number;
  appliedCoupon?: Coupon;
  couponError?: string;
  subtotal: number;
  totalPrice: number;
  estimatedDurationMinutes: number;
}

/**
 * Server-authoritative pricing engine for Bersih.in
 * Calculates price deterministically based on database pricing rules,
 * property area tiers, extra rooms, add-ons, location transport, and verified coupons.
 */
export function calculateBookingPrice(input: PricingCalculationInput): PricingBreakdown {
  const services = dbStore.getServices();
  const service = services.find((s) => s.id === input.serviceId) || services[0];
  const pricingRules = dbStore.getPricingRules();
  const addons = dbStore.getAddons();
  const coupons = dbStore.getCoupons();

  // 1. Base Service Price
  let basePrice = service.base_price;
  let estimatedDuration = service.base_duration_minutes;

  // 2. Area Tier & Property Pricing Rule Match
  const matchingRule = pricingRules.find(
    (rule) =>
      rule.service_id === service.id &&
      rule.property_type.toLowerCase() === input.propertyType.toLowerCase() &&
      input.propertyArea >= rule.min_area &&
      input.propertyArea <= rule.max_area
  );

  let areaPriceAdjustment = 0;
  if (matchingRule) {
    areaPriceAdjustment = Math.max(0, matchingRule.price - basePrice);
    estimatedDuration = Math.max(estimatedDuration, matchingRule.duration_minutes);
  } else {
    // Dynamic formula fallback if area exceeds standard tier rules (>200 m²)
    if (input.propertyArea > 100) {
      const extraBlocks = Math.ceil((input.propertyArea - 100) / 50);
      areaPriceAdjustment = extraBlocks * 60000;
      estimatedDuration += extraBlocks * 30;
    }
  }

  // 3. Extra Room Adjustment
  // Base includes up to 2 bedrooms and 1 bathroom. Extra adds minimal fee.
  const platformSettings = getPlatformSettings();
  const extraBedrooms = Math.max(0, input.bedrooms - 2);
  const extraBathrooms = Math.max(0, input.bathrooms - 1);
  const roomAdjustment = (extraBedrooms * platformSettings.extraBedroomFee) + (extraBathrooms * platformSettings.extraBathroomFee);
  estimatedDuration += (extraBedrooms * 15) + (extraBathrooms * 20);

  // 4. Add-ons Calculation
  const addonDetails: { addon: ServiceAddon; quantity: number; totalPrice: number }[] = [];
  let addonTotal = 0;

  for (const item of input.selectedAddonIds) {
    const addon = addons.find((a) => a.id === item.addonId);
    if (addon && addon.is_active && item.quantity > 0) {
      const lineTotal = addon.price * item.quantity;
      addonDetails.push({
        addon,
        quantity: item.quantity,
        totalPrice: lineTotal,
      });
      addonTotal += lineTotal;
      estimatedDuration += addon.duration_minutes * item.quantity;
    }
  }

  // 5. Transport Fee Calculation based on Kabupaten Penajam Paser Utara (PPU) service zones
  const transportFee = getPpuTransportFee(input.district);

  // Subtotal before coupon
  const subtotal = basePrice + areaPriceAdjustment + roomAdjustment + addonTotal + transportFee;

  // 6. Coupon & Promo Validation
  let discountAmount = 0;
  let appliedCoupon: Coupon | undefined = undefined;
  let couponError: string | undefined = undefined;

  if (input.couponCode && input.couponCode.trim()) {
    const cleanCode = input.couponCode.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === cleanCode && c.is_active);

    if (!coupon) {
      couponError = 'Kode kupon tidak valid atau sudah tidak aktif';
    } else {
      const now = new Date();
      const expiresAt = new Date(coupon.expires_at);

      if (now > expiresAt) {
        couponError = 'Kode kupon telah kadaluarsa';
      } else if (subtotal < coupon.minimum_transaction) {
        couponError = `Minimal transaksi untuk kupon ini adalah Rp ${coupon.minimum_transaction.toLocaleString('id-ID')}`;
      } else {
        appliedCoupon = coupon;
        if (coupon.type === 'PERCENTAGE') {
          const rawDiscount = Math.round((subtotal * coupon.value) / 100);
          discountAmount = coupon.maximum_discount
            ? Math.min(rawDiscount, coupon.maximum_discount)
            : rawDiscount;
        } else {
          // FIXED_AMOUNT
          discountAmount = Math.min(coupon.value, subtotal);
        }
      }
    }
  }

  // 7. Final Net Price
  const totalPrice = Math.max(0, subtotal - discountAmount);

  return {
    service,
    propertyType: input.propertyType,
    propertyArea: input.propertyArea,
    basePrice,
    areaPriceAdjustment,
    roomAdjustment,
    addonDetails,
    addonTotal,
    transportFee,
    discountAmount,
    appliedCoupon,
    couponError,
    subtotal,
    totalPrice,
    estimatedDurationMinutes: estimatedDuration,
  };
}
